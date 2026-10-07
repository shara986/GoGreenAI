import React, { useState, useEffect } from 'react';
import { getNurseryPlants } from '../../services/plantService';
import { PlantTableSkeleton } from '../../components/common/Skeletons';
import './NurseryPages.css';

const Inventory = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and Filter states
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (activeFilter !== '') params.active = activeFilter === 'true';
      
      const response = await getNurseryPlants(params);
      let fetchedPlants = response.data?.content || response.data || [];
      
      // Client-side stock filtering
      if (stockFilter === 'out') {
        fetchedPlants = fetchedPlants.filter(p => p.stock === 0);
      } else if (stockFilter === 'low') {
        fetchedPlants = fetchedPlants.filter(p => p.stock > 0 && p.stock <= 5);
      } else if (stockFilter === 'in') {
        fetchedPlants = fetchedPlants.filter(p => p.stock > 5);
      }

      setPlants(fetchedPlants);
      setError('');
    } catch (err) {
      console.error('Error fetching inventory:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to access this section.');
      } else if (!err.response) {
        setError('Unable to connect to the server. Please try again.');
      } else {
        setError('Failed to load inventory data.');
      }
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchInventory();
  }, [search, stockFilter, activeFilter]);

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'status-out-stock' };
    if (stock <= 5) return { label: 'Low Stock', class: 'status-low-stock' };
    return { label: 'In Stock', class: 'status-in-stock' };
  };

  return (
    <div className="nursery-page">
      <div className="page-header">
        <h1 className="page-title">Inventory Management</h1>
      </div>

      {error && (
        <div className="error-message" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button onClick={fetchInventory} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>
            Retry
          </button>
        </div>
      )}

      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by plant name or SKU..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', minWidth: '220px', flex: '1' }}
        />
        <select 
          value={stockFilter} 
          onChange={(e) => setStockFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">All Stock Levels</option>
          <option value="in">In Stock (&gt; 5)</option>
          <option value="low">Low Stock (1 - 5)</option>
          <option value="out">Out of Stock (0)</option>
        </select>
        <select 
          value={activeFilter} 
          onChange={(e) => setActiveFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">All Statuses</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
      </div>

      {loading ? (
        <PlantTableSkeleton />
      ) : (
        <div className="table-container">
          {plants.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#666' }}>No inventory matches found.</div>
          ) : (
            <table className="nursery-table">
              <thead>
                <tr>
                  <th>Plant</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Stock Status</th>
                  <th>Active Status</th>
                </tr>
              </thead>
              <tbody>
                {plants.map((plant) => {
                  const stockStatus = getStockStatus(plant.stock);
                  return (
                    <tr key={plant.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {plant.imageUrl ? (
                            <img 
                              src={plant.imageUrl} 
                              alt={plant.name} 
                              style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=100&auto=format&fit=crop';
                              }}
                            />
                          ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌿</div>
                          )}
                          <div>
                            <strong>{plant.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#777' }}>{plant.category?.name || 'Uncategorized'}</div>
                          </div>
                        </div>
                      </td>
                      <td>{plant.sku}</td>
                      <td><strong>₹{plant.price}</strong></td>
                      <td><strong>{plant.stock}</strong></td>
                      <td>
                        <span className={`status-badge ${stockStatus.class}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${plant.active ? 'status-active' : 'status-inactive'}`}>
                          {plant.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Inventory;
