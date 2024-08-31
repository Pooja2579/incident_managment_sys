import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../css/Login.css';  // Correct path
import { Link } from 'react-router-dom';  // Import Link for routing
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please fill out both fields.');
      return;
    }

    api.post('login/', { email, password })
      .then(response => {
        localStorage.setItem('authToken', response.data.token);
        navigate('/dashboard');
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setError('Login failed. Please check your credentials and try again.');
      });
  };

  return (
    <div className="login-container">
      <h2>User Login</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="login-input"
      />
      <div className="password-container">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="login-input"
        />
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
        />
      </div>
      <p className="forgot-password">
        <Link to="/forgot-password">Forgot your password?</Link>
      </p>
      <button onClick={handleLogin} className="login-button">Log me in</button>
      
    </div>
  );
}

export default Login;
