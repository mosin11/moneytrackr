import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthHeader from './AuthHeader';
import API_ENDPOINTS from '../config';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    otp: ''
  });

  const URL = API_ENDPOINTS;
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendOtp = async () => {
    try {
      await axios.post(URL.REGISTER_SEND_OTP, {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email
      });
      setStep(2);
    } catch (err) {
        Swal.fire({
                  icon: 'error',
                  title: 'Error sending OTP',
                  text: err.response?.data?.message || 'Login failed',
                    });
    }
  };

  const handleVerify = async () => {
    try {
      await axios.post(URL.REGISTER_VERIFY_OTP, {
        email: formData.email,
        otp: formData.otp
      });

      Swal.fire({
                  icon: 'success',
                  title: 'Registration successful',
                  text: 'Registration successful',
                    });
      navigate('/login');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Verification failed',
        text: err.response?.data?.message || 'Verification failed',
        });
    }
  };

  return (
    <>
      <AuthHeader title="Create Your Account" />

      <div className="container mt-5" style={{ maxWidth: '450px' }}>
        <h2 className="mb-4 text-center">Register</h2>

        {step === 1 ? (
          <>
            <div className="mb-3">
              <input
                name="name"
                className="form-control"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                name="mobile"
                className="form-control"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <button className="btn btn-primary w-100" onClick={handleSendOtp}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <div className="mb-3">
              <input
                name="otp"
                className="form-control"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
              />
            </div>
            <button className="btn btn-success w-100" onClick={handleVerify}>
              Verify & Register
            </button>
          </>
        )}
      </div>
    </>
  );
}
