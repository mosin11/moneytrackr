// TransactionManager.js
import { useState, useEffect } from 'react';

export default function useTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [editId, setEditId] = useState(null);
    const [formType, setFormType] = useState(null);
    const [description, setDescription] = useState('');
    const [cashIn, setCashIn] = useState('');
    const [cashOut, setCashOut] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('transactionsList');
        if (saved) setTransactions(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('transactionsList', JSON.stringify(transactions));
    }, [transactions]);

    const startEdit = (txn) => {
        setFormType(txn.cashIn > 0 ? 'cashIn' : 'cashOut');
        setDescription(txn.description);
        setCashIn(txn.cashIn || '');
        setCashOut(txn.cashOut || '');
        setEditId(txn.id);
    };

    const cancelEdit = () => {
        setFormType(null);
        setDescription('');
        setCashIn('');
        setCashOut('');
        setEditId(null);
    };

    const deleteTransaction = (id) => {
        if (window.confirm('Delete this transaction?')) {
            setTransactions(transactions.filter(t => t.id !== id));
        }
    };

    const submitTransaction = () => {
        const cashInValue = parseFloat(cashIn);
        const cashOutValue = parseFloat(cashOut);
        const now = new Date();

        if (!description.trim()) {
            alert('Please enter a description');
            return;
        }

        if (
            (formType === 'cashIn' && (isNaN(cashInValue) || cashInValue <= 0)) ||
            (formType === 'cashOut' && (isNaN(cashOutValue) || cashOutValue <= 0))
        ) {
            alert('Please enter a valid amount');
            return;
        }

        const newTxn = {
            id: editId || Date.now(),
            date: editId ? transactions.find(t => t.id === editId).date : now,
            description: description.trim(),
            cashIn: formType === 'cashIn' ? cashInValue : 0,
            cashOut: formType === 'cashOut' ? cashOutValue : 0,
        };

        if (editId) {
            setTransactions(transactions.map(t => t.id === editId ? newTxn : t));
        } else {
            setTransactions([newTxn, ...transactions]);
        }

        cancelEdit();
    };

    return {
        transactions,
        setTransactions,
        formType,
        description,
        cashIn,
        cashOut,
        editId,
        setFormType,
        setDescription,
        setCashIn,
        setCashOut,
        startEdit,
        cancelEdit,
        deleteTransaction,
        submitTransaction
    };
}
