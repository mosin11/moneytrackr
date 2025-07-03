import React from 'react';
import CashFlowPieChart from './CashFlowPieChart';

function Header({ transactions, activeTab }) {
    const income = transactions.filter(t => t.type === 'in').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'out').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense;



    return (
        <div className="text-center mb-4">
            <div className="row justify-content-center g-3">
                <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                    <div className="card shadow-sm border-success h-100">
                        <div className="card-body text-success">
                            <h5 className="card-title">Cash In</h5>
                            <p className="card-text fw-bold">₹{income}</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                    <div className="card shadow-sm border-danger h-100">
                        <div className="card-body text-danger">
                            <h5 className="card-title">Cash Out</h5>
                            <p className="card-text fw-bold">₹{expense}</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                    <div className="card shadow-sm border-primary h-100">
                        <div className="card-body text-primary">
                            <h5 className="card-title">Balance</h5>
                            <p className="card-text fw-bold">₹{balance}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <h6 className="text-center">Cash Flow Breakdown</h6>

            </div>
        </div>
    );
}

export default Header;
