import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const { data } = await API.put('/users/profile', profile);
      localStorage.setItem('user', JSON.stringify(data));
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Update failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.password !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await API.put('/users/profile', { password: passwordData.password });
      setSuccess('Password updated successfully!');
      setPasswordData({ password: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Password update failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="settings-grid">
        {/* Profile Settings */}
        <div className="settings-card">
          <h2>👤 Profile Information</h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={user?.role?.toUpperCase()}
                disabled
                className="disabled-input"
              />
            </div>

            <button type="submit" className="btn-primary">
              Update Profile
            </button>
          </form>
        </div>

        {/* Password Settings */}
        <div className="settings-card">
          <h2>🔐 Change Password</h2>
          <form onSubmit={handlePasswordUpdate}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="password"
                value={passwordData.password}
                onChange={handlePasswordChange}
                placeholder="Enter new password (min 6 characters)"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Re-enter new password"
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Update Password
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="settings-card">
          <h2>📊 Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">User ID:</span>
              <span className="info-value">{user?._id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value role-badge">{user?.role}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-card danger-zone">
          <h2>⚠️ Danger Zone</h2>
          <p>Once you logout, you'll need to login again to access the system.</p>
          <button className="btn-danger" onClick={logout}>
            Logout from Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
