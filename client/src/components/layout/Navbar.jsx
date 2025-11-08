import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>VyaparPro</h2>
      </div>
      <div className="navbar-right">
        <span className="user-info">
          {user?.name} <span className="role-badge">({user?.role})</span>
        </span>
        <button onClick={logout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
