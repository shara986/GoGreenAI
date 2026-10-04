import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getNurseryPlants, disablePlant, enablePlant } from '../../services/plantService';
import './NurseryPages.css';

const PlantManagement = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and Filter states
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  
  const fetchPlants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (activeFilter !== '') params.active = activeFilter === 'true';
      
      const response = await getNurseryPlants(params);
      // Assuming response.data.content is the array of plants (paginated)
      setPlants(response.data.content || []);
      setError('');
    } catch (err) {
      console.error('Error fetching plants:', err);
      setError('Failed to load plants.');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchPlants();
  }, [search, activeFilter]);

  const handleToggleStatus = async (plant) => {
    if (plant.active) {
      if (!window.confirm('Are you sure you want to deactivate this plant?')) return;
    }

    try {
      if (plant.active) {
        await disablePlant(plant.id);
      } else {
        await enablePlant(plant.id);
      }
      fetchPlants(); // Refresh list
    } catch (err) {
      console.error('Error toggling plant status:', err);
      alert('Failed to update plant status.');
    }
  };

  return (
    <div className="nursery-page">
      <div className="page-header">
        <h1 className="page-title">Manage Plants</h1>
        <Link to="/nursery/plants/add" className="btn-primary">+ Add New Plant</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Search by name or SKU..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minWidth: '250px' }}
        />
        <select 
          value={activeFilter} 
          onChange={(e) => setActiveFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">All Statuses</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading plants...</div>
        ) : plants.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No plants found.</div>
        ) : (
          <table className="nursery-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Type</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plants.map((plant) => (
                <tr key={plant.id}>
                  <td>
                    {plant.imageUrl ? (
                      <img src={plant.imageUrl} alt={plant.name} className="plant-thumbnail" />
                    ) : (
                      <div className="plant-thumbnail" style={{ backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#999' }}>No Img</div>
                    )}
                  </td>
                  <td>
                    <strong>{plant.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{plant.scientificName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#999' }}>SKU: {plant.sku}</div>
                  </td>
                  <td>{plant.category?.name || 'N/A'}</td>
                  <td>{plant.plantType}</td>
                  <td>₹{plant.price}</td>
                  <td>{plant.stock}</td>
                  <td>
                    <span className={`status-badge ${plant.active ? 'status-active' : 'status-inactive'}`}>
                      {plant.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-links">
                      <Link to={`/nursery/plants/${plant.id}/edit`} className="action-btn">Edit</Link>
                      <button 
                        onClick={() => handleToggleStatus(plant)} 
                        className={`action-btn ${plant.active ? 'delete' : ''}`}
                      >
                        {plant.active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PlantManagement;
