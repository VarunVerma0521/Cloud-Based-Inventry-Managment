import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import './Sales.css';

const Sales = () => {
  const { user } = useContext(AuthContext);
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSale, setNewSale] = useState({
    product: '',
    quantitySold: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/sales');
      setSales(data.sales || data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const openModal = () => {
    setNewSale({ product: '', quantitySold: '' });
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setShowModal(false);
    setNewSale({ product: '', quantitySold: '' });
    setError('');
  };

  const handleChange = (e) => {
    setNewSale({ ...newSale, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await API.post('/sales', newSale);
      setSuccess('Sale recorded successfully!');
      fetchSales();
      fetchProducts(); // Refresh to update quantities
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Sale failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale? Stock will be restored.')) {
      try {
        await API.delete(`/sales/${id}`);
        fetchSales();
        fetchProducts();
        setSuccess('Sale deleted and stock restored!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError(error.response?.data?.message || 'Delete failed');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const canCreate = user?.role === 'admin' || user?.role === 'staff';
  const canDelete = user?.role === 'admin';

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading sales...</p>
      </div>
    );
  }

  return (
    <div className="sales-page">
      <div className="page-header">
        <h1>Sales Management</h1>
        {canCreate && (
          <button className="btn-primary" onClick={openModal}>
            + Record Sale
          </button>
        )}
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Sales Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price/Unit</th>
              <th>Total</th>
              <th>Sold By</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale.productName}</td>
                  <td>{sale.quantitySold}</td>
                  <td>₹{sale.pricePerUnit?.toLocaleString()}</td>
                  <td className="total-price">₹{sale.totalPrice?.toLocaleString()}</td>
                  <td>{sale.soldBy?.name || 'Unknown'}</td>
                  <td>{new Date(sale.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    {canDelete ? (
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(sale._id)}
                      >
                        🗑️
                      </button>
                    ) : (
                      <span className="read-only">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No sales found. Record your first sale!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Record New Sale</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-group">
                <label>Select Product *</label>
                <select
                  name="product"
                  value={newSale.product}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} - ₹{product.price} (Stock: {product.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity Sold *</label>
                <input
                  type="number"
                  name="quantitySold"
                  value={newSale.quantitySold}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  required
                  min="1"
                />
              </div>

              <div className="sale-preview">
                {newSale.product && newSale.quantitySold && (
                  <>
                    <p className="preview-label">Sale Preview:</p>
                    <p className="preview-total">
                      Total: ₹
                      {(
                        products.find((p) => p._id === newSale.product)?.price *
                        newSale.quantitySold
                      ).toLocaleString()}
                    </p>
                  </>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Record Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
