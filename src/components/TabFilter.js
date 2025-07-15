import React from 'react';

export default function TabFilter({ activeTab, setActiveTab, darkMode }) {
  return (
    <div
      className="d-flex flex-wrap gap-2 justify-content-between mb-3 p-3 rounded"
      style={{
        background: darkMode
          ? 'linear-gradient(to right, #1e1e1e, #2c2c2c)'
          : 'linear-gradient(to right, #e0eafc, #cfdef3)', // soft light gradient
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {['Daily', 'Weekly', 'Monthly', 'LastMonth', 'All'].map((label) => (
        <button
          key={label}
          className={`btn flex-grow-1 ${
            activeTab === label
              ? 'btn-primary text-white'
              : darkMode
              ? 'btn-outline-light text-white border-secondary'
              : 'btn-outline-secondary text-dark'
          }`}
          onClick={() => setActiveTab(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
