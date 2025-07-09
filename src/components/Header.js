import React from 'react';
import CashFlowPieChart from './CashFlowPieChart';

function Header({ transactions, tabLabel }) {
    const income = transactions.filter(t => t.type === 'in').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'out').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense;

    return (
        <div className="row">
            {/* Summary Cards (left side) */}
            <div className="col-12 col-md-9">
                <div className="row g-2">
                    <div className="col-4">
                        <div className="card text-center border-success">
                            <div className="card-body text-success p-2">
                                <h6 className="mb-1">Cash In</h6>
                                <strong>₹{income}</strong>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="card text-center border-danger">
                            <div className="card-body text-danger p-2">
                                <h6 className="mb-1">Cash Out</h6>
                                <strong>₹{expense}</strong>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="card text-center border-primary">
                            <div className="card-body text-primary p-2">
                                <h6 className="mb-1">Balance</h6>
                                <strong>₹{balance}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-3 mt-3 mt-lg-0">
                <div className="card bg-dark text-white">
                    <div className="card-body p-2">
                        <CashFlowPieChart transactions={transactions} tabLabel={tabLabel} />
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Header;
