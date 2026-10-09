import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNurseryPlants, disablePlant, enablePlant, deleteNurseryPlant } from '../../services/plantService';
import { getCategories } from '../../services/categoryService';
import { PlantTableSkeleton } from '../../components/common/Skeletons';
import './NurseryPages.css';

const PLANT_TYPES = [
  'INDOOR', 'OUTDOOR', 'SUCCULENT', 'FLOWERING', 'TREE', 'SHRUB', 'HERB', 'AQUATIC', 'CLIMBER', 'OTHER'
];

const PlantManagement = () => {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Confirmation Modal State
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Search and Filter states
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [plantType, setPlantType] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    const fetchCat = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCat();
  }, []);
  
  const fetchPlants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (categoryId) params.categoryId = categoryId;
      if (plantType) params.plantType = plantType;
      if (activeFilter !== '') params.active = activeFilter === 'true';
      
      const response = await getNurseryPlants(params);
      setPlants(response.data?.content || response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching plants:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to access this section.');
      } else if (!err.response) {
        setError('Unable to connect to the server. Please try again.');
      } else {
        setError('Failed to load plants.');
      }
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchPlants();
  }, [search, categoryId, plantType, activeFilter]);

  const confirmDeactivate = (plant) => {
    setDeactivateTarget(plant);
  };

  const handleDisableConfirm = async () => {
    if (!deactivateTarget) return;
    try {
      await disablePlant(deactivateTarget.id);
      setDeactivateTarget(null);
      fetchPlants();
    } catch (err) {
      console.error('Error disabling plant:', err);
      alert('Failed to deactivate plant. Please try again.');
    }
  };

  const handleEnable = async (plant) => {
    try {
      await enablePlant(plant.id);
      fetchPlants();
      setSuccessMessage('Plant activated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error enabling plant:', err);
      alert('Failed to activate plant. Please try again.');
    }
  };

  const confirmDelete = (plant) => {
    setDeleteTarget(plant);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteNurseryPlant(deleteTarget.id);
      setDeleteTarget(null);
      fetchPlants();
      setSuccessMessage('Plant deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting plant:', err);
      alert('Failed to delete plant. Please try again.');
    }
  };

  return (
    <div className="nursery-page">
      <div className="page-header">
        <h1 className="page-title">Manage Plants</h1>
        <Link to="/nursery/plants/add" className="btn-primary">+ Add New Plant</Link>
      </div>

      {error && (
        <div className="error-message" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button onClick={fetchPlants} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>
            Retry
          </button>
        </div>
      )}

      {successMessage && (
        <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', borderLeft: '4px solid #2e7d32' }}>
          {successMessage}
        </div>
      )}

      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by plant name or SKU..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', minWidth: '220px', flex: '1' }}
        />
        <select 
          value={categoryId} 
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select 
          value={plantType} 
          onChange={(e) => setPlantType(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">All Plant Types</option>
          {PLANT_TYPES.map((pt) => (
            <option key={pt} value={pt}>{pt}</option>
          ))}
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
            <div style={{ padding: '30px', textAlign: 'center', color: '#666' }}>No plants found matching your search criteria.</div>
          ) : (
            <table className="nursery-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Plant Name</th>
                  <th>Scientific Name</th>
                  <th>Category</th>
                  <th>Plant Type</th>
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
                        <img 
                          src={plant.imageUrl} 
                          alt={plant.name} 
                          className="plant-thumbnail"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=100&auto=format&fit=crop';
                          }}
                        />
                      ) : (
                        <div className="plant-thumbnail" style={{ backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌿</div>
                      )}
                    </td>
                    <td>
                      <strong>{plant.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>SKU: {plant.sku}</div>
                    </td>
                    <td><em style={{ color: '#555' }}>{plant.scientificName || 'N/A'}</em></td>
                    <td>{plant.category?.name || 'N/A'}</td>
                    <td>{plant.plantType}</td>
                    <td><strong>₹{plant.price}</strong></td>
                    <td>{plant.stock}</td>
                    <td>
                      <span className={`status-badge ${plant.active ? 'status-active' : 'status-inactive'}`}>
                        {plant.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-links">
                        <Link to={`/nursery/plants/${plant.id}/edit`} className="action-btn">Edit</Link>
                        {plant.active ? (
                          <button 
                            onClick={() => confirmDeactivate(plant)} 
                            className="action-btn"
                          >
                            Disable
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleEnable(plant)} 
                            className="action-btn"
                            style={{ color: '#2e7d32' }}
                          >
                            Enable
                          </button>
                        )}
                        <button 
                          onClick={() => confirmDelete(plant)} 
                          className="action-btn delete"
                          style={{ color: '#d32f2f', paddingLeft: '8px', marginLeft: '8px', borderLeft: '1px solid #ccc' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Confirmation Modal for Deactivation */}
      {deactivateTarget && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', maxWidth: '420px', width: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <h3 style={{ marginTop: 0, color: '#1a4331' }}>Deactivate Plant</h3>
            <p style={{ color: '#555' }}>Are you sure you want to deactivate this plant (<strong>{deactivateTarget.name}</strong>)? Customers will not be able to see it.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setDeactivateTarget(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleDisableConfirm} className="btn-primary" style={{ backgroundColor: '#f57c00' }}>Deactivate</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {deleteTarget && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', maxWidth: '420px', width: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <h3 style={{ marginTop: 0, color: '#d32f2f' }}>Delete Plant</h3>
            <p style={{ color: '#555' }}>Are you sure you want to permanently delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleDeleteConfirm} className="btn-primary" style={{ backgroundColor: '#d32f2f' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantManagement;
