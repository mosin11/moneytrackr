import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthHeader from "./AuthHeader";
import API_ENDPOINTS from "../config";

import { showAlert } from "../utils/alerts";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    otp: "",
  });

  const URL = API_ENDPOINTS;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendOtp = async () => {
    try {
      setSendingOtp(true);
      setLoading(true);
      await axios.post(URL.REGISTER_SEND_OTP, {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
      });
      setStep(2);
    } catch (err) {
      showAlert("error", "Error sending OTP",err.response?.data?.message || "Login failed")
      
    } finally {
      setSendingOtp(false);
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      setVerifyingOtp(true);
      await axios.post(URL.REGISTER_VERIFY_OTP, {
        email: formData.email,
        otp: formData.otp,
      });
      showAlert("success","Registration successful","Registration successful")
      
      navigate("/login");
    } catch (err) {
      showAlert("error", "Verification failed",err.response?.data?.message || "Verification failed")
     
    } finally {
      setLoading(false);
      setVerifyingOtp(false);
    }
  };

  return (
    <>
      <AuthHeader title="Create Your Account" />

      <div className="container mt-5" style={{ maxWidth: "450px" }}>
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
            <button
              className="btn btn-primary w-100"
              onClick={handleSendOtp}
              disabled={sendingOtp}
            >
              {sendingOtp ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
              ) : null}
              {sendingOtp ? "Sending OTP..." : "Register"}
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
            <button
              className="btn btn-success w-100"
              onClick={handleVerify}
              disabled={verifyingOtp}
            >
              {verifyingOtp ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
              ) : null}
              {verifyingOtp ? "Verifying..." : "Verify & Register"}
            </button>
          </>
        )}
      </div>

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
}
