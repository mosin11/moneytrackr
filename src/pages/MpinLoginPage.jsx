import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveToken, getEmail } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import AuthHeader from './AuthHeader';
import API_ENDPOINTS from '../config';

export default function MpinLoginPage() {
  const [mpin, setMpin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const URL = API_ENDPOINTS;
  const email = getEmail();

  useEffect(() => {
    if (!email) {
      navigate('/login'); // Fallback to login if no email is saved
    }
  }, [email, navigate]);

  const handleLogin = async () => {
    setError('');

    if (mpin.length !== 4) {
      setError('MPIN must be exactly 4 digits');
      return;
    }

    try {
      const res = await axios.post(URL.VERIFY_MPIN, { email, mpin });
      saveToken(res.data.token);
      navigate('/app');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleMpinInput = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4); // numeric only
    setMpin(value);
  };

  return (
    <>
      <AuthHeader title="Enter MPIN" />
      <div className="container mt-5" style={{ maxWidth: 400 }}>
        <div className="mb-3 text-center text-muted">
          Logging in as <strong>{email}</strong>
        </div>
        <input
          type="password"
          maxLength={4}
          className="form-control mb-2"
          placeholder="Enter 4-digit MPIN"
          value={mpin}
          onChange={handleMpinInput}
        />
        {error && <div className="alert alert-danger py-1">{error}</div>}
        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Proceed
          </button>
      </div>
    </>
  );
}
