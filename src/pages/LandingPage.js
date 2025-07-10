import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Update with your actual logo path

export default function LandingPage() {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center px-3">
      <div className="card shadow-lg border-0 p-4 text-center" style={{ maxWidth: '400px', width: '100%', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
        {/* Logo */}
        <img src={logo} alt="MoneyTrackr Logo" height="60" className="mx-auto mb-3 rounded" />

        {/* Animated welcome text */}
        <h1 className="fw-bold text-primary mb-1">
          👋 Welcome to <span className="text-gradient">MoneyTrackr</span>
        </h1>
        <p className="text-muted small">Track Every Rupee, Effortlessly</p>
        <p className="small text-secondary">
          Simple and secure cash tracking for daily in/out transactions.
        </p>

        {/* Launch App */}
        <Link to="/login" className="btn btn-primary btn-lg w-100 mb-3">
          🚀 Launch App
        </Link>

        {/* Divider */}
        <div className="d-flex justify-content-center gap-2">
          <Link to="/login" className="btn btn-outline-secondary btn-sm">Login</Link>
          <Link to="/register" className="btn btn-outline-success btn-sm">Register</Link>
        </div>
      </div>
    </div>
  );
}
