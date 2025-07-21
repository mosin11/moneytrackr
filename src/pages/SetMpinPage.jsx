import React, { useRef, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import AuthHeader from "./AuthHeader";
import API_ENDPOINTS from "../config";

export default function SetMpinPage() {
  const [mpinArray, setMpinArray] = useState(["", "", "", ""]);
  const [confirmMpinArray, setConfirmMpinArray] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const URL = API_ENDPOINTS;

  const refs = {
    mpin: [useRef(), useRef(), useRef(), useRef()],
    confirm: [useRef(), useRef(), useRef(), useRef()],
  };

  const handleClear = () => {
    setMpinArray(["", "", "", ""]);
    setConfirmMpinArray(["", "", "", ""]);
    setError("");
    refs.mpin[0].current.focus();
  };

  const handleInput = (e, index, type) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    const updateArray =
      type === "mpin" ? [...mpinArray] : [...confirmMpinArray];
    updateArray[index] = value;

    if (type === "mpin") setMpinArray(updateArray);
    else setConfirmMpinArray(updateArray);

    if (value) {
      if (index < 3) {
        refs[type][index + 1].current.focus();
      } else if (type === "mpin") {
        refs["confirm"][0].current.focus();
      }
    }
  };

  const handleSetMpin = async () => {
    const mpin = mpinArray.join("");
    const confirmMpin = confirmMpinArray.join("");

    if (mpin.length !== 4 || confirmMpin.length !== 4) {
      return setError("MPIN must be exactly 4 digits");
    }
    if (mpin !== confirmMpin) {
      return setError("MPINs do not match");
    }

    try {
      setLoading(true); // start spinner
      await axios.post(
        URL.SET_MPIN,
        { mpin },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to set MPIN");
    } finally {
      setLoading(false); // stop spinner
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
    ));

  return (
    <>
      <AuthHeader title="Set Your 4-Digit MPIN" />
      <div className="container mt-4 text-center" style={{ maxWidth: 420 }}>
        <label className="form-label fs-5 mb-2">Enter MPIN</label>
        <div className="d-flex justify-content-center mb-4">
          {renderBoxes("mpin", mpinArray)}
        </div>

        <label className="form-label fs-5 mb-2">Confirm MPIN</label>
        <div className="d-flex justify-content-center mb-4">
          {renderBoxes("confirm", confirmMpinArray)}
        </div>

        {error && <div className="alert alert-danger py-2 fs-6">{error}</div>}

        <button
          className="btn btn-success w-100 fs-5 py-2"
          onClick={handleSetMpin}
        >
          Set MPIN
        </button>
        <button
          className="btn btn-secondary w-100 mt-3 fs-5 py-2"
          onClick={handleClear}
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
