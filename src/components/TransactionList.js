import React from 'react';

function TransactionList({ transactions, darkMode, onEdit, onDelete }) {

  function formatDateDisplay(d) {
  const date = new Date(d); // ISO string or custom string
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
}


  return (
    <div className="card shadow-sm p-2 mb-4" style={{ minHeight: '200px' }}>
      {transactions.length === 0 ? (
        <p className={`text-center my-4 ${darkMode ? 'text-dark' : 'text-muted'}`}>
          No transactions yet.
        </p>
      ) : (
        <div className="table-wrapper">
          <table
            className={` text-center table table-bordered table-sm mb-0 ${
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
            <tbody className="text-center">
              {transactions.map((txn, index) => (
                <tr key={txn.id}>
                  <td>{index + 1}</td>
                  <td style={{ whiteSpace: 'normal' }}>{formatDateDisplay(txn.date)}</td>
                  <td style={{ whiteSpace: 'normal' }}>{txn.description || txn.desc}</td>
                
                  <td className={['cash_in', 'in'].includes(txn.type) ? 'text-success' : 'text-danger'}>
                    {['cash_in', 'in'].includes(txn.type) ? 'Cash In' : 'Cash Out'}
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
