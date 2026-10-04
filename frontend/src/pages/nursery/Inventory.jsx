import React, { useState, useEffect } from 'react';
import { getNurseryPlants } from '../../services/plantService';
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
      let fetchedPlants = response.data.content || [];
      
      // Client-side stock filtering since backend might not have dedicated stock filters
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
      setError('Failed to load inventory data.');
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

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by name or SKU..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minWidth: '250px' }}
        />
        <select 
          value={stockFilter} 
          onChange={(e) => setStockFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">All Stock Levels</option>
          <option value="in">In Stock (> 5)</option>
          <option value="low">Low Stock (1 - 5)</option>
          <option value="out">Out of Stock (0)</option>
        </select>
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
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading inventory...</div>
        ) : plants.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No inventory matches found.</div>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {plant.imageUrl ? (
                          <img src={plant.imageUrl} alt={plant.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: '#eee' }}></div>
                        )}
                        <strong>{plant.name}</strong>
                      </div>
                    </td>
                    <td>{plant.sku}</td>
                    <td>₹{plant.price}</td>
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
    </div>
  );
};

export default Inventory;
