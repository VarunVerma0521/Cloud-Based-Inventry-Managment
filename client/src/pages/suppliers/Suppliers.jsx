import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import './Suppliers.css';

const Suppliers = () => {
  const { user } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({
    name: '',
    contact: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/suppliers');
      setSuppliers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setLoading(false);
    }
  };

  const openModal = (supplier = null) => {
    if (supplier) {
      setEditMode(true);
      setCurrentSupplier({
        _id: supplier._id,
        name: supplier.name,
        contact: supplier.contact,
        address: supplier.address,
      });
    } else {
      setEditMode(false);
      setCurrentSupplier({
        name: '',
        contact: '',
        address: '',
      });
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentSupplier({ name: '', contact: '', address: '' });
    setError('');
  };

  const handleChange = (e) => {
    setCurrentSupplier({ ...currentSupplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editMode) {
        await API.put(`/suppliers/${currentSupplier._id}`, currentSupplier);
        setSuccess('Supplier updated successfully!');
      } else {
        await API.post('/suppliers', currentSupplier);
        setSuccess('Supplier created successfully!');
      }
      fetchSuppliers();
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await API.delete(`/suppliers/${id}`);
        fetchSuppliers();
        setSuccess('Supplier deleted successfully!');
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
        <p>Loading suppliers...</p>
      </div>
    );
  }

  return (
    <div className="suppliers-page">
      <div className="page-header">
        <h1>Suppliers Management</h1>
        {canEdit && (
          <button className="btn-primary" onClick={() => openModal()}>
            + Add Supplier
          </button>
        )}
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Suppliers Grid */}
      <div className="suppliers-grid">
        {suppliers.length > 0 ? (
          suppliers.map((supplier) => (
            <div key={supplier._id} className="supplier-card">
              <div className="supplier-icon">🚚</div>
              <h3>{supplier.name}</h3>
              <div className="supplier-details">
                <div className="detail-item">
                  <span className="detail-label">📞 Contact:</span>
                  <span className="detail-value">{supplier.contact}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📍 Address:</span>
                  <span className="detail-value">
                    {supplier.address || 'Not provided'}
                  </span>
                </div>
              </div>
              <div className="supplier-meta">
                <span className="created-by">
                  By: {supplier.createdBy?.name || 'Unknown'}
                </span>
              </div>
              {canEdit && (
                <div className="supplier-actions">
                  <button
                    className="btn-edit"
                    onClick={() => openModal(supplier)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(supplier._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-data-card">
            <p>No suppliers found. Add one to get started!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit Supplier' : 'Add New Supplier'}</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-group">
                <label>Supplier Name *</label>
                <input
                  type="text"
                  name="name"
                  value={currentSupplier.name}
                  onChange={handleChange}
                  placeholder="e.g., ABC Suppliers"
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Number *</label>
                <input
                  type="text"
                  name="contact"
                  value={currentSupplier.contact}
                  onChange={handleChange}
                  placeholder="e.g., +91-9876543210"
                  required
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={currentSupplier.address}
                  onChange={handleChange}
                  placeholder="Full address of supplier"
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editMode ? 'Update Supplier' : 'Create Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
