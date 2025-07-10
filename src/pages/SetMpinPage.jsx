import React, { useRef, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import AuthHeader from './AuthHeader';
import API_ENDPOINTS from '../config';

export default function SetMpinPage() {
  const [mpinArray, setMpinArray] = useState(['', '', '', '']);
  const [confirmMpinArray, setConfirmMpinArray] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const URL = API_ENDPOINTS;

  const refs = {
    mpin: [useRef(), useRef(), useRef(), useRef()],
    confirm: [useRef(), useRef(), useRef(), useRef()]
  };

  const handleClear = () => {
  setMpinArray(['', '', '', '']);
  setConfirmMpinArray(['', '', '', '']);
  setError('');
};
  const handleInput = (e, index, type) => {
  const value = e.target.value.replace(/\D/g, '').slice(0, 1);
  const updateArray = type === 'mpin' ? [...mpinArray] : [...confirmMpinArray];
  updateArray[index] = value;

  if (type === 'mpin') setMpinArray(updateArray);
  else setConfirmMpinArray(updateArray);

  if (value) {
    if (index < 3) {
      refs[type][index + 1].current.focus();
    } else if (type === 'mpin') {
      // Focus first confirm box after last mpin digit
      refs['confirm'][0].current.focus();
    }
  }
};


  const handleSetMpin = async () => {
    const mpin = mpinArray.join('');
    const confirmMpin = confirmMpinArray.join('');

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

  const renderBoxes = (type, values) =>
    values.map((val, index) => (
      <input
        key={index}
        type="password"
        inputMode="numeric"
        maxLength={1}
        value={val}
        ref={refs[type][index]}
        onChange={(e) => handleInput(e, index, type)}
        className="form-control text-center"
        style={{
          width: 50,
          height: 50,
          fontSize: 22,
          marginRight: 10,
          display: 'inline-block'
        }}
      />
    ));

  return (
    <>
      <AuthHeader title="Set Your 4-Digit MPIN" />
      <div className="container mt-4 text-center" style={{ maxWidth: 400 }}>
        <label className="form-label">Enter MPIN</label>
        <div className="d-flex justify-content-center mb-3">
          {renderBoxes('mpin', mpinArray)}
        </div>

        <label className="form-label">Confirm MPIN</label>
        <div className="d-flex justify-content-center mb-3">
          {renderBoxes('confirm', confirmMpinArray)}
        </div>

        {error && <div className="alert alert-danger py-1">{error}</div>}
        <button className="btn btn-success w-100" onClick={handleSetMpin}>
          Set MPIN
        </button>
        <button className="btn btn-secondary w-100 mt-2" onClick={handleClear}>
          Clear
        </button>
      </div>
    </>
  );
}
