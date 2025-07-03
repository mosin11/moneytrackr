// src/components/LandingPage.js
import React from 'react';
import './LandingPage.css';

export default function LandingPage() {
    return (
        <div className="landing">
            <div className="container text-center py-5">
                <h1 className="display-4 fw-bold text-primary">💰 MoneyTrackr</h1>
                <p className="lead">Track Every Rupee, Effortlessly</p>
                <p className="text-muted">Simple and secure cash tracking tool for daily in/out transactions.</p>
                <a href="/app" className="btn btn-primary btn-lg mt-3">Launch App</a>
            </div>
        </div>
    );
}
