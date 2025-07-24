import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { showAlert } from '../utils/alerts';



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
      showAlert("success",'✅ Transactions Seeded!','Saved to localStorage. Redirecting to app...',)
    

      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      showAlert( "error",'❌ Invalid JSON!',err.message || 'Could not parse the JSON.',);
      
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

      <Link to="/dashboard" className="btn btn-outline-success">
        🚀 Go to App
      </Link>
    </div>
  );
};

export default SeedTransactions;
