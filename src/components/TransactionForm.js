import React, { useState } from 'react';

function TransactionForm({ addTransaction }) {
    const [amount, setAmount] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('in');

    function formatDate(d) {
        const date = new Date(d);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
    }
    const handleSubmit = (e) => {

        e.preventDefault();
        if (!amount || !desc) return;

        const txn = {
            id: formatDate(Date.now()),
            amount: parseFloat(amount),
            desc,
            type,
            date: formatDate(new Date())
        };
        addTransaction(txn);
        setAmount('');
        setDesc('');
    };

    return (
        <form className="mb-4" onSubmit={handleSubmit}>
            <div className="row g-2">
                <div className="col-md-4">
                    <input type="text" className="form-control" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
                </div>
                <div className="col-md-3">
                    <input type="number" className="form-control" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
                </div>

                <div className="col-md-3">
                    <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                        <option value="in">Cash In</option>
                        <option value="out">Cash Out</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-primary w-100">Add</button>
                </div>
            </div>
        </form>
    );
}

export default TransactionForm;
