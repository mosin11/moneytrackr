import React from 'react';

function TransactionList({ transactions, darkMode, onEdit, onDelete }) {
  return (
    <div className="card shadow-sm p-2 mb-4" style={{ minHeight: '200px' }}>
      {transactions.length === 0 ? (
        <p className={`text-center my-4 ${darkMode ? 'text-dark' : 'text-muted'}`}>
          No transactions yet.
        </p>
      ) : (
        <div className="table-wrapper">
          <table
            className={`table table-bordered table-sm mb-0 ${
              darkMode ? 'table-dark' : ''
            }`}
            style={{ fontSize: '0.85rem', wordBreak: 'break-word' }}
          >
            <thead className={darkMode ? 'table-secondary' : 'table-primary'}>
              <tr>
                <th style={{ width: '50px' }}>S. No.</th>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={txn.id}>
                  <td>{index + 1}</td>
                  <td style={{ whiteSpace: 'normal' }}>{txn.date}</td>
                  <td style={{ whiteSpace: 'normal' }}>{txn.desc}</td>
                  <td className={txn.type === 'in' ? 'text-success' : 'text-danger'}>
                    {txn.type === 'in' ? 'Cash In' : 'Cash Out'}
                  </td>
                  <td>₹{txn.amount}</td>
                  <td className="text-center">
                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(txn)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(txn.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
