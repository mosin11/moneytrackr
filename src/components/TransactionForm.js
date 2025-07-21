import React, { useState, useRef } from 'react';
import { cashInKeywords, cashOutKeywords } from '../utils/categoryMapper';
import stringSimilarity from 'string-similarity';
import { getCategoryFromDescription } from '../utils/getCategoryFromDescription';
import Swal from 'sweetalert2';
import { getEmail } from '../utils/auth';
import { addTransactionToServer } from '../utils/apiTransactions';

function TransactionForm({ addTransaction }) {
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const descInputRef = useRef(null);

  function inferType(description = '') {
    const words = description.toLowerCase().split(/\s+/);
    for (let word of words) {
      if (stringSimilarity.findBestMatch(word, cashOutKeywords).bestMatch.rating > 0.6) return 'out';
    }
    for (let word of words) {
      if (stringSimilarity.findBestMatch(word, cashInKeywords).bestMatch.rating > 0.6) return 'in';
    }
    return 'out';
  }

  function formatDate(d) {
    const date = new Date(d);
    const dd = String(date.getDate()).padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const yyyy = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const hh = String(hours).padStart(2, '0');
    return `${dd}-${month}-${yyyy} ${hh}:${minutes} ${ampm}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc.trim()) {
      return Swal.fire({ icon: 'error', title: 'Missing Description', text: 'Please enter a description!' });
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return Swal.fire({ icon: 'error', title: 'Invalid Amount', text: 'Please enter a valid amount!' });
    }

    const detectedType = inferType(desc);
    const category = getCategoryFromDescription(desc);
    const email = getEmail();
    const now = new Date();

    const txn = {
      id: now.getTime(),
      amount: parseFloat(amount),
      desc: desc.trim(),
      type: detectedType,
      email,
      category: category.category,
      date: formatDate(now),
    };

    await addTransactionToServer(txn);
    addTransaction(txn);
    Swal.fire({ icon: 'success', title: 'Transaction Added', text: 'Your transaction has been added!' });

    setAmount('');
    setDesc('');
    document.getElementById('closeModalBtn').click(); // close modal
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="btn btn-primary rounded-circle shadow-lg"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          zIndex: 1050,
        }}
        data-bs-toggle="modal"
        data-bs-target="#addTxnModal"
        title="Add Transaction"
      >
        +
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id="addTxnModal"
        tabIndex="-1"
        aria-labelledby="addTxnModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{
              background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
              borderRadius: '15px',
              boxShadow: '0 0 20px rgba(0,0,0,0.15)',
            }}
          >
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold" id="addTxnModalLabel">
                💼 Add New Transaction
              </h5>
              <button
                type="button"
                id="closeModalBtn"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <input
                    ref={descInputRef}
                    type="text"
                    className="form-control"
                    placeholder="e.g. Grocery, Salary, Transfer..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-success w-100 mt-2">
                  ✅ Add Transaction
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionForm;
