import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPlant, updatePlant, getNurseryPlantById } from '../../services/plantService';
import { getCategories } from '../../services/categoryService';
import { PlantFormSkeleton } from '../../components/common/Skeletons';
import './NurseryPages.css';

const PLANT_TYPES = [
  'INDOOR', 'OUTDOOR', 'SUCCULENT', 'FLOWERING', 'TREE', 'SHRUB', 'HERB', 'AQUATIC', 'CLIMBER', 'OTHER'
];

const PlantForm = () => {
  const { plantId } = useParams();
  const isEditMode = !!plantId;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    sku: '',
    categoryId: '',
    description: '',
    careInstructions: '',
    price: '',
    stock: '',
    plantType: 'INDOOR',
    imageUrl: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await getCategories();
        setCategories(catRes.data || []);

        if (isEditMode) {
          const plantRes = await getNurseryPlantById(plantId);
          const p = plantRes.data;
          setFormData({
            name: p.name || '',
            scientificName: p.scientificName || '',
            sku: p.sku || '',
            categoryId: p.category?.id || '',
            description: p.description || '',
            careInstructions: p.careInstructions || '',
            price: p.price || '',
            stock: p.stock || 0,
            plantType: p.plantType || 'INDOOR',
            imageUrl: p.imageUrl || ''
          });
        }
      } catch (err) {
        console.error('Error fetching data for form:', err);
        if (err.response?.status === 404) {
          setError('Plant not found.');
        } else if (err.response?.status === 401) {
          setError('Your session has expired. Please login again.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to access this section.');
        } else if (!err.response) {
          setError('Unable to connect to the server. Please try again.');
        } else {
          setError('Failed to load form data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [plantId, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Strict Validation
    if (!formData.name.trim() || !formData.sku.trim() || !formData.categoryId || !formData.plantType) {
      setError('Please check the entered information. Name, SKU, Category, and Plant Type are required.');
      return;
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      setError('Price must be greater than 0.');
      return;
    }

    if (isNaN(formData.stock) || Number(formData.stock) < 0) {
      setError('Stock cannot be negative.');
      return;
    }

    if (formData.imageUrl && !formData.imageUrl.match(/^(https?:\/\/|\/)/)) {
      setError('Please provide a valid image URL (e.g. https://...).');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode) {
        await updatePlant(plantId, formData);
      } else {
        await createPlant(formData);
      }
      navigate('/nursery/plants');
    } catch (err) {
      console.error('Error saving plant:', err);
      setError(err.response?.data?.message || 'Failed to save plant. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="nursery-page">
        <div className="page-header">
          <h1 className="page-title">{isEditMode ? 'Edit Plant' : 'Add New Plant'}</h1>
        </div>
        <PlantFormSkeleton />
      </div>
    );
  }

  return (
    <div className="nursery-page">
      <div className="page-header">
        <h1 className="page-title">{isEditMode ? 'Edit Plant' : 'Add New Plant'}</h1>
      </div>

      <div className="form-card">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Plant Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Scientific Name</label>
            <input type="text" name="scientificName" value={formData.scientificName} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>SKU *</label>
            <input type="text" name="sku" value={formData.sku} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
              <option value="">Select a Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Plant Type *</label>
            <select name="plantType" value={formData.plantType} onChange={handleChange} required>
              {PLANT_TYPES.map((pt) => (
                <option key={pt} value={pt}>{pt}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Price (₹) *</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required min="0.01" />
          </div>

          <div className="form-group">
            <label>Stock *</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4"></textarea>
          </div>

          <div className="form-group full-width">
            <label>Care Instructions</label>
            <textarea name="careInstructions" value={formData.careInstructions} onChange={handleChange} rows="4"></textarea>
          </div>

          <div className="form-group full-width form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : (isEditMode ? 'Update Plant' : 'Create Plant')}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/nursery/plants')} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlantForm;
