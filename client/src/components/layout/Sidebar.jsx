import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-item">
          <span className="nav-icon">📊</span>
          Dashboard
        </NavLink>
        <NavLink to="/about" className="nav-item">
  <span className="nav-icon">ℹ️</span>
  About
</NavLink>


        <NavLink to="/products" className="nav-item">
          <span className="nav-icon">📦</span>
          Products
        </NavLink>

        <NavLink to="/categories" className="nav-item">
          <span className="nav-icon">🏷️</span>
          Categories
        </NavLink>

        <NavLink to="/suppliers" className="nav-item">
          <span className="nav-icon">🚚</span>
          Suppliers
        </NavLink>

        <NavLink to="/sales" className="nav-item">
          <span className="nav-icon">💰</span>
          Sales
        </NavLink>

        <NavLink to="/reports" className="nav-item">
          <span className="nav-icon">📈</span>
          Reports
        </NavLink>

        <NavLink to="/settings" className="nav-item">
          <span className="nav-icon">⚙️</span>
          Settings
        </NavLink>

        {user?.role === 'admin' && (
          <NavLink to="/users" className="nav-item">
            <span className="nav-icon">👥</span>
            Users
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
