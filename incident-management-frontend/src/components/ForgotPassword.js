import React, { useState } from 'react';
import api from '../api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordResetRequest = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      const response = await api.post('/password-reset/', { email });
      console.log('Response:', response); // Log the response if needed
      setMessage('If an account with that email exists, you will receive a password reset link.');
      setError('');
    } catch (err) {
      console.error('Error sending password reset request:', err);
      setError('Failed to send password reset request. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="forgot-password-input"
      />
      <button onClick={handlePasswordResetRequest} className="forgot-password-button">Send Reset Link</button>
    </div>
  );
}

export default ForgotPassword;
