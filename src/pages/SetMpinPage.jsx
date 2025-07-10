import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import AuthHeader from './AuthHeader';
import API_ENDPOINTS from '../config'

export default function SetMpinPage() {
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const URL = API_ENDPOINTS;

  const handleSetMpin = async () => {
    if (mpin.length !== 4 || confirmMpin.length !== 4) {
      return setError('MPIN must be exactly 4 digits');
    }
    if (mpin !== confirmMpin) {
      return setError('MPINs do not match');
    }

    try {
      await axios.post(URL.SET_MPIN, { mpin }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      navigate('/app');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set MPIN');
    }
  };

  return (
    <>
      <AuthHeader title="Set Your 4-Digit MPIN" />
      <div className="container mt-4" style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <input
            type="password"
            maxLength={4}
            className="form-control"
            placeholder="Enter MPIN"
            value={mpin}
            onChange={(e) => setMpin(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            maxLength={4}
            className="form-control"
            placeholder="Confirm MPIN"
            value={confirmMpin}
            onChange={(e) => setConfirmMpin(e.target.value)}
          />
        </div>
        {error && <div className="alert alert-danger py-1">{error}</div>}
        <button className="btn btn-success w-100" onClick={handleSetMpin}>Set MPIN</button>
      </div>
    </>
  );
}
