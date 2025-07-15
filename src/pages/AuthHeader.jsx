import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

export default function AuthHeader({ title }) {
  return (
    <header
      className="border-bottom shadow-sm py-3"
      style={{
        background: 'linear-gradient(90deg, #1e3c72, #2a5298)',
        color: '#ffffff',
      }}
    >
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        {/* Left: Logo + Brand */}
        <div className="d-flex align-items-center">
          <img src={logo} alt="MoneyTrackr Logo" height="42" className="me-3" />
          <span className="fw-bold fs-4 text-light">MoneyTrackr</span>
        </div>

        {/* Right: Navigation buttons */}
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/" className="btn btn-md btn-outline-light fs-6">🏠 Home</Link>
          <Link to="/login" className="btn btn-md btn-outline-light fs-6">🔐 Login</Link>
          <Link to="/register" className="btn btn-md btn-outline-light fs-6">📝 Register</Link>
        </div>
      </div>

      {/* Optional title */}
      {title && (
        <div className="container mt-3 text-center">
          <h5 className="text-light mb-0">{title}</h5>
        </div>
      )}
    </header>
  );
}
