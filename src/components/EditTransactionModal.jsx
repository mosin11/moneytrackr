// components/EditTransactionModal.jsx
import React, { useState, useEffect } from "react";

import { getCategoryFromDescription } from "../utils/getCategoryFromDescription";
import stringSimilarity from "string-similarity";
import { cashInKeywords, cashOutKeywords } from "../utils/categoryMapper";
import { getEmail } from "../utils/auth";
import { updateTransactionOnServer } from "../utils/apiTransactions";
import { showAlert } from "../utils/alerts";


function EditTransactionModal({ txn, onClose, onSave }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (txn) {
      setDesc(txn.desc || txn.description);
      setAmount(txn.amount);
    }
  }, [txn]);

  const inferType = (description = "") => {
    const words = description.toLowerCase().split(/\s+/);
    for (let word of words) {
      const match = stringSimilarity.findBestMatch(word, cashOutKeywords);
      if (match.bestMatch.rating > 0.6) return "out";
    }
    for (let word of words) {
      const match = stringSimilarity.findBestMatch(word, cashInKeywords);
      if (match.bestMatch.rating > 0.6) return "in";
    }
    return "out";
  };

  const handleUpdate = async () => {
    if (!desc.trim() || isNaN(amount) || Number(amount) <= 0) {
      showAlert("warning", "Invalid input","Please enter valid description and amount")
      return;
    }

    const updatedTxn = {
      ...txn,
      desc: desc.trim(),
      amount: parseFloat(amount),
      email: getEmail(),
      type: inferType(desc),
      category: getCategoryFromDescription(desc).category,
    };

    try {
      await updateTransactionOnServer(updatedTxn);
      onSave(updatedTxn);
      showAlert("success","success", "Transaction Updated")
   
      onClose();
    } catch (err) {
      showAlert("error", "Failed to update",err.message || "Try again later.")
      
    }
  };

  if (!txn) return null;

  return (
    <div
      className="modal show fade d-block"
      tabIndex="-1"
      style={{
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(3px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3 shadow">
          <div className="modal-header bg-primary text-white rounded-top">
            <h5 className="modal-title">Edit Transaction</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <input
                type="text"
                className="form-control"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Enter transaction description"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Amount</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          </div>
          <div className="modal-footer px-4 py-3">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTransactionModal;
