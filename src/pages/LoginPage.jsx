import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveToken } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import AuthHeader from "./AuthHeader";
import API_ENDPOINTS from "../config";
import Swal from "sweetalert2";
import { showAlert } from "../utils/alerts";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // ⏳ cooldown
  const navigate = useNavigate();
  const URL = API_ENDPOINTS;

  // Cooldown timer effect
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const sendOtp = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      showAlert("error", "Invalid Email", "Please enter a valid email address!")
      
      return;
    }

    setLoading(true);
    try {
      await axios.post(URL.LOGIN_SEND_OTP, { email });
      setStep(2);
      setResendCooldown(30); // 🕒 30 seconds cooldown
    } catch (err) {
      showAlert("error","Failed to send OTP",err.response?.data?.message || "Failed to send OTP")
      
    } finally {
      setLoading(false);
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

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setEmail("");
    setOtp("");
    setStep(1);
    setResendCooldown(0);
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
                value={email ?? ""}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary w-100 mb-2"
              onClick={sendOtp}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : null}
              Login
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
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : null}
              Verify & Login
            </button>

            {/* 🔁 Resend OTP Button */}
            <div className="text-center mt-2 mb-2">
              <small className="text-muted">
                Didn't receive the OTP?{" "}
                <button
                  className="btn btn-link p-0 m-0 align-baseline"
                  onClick={sendOtp}
                  disabled={resendCooldown > 0 || loading}
                  style={{ textDecoration: "underline", fontSize: "0.9rem" }}
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend OTP"}
                </button>
              </small>
            </div>
          </>
        )}

        <button
          className="btn btn-secondary w-100 mb-2"
          onClick={clearForm}
          disabled={loading}
        >
          Clear
        </button>

        <div className="text-center mt-3">
          <span className="text-muted">New here? </span>
          <Link to="/register">Create an account</Link>
        </div>
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
