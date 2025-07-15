import React from 'react';
import CashFlowPieChart from './CashFlowPieChart';

function Header({ transactions, tabLabel }) {
  const income = transactions
    .filter(t => ['in', 'cash_in'].includes(t.type))
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => ['out', 'cash_out'].includes(t.type))
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  return (
    <div
      className="row rounded-3 shadow-sm p-3 mb-3"
      style={{
        background: 'linear-gradient(90deg, #1e3c72, #2a5298)',
        color: '#ffffff',
      }}
    >
      {/* Summary and Pie in columns */}
      <div className="col-12 col-lg-9">
        <div className="row">
          <div className="col-4">
            <div className="card h-100 text-center border-success">
              <div className="card-body text-success p-2">
                <h6 className="mb-1 small">Cash In</h6>
                <strong className="fs-12">₹{income}</strong>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card h-100 text-center border-danger">
              <div className="card-body text-danger p-2">
                <h6 className="mb-1 small">Cash Out</h6>
                <strong className="fs-12">₹{expense}</strong>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card h-100 text-center border-primary">
              <div className="card-body text-primary p-2">
                <h6 className="mb-1 small">Balance</h6>
                <strong className="fs-12">₹{balance}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="col-12 col-lg-3 mt-3 mt-lg-0">
        <div className="card bg-light text-dark h-100">
          <div className="card-body p-2">
            <CashFlowPieChart transactions={transactions} tabLabel={tabLabel} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
