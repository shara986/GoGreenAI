import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { nurseryService } from '../../services/api';
import './NearbyNurseries.css';

const DEFAULT_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=600&q=80',
];

const NearbyNurseries = () => {
  const [nurseries, setNurseries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNursery, setSelectedNursery] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Fetch nurseries list from API
  const fetchNurseries = useCallback(async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await nurseryService.getAllNurseries(query);
      const data = response.data?.data || response.data || [];
      setNurseries(data);
      if (data.length > 0) {
        setSelectedNursery(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch nurseries:', err);
      setError('Unable to load nearby nurseries. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = searchParams.get('city') || searchParams.get('q') || '';
    if (q) setSearchQuery(q);
    fetchNurseries(q);
  }, [fetchNurseries, searchParams]);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;

    // Check if window.L (Leaflet) is available
    if (typeof window.L === 'undefined') {
      console.warn('Leaflet script is still loading or unavailable.');
      return;
    }

    const L = window.L;

    // Create map instance if not already initialized
    if (!mapInstanceRef.current) {
      const initialLat = selectedNursery?.latitude || 16.7050;
      const initialLng = selectedNursery?.longitude || 74.2433;

      const map = L.map(mapRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => map.removeLayer(marker));
    markersRef.current = {};

    if (nurseries.length === 0) return;

    // Custom Icon Generator
    const createCustomIcon = (isSelected) => {
      const color = isSelected ? '#1b5e20' : '#2e7d32';
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="42">
          <path fill="${color}" stroke="#ffffff" stroke-width="2" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24C24 5.37 18.63 0 12 0zm0 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
        </svg>
      `;
      return L.divIcon({
        className: `nursery-map-pin ${isSelected ? 'active-pin' : ''}`,
        html: svg,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -36],
      });
    };

    // Add markers for nurseries
    const bounds = L.latLngBounds();

    nurseries.forEach((nursery, idx) => {
      const lat = nursery.latitude || 16.7050 + (idx * 0.008);
      const lng = nursery.longitude || 74.2433 + (idx * 0.008);

      bounds.extend([lat, lng]);

      const isSelected = selectedNursery?.id === nursery.id;
      const marker = L.marker([lat, lng], {
        icon: createCustomIcon(isSelected),
      }).addTo(map);

      const popupContent = `
        <div class="leaflet-popup-card">
          <h4>${nursery.name}</h4>
          <p class="popup-address">📍 ${nursery.address}, ${nursery.city}</p>
          ${nursery.contactPhone ? `<p class="popup-phone">📞 ${nursery.contactPhone}</p>` : ''}
          <button id="view-nursery-btn-${nursery.id}" class="popup-action-btn">
            View Nursery & Inventory &rarr;
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedNursery(nursery);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-nursery-btn-${nursery.id}`);
        if (btn) {
          btn.onclick = () => {
            navigate(`/catalog?nurseryId=${nursery.id}`);
          };
        }
      });

      markersRef.current[nursery.id] = marker;
    });

    if (selectedNursery && markersRef.current[selectedNursery.id]) {
      const selectedLat = selectedNursery.latitude || 16.7050;
      const selectedLng = selectedNursery.longitude || 74.2433;
      map.panTo([selectedLat, selectedLng], { animate: true });
    } else if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [nurseries, selectedNursery, navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNurseries(searchQuery);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setIsLocating(false);

        if (mapInstanceRef.current && window.L) {
          const L = window.L;
          mapInstanceRef.current.setView([latitude, longitude], 13);

          L.circle([latitude, longitude], {
            color: '#2e7d32',
            fillColor: '#81c784',
            fillOpacity: 0.3,
            radius: 2000,
          }).addTo(mapInstanceRef.current);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setIsLocating(false);
        alert('Could not detect your exact position. Searching default area.');
      }
    );
  };

  return (
    <div className="nearby-nurseries-page">
      {/* Page Header */}
      <div className="page-header-banner">
        <div className="header-top-row">
          <div>
            <h1 className="main-title">Discover Nearby Nurseries</h1>
            <p className="main-subtitle">
              Explore independent local growers, inspect live inventories, and place direct orders.
            </p>
          </div>
          <button className="btn-find-near-me" onClick={handleLocateMe} disabled={isLocating}>
            {isLocating ? '📡 Locating...' : '📍 Find Nurseries Near Me'}
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-bar-form">
          <div className="search-input-wrapper">
            <span className="input-icon">📍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search nurseries by city (e.g. Kolhapur, Pune)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-search-submit">
            Search
          </button>
        </form>
      </div>

      {/* Main Content Area: Cards List + Interactive Map */}
      <div className="nearby-content-layout">
        {/* Left Column: Cards List */}
        <div className="nurseries-list-column">
          {loading ? (
            <div className="nurseries-loading">
              <div className="spinner"></div>
              <p>Finding local plant nurseries near you...</p>
            </div>
          ) : error ? (
            <div className="nurseries-error-alert">{error}</div>
          ) : nurseries.length === 0 ? (
            <div className="empty-nurseries-state">
              <span className="empty-icon">🪴</span>
              <h3>No Nurseries Found</h3>
              <p>No registered plant nurseries found matching "{searchQuery}". Try searching for another city!</p>
            </div>
          ) : (
            <div className="nursery-cards-scroll">
              {nurseries.map((nursery, index) => {
                const isSelected = selectedNursery?.id === nursery.id;
                const imageSrc = nursery.logoUrl || DEFAULT_FALLBACK_IMAGES[index % DEFAULT_FALLBACK_IMAGES.length];

                return (
                  <div
                    key={nursery.id}
                    className={`nursery-card ${isSelected ? 'selected-nursery-card' : ''}`}
                    onClick={() => setSelectedNursery(nursery)}
                  >
                    <div className="nursery-card-image-wrapper">
                      <img src={imageSrc} alt={nursery.name} className="nursery-card-img" />
                    </div>

                    <div className="nursery-card-body">
                      <h3 className="nursery-title">{nursery.name}</h3>

                      <div className="nursery-info-line">
                        <span className="info-icon">📍</span>
                        <span className="info-text">{nursery.address}, {nursery.city} {nursery.postalCode || ''}</span>
                      </div>

                      {nursery.contactPhone && (
                        <div className="nursery-info-line">
                          <span className="info-icon">📞</span>
                          <span className="info-text">{nursery.contactPhone}</span>
                        </div>
                      )}

                      <div className="nursery-card-footer">
                        <span className="verified-badge">
                          ✓ Verified Local Partner
                        </span>
                        <button
                          className="btn-view-inventory"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/catalog?nurseryId=${nursery.id}`);
                          }}
                        >
                          View Inventory & Details &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Interactive OpenStreetMap Container */}
        <div className="nursery-map-column">
          <div className="map-wrapper">
            <div ref={mapRef} id="nearby-leaflet-map" className="leaflet-map-element" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyNurseries;
