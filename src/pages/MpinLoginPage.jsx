import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { saveToken, getEmail } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import AuthHeader from "./AuthHeader";
import API_ENDPOINTS from "../config";

export default function MpinLoginPage() {
  const [mpinArray, setMpinArray] = useState(["", "", "", ""]);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false); // ✅ loading state
  const navigate = useNavigate();
  const URL = API_ENDPOINTS;
  const email = getEmail();
  const refs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleClear = () => {
    setMpinArray(["", "", "", ""]);
    setError("");
    refs[0].current.focus();
  };

  const handleInput = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    const updated = [...mpinArray];
    updated[index] = value;
    setMpinArray(updated);

    if (value && index < 3) {
      refs[index + 1].current.focus();
    }
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true); // start spinner
    const mpin = mpinArray.join("");

    if (mpin.length !== 4) {
      setError("MPIN must be exactly 4 digits");
      return;
    }

    setLoading(true); // ✅ start loading
    try {
      const res = await axios.post(URL.VERIFY_MPIN, { email, mpin });
      saveToken(res.data.token);
      sessionStorage.setItem("userName", res.data.userName);
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <>
      <AuthHeader title="Enter MPIN" />
      <div className="container mt-5 text-center" style={{ maxWidth: 400 }}>
        {/* Email Info */}
        <div className="mb-3 text-muted fs-5">
          Logging in as <strong className="text-dark">{email}</strong>
        </div>

        {/* MPIN Inputs */}
        <div className="d-flex justify-content-center mb-3">
          {mpinArray.map((val, index) => (
            <input
              key={index}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={val}
              ref={refs[index]}
              onChange={(e) => handleInput(e, index)}
              className="form-control text-center fw-bold"
              style={{
                width: 60,
                height: 60,
                fontSize: 28,
                marginRight: 12,
                border: "2px solid #ccc",
                borderRadius: 8,
              }}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && <div className="alert alert-danger py-2 fs-6">{error}</div>}

        {/* Buttons */}
        <button
          className="btn btn-primary w-100 fs-5 py-2"
          onClick={handleLogin}
          disabled={loading} // ✅ disable while loading
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm me-2" />
          ) : null}
          Continue
        </button>

        <button
          className="btn btn-secondary w-100 mt-2 fs-5 py-2"
          onClick={handleClear}
          disabled={loading} // ✅ optional: disable clear while loading
        >
          Clear
        </button>
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
