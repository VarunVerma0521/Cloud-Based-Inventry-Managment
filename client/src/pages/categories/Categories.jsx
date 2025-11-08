import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import './Categories.css';

const Categories = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/categories');
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditMode(true);
      setCurrentCategory({
        _id: category._id,
        name: category.name,
        description: category.description,
      });
    } else {
      setEditMode(false);
      setCurrentCategory({
        name: '',
        description: '',
      });
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentCategory({ name: '', description: '' });
    setError('');
  };

  const handleChange = (e) => {
    setCurrentCategory({ ...currentCategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editMode) {
        await API.put(`/categories/${currentCategory._id}`, currentCategory);
        setSuccess('Category updated successfully!');
      } else {
        await API.post('/categories', currentCategory);
        setSuccess('Category created successfully!');
      }
      fetchCategories();
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await API.delete(`/categories/${id}`);
        fetchCategories();
        setSuccess('Category deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError(error.response?.data?.message || 'Delete failed');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'staff';

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Categories Management</h1>
        {canEdit && (
          <button className="btn-primary" onClick={() => openModal()}>
            + Add Category
          </button>
        )}
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Categories Grid */}
      <div className="categories-grid">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category._id} className="category-card">
              <div className="category-icon">🏷️</div>
              <h3>{category.name}</h3>
              <p>{category.description || 'No description'}</p>
              <div className="category-meta">
                <span className="created-by">
                  By: {category.createdBy?.name || 'Unknown'}
                </span>
              </div>
              {canEdit && (
                <div className="category-actions">
                  <button
                    className="btn-edit"
                    onClick={() => openModal(category)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(category._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-data-card">
            <p>No categories found. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit Category' : 'Add New Category'}</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  name="name"
                  value={currentCategory.name}
                  onChange={handleChange}
                  placeholder="e.g., Electronics, Furniture"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={currentCategory.description}
                  onChange={handleChange}
                  placeholder="Brief description of this category"
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editMode ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
