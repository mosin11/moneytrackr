import React from 'react';
import logo from '../assets/logo.png'; // Update path if needed
import { Link } from 'react-router-dom';

export default function AuthHeader({ title }) {
  return (
    <header className="bg-light border-bottom py-2 mb-4 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Left: Logo */}
        <div className="d-flex align-items-center">
          <img src={logo} alt="MoneyTrackr Logo" height="32" className="me-2" />
          <span className="fw-bold text-primary fs-5">MoneyTrackr</span>
        </div>

        {/* Right: Navigation buttons */}
        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-sm btn-outline-primary">🏠 Home</Link>
          <Link to="/login" className="btn btn-sm btn-outline-secondary">🔐 Login</Link>
          <Link to="/register" className="btn btn-sm btn-outline-success">📝 Register</Link>
        </div>
      </div>

      {/* Optional Title */}
      {title && (
        <div className="container mt-2 text-center">
          <h5 className="text-muted">{title}</h5>
        </div>
      )}
    </header>
  );
}
