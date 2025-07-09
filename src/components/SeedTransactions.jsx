import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const SeedTransactions = () => {
  const [jsonText, setJsonText] = useState('');
  const navigate = useNavigate();

  const handleSeed = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of transactions');
      }

      localStorage.setItem('transactionsList', JSON.stringify(parsed));

      Swal.fire({
        icon: 'success',
        title: '✅ Transactions Seeded!',
        text: 'Saved to localStorage. Redirecting to app...',
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate('/app'), 2000);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '❌ Invalid JSON!',
        text: err.message || 'Could not parse the JSON.',
      });
    }
  };

  return (
    <div className="container my-5 p-4 rounded shadow bg-white">
      <h2 className="text-primary mb-3">🧬 Seed Transactions</h2>
      <p className="text-muted">
        Paste your transaction JSON array below. Example:
        <code>[{"{"}id: ..., amount: ..., desc: ..., ...{"}"}]</code>
      </p>

      <textarea
        className="form-control mb-3"
        rows={10}
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        placeholder='Paste JSON array like [{ id: 1, amount: 100, desc: "Tea", type: "out", date: "01-01-2024 10:00" }]'
      />

      <div className="d-flex flex-column flex-sm-row gap-2 mb-3">
        <button className="btn btn-primary" onClick={handleSeed}>
          💾 Save to LocalStorage & Redirect
        </button>
        <button className="btn btn-secondary" onClick={() => setJsonText('')}>
          🧹 Clear
        </button>
      </div>

      <Link to="/app" className="btn btn-outline-success">
        🚀 Go to App
      </Link>
    </div>
  );
};

export default SeedTransactions;
