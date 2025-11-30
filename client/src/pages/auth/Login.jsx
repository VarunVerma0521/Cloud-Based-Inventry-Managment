import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Auth.css';
import { useAuth } from "react-oidc-context";

const Login = () => {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>VyaparPro</h1>
          <p>Inventory Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Welcomeeeeeeeeeeee!!!!</h2>

          {error && <div className="error-message">{error}</div>}

          <button onClick={() => auth.signinRedirect()} className="btn-primary" disabled={loading}>Sign in</button>

        </form>
      </div>
    </div>
  );
};

export default Login;
