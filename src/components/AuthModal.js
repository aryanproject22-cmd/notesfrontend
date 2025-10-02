import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      try { localStorage.setItem('role', '1'); } catch (e) { /* ignore */ }
      setError('');
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Login</h3>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-actions">
            <button type="submit" className="auth-submit">Login</button>
            <button type="button" className="auth-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;


