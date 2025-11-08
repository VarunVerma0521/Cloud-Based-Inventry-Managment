import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import './Users.css';

const Users = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/users');
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (id === user._id) {
      setError('You cannot delete your own account!');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/users/${id}`);
        fetchUsers();
        setSuccess('User deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError(error.response?.data?.message || 'Delete failed');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-admin';
      case 'staff':
        return 'badge-staff';
      case 'viewer':
        return 'badge-viewer';
      default:
        return '';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="access-denied">
        <h1>🚫 Access Denied</h1>
        <p>Only administrators can access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Users Management</h1>
        <p className="subtitle">Manage all system users and their roles</p>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Users Grid */}
      <div className="users-grid">
        {users.length > 0 ? (
          users.map((u) => (
            <div key={u._id} className="user-card">
              <div className="user-avatar">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h3>{u.name}</h3>
                <p className="user-email">{u.email}</p>
                <span className={`role-badge ${getRoleBadgeClass(u.role)}`}>
                  {u.role.toUpperCase()}
                </span>
              </div>
              <div className="user-meta">
                <span className="joined-date">
                  Joined: {new Date(u.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
              {u._id !== user._id && (
                <div className="user-actions">
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(u._id)}
                  >
                    🗑️ Delete User
                  </button>
                </div>
              )}
              {u._id === user._id && (
                <div className="current-user-badge">
                  ⭐ You
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-data-card">
            <p>No users found</p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="users-stats">
        <div className="stat-card">
          <span className="stat-value">{users.length}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {users.filter((u) => u.role === 'admin').length}
          </span>
          <span className="stat-label">Admins</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {users.filter((u) => u.role === 'staff').length}
          </span>
          <span className="stat-label">Staff</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {users.filter((u) => u.role === 'viewer').length}
          </span>
          <span className="stat-label">Viewers</span>
        </div>
      </div>
    </div>
  );
};

export default Users;
