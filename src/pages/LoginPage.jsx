import React, { useState } from "react";
import axios from "axios";
import { saveToken } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import AuthHeader from "./AuthHeader";
import API_ENDPOINTS from "../config";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const URL = API_ENDPOINTS;
  const sendOtp = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address!",
      });
      return;
    }

    try {
      await axios.post(URL.LOGIN_SEND_OTP, { email });
      setStep(2);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to send OTP",
        text: err.response?.data?.message || "Failed to send OTP",
      });
    }
  };

  const verifyLogin = async () => {
    if (!otp) {
      Swal.fire({
        icon: "error",
        title: "Enter the OTP sent to your email",
        text: "Enter the OTP sent to your email",
      });
      return;
    }
    try {
      const res = await axios.post(URL.LOGIN_VERIFY_OTP, { email, otp });
      saveToken(res.data.token);
      localStorage.setItem("userEmail", email);
      navigate("/setmpin");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: err.response?.data?.message || "Login failed",
      });
    }
  };

  const clearForm = () => {
    setEmail("");
    setOtp("");
    setStep(1);
  };

  return (
    <>
      <AuthHeader title="Sign In to MoneyTrackr" />

      <div className="container mt-4" style={{ maxWidth: "400px" }}>
        <h4 className="mb-3 text-center">Login</h4>

        {step === 1 ? (
          <>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email ?? ''}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100 mb-2" onClick={sendOtp}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              className="btn btn-success w-100 mb-2"
              onClick={verifyLogin}
            >
              Verify & Login
            </button>
          </>
        )}

        <button className="btn btn-secondary w-100 mb-2" onClick={clearForm}>
          Clear
        </button>

        <div className="text-center mt-3">
          <span className="text-muted">New here? </span>
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </>
  );
}
