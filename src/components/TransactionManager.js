import { useState, useEffect } from 'react';
import stringSimilarity from 'string-similarity';
import { keywordToCategory, cashInKeywords, cashOutKeywords } from '../utils/categoryMapper'; // Adjust if in a different file
import Swal from 'sweetalert2';

export default function useTransactions() {
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('transactionsList');
        return saved ? JSON.parse(saved) : [];
    });

    const [editId, setEditId] = useState(null);
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [editTxn, setEditTxn] = useState(null);

    // Load once on mount
    useEffect(() => {
        const saved = localStorage.getItem('transactionsList');
        if (saved) setTransactions(JSON.parse(saved));
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('transactionsList', JSON.stringify(transactions));
    }, [transactions]);

    const detectType = (desc = '') => {
        const words = desc.toLowerCase().split(/\s+/);

        for (let word of words) {
            const match = stringSimilarity.findBestMatch(word, cashInKeywords);
            if (match.bestMatch.rating > 0.5) return 'in';
        }

        // Then check for cash out
        for (let word of words) {
            const match = stringSimilarity.findBestMatch(word, cashOutKeywords);
            if (match.bestMatch.rating > 0.5) return 'out';
        }

        return 'out'; // Default fallback
    };

    const detectCategory = (desc) => {
        const lowerDesc = desc.toLowerCase();
        const keyword = Object.keys(keywordToCategory).find(k => lowerDesc.includes(k));
        return keyword ? keywordToCategory[keyword] : 'Uncategorized';
    };

    const startEdit = (txn) => {
        setEditTxn(txn);
    };

    const cancelEdit = () => {
        setDesc('');
        setAmount('');
        setEditId(null);
        setEditTxn(null)
    };

    const deleteTransaction = (id) => {
        Swal.fire({
            title: 'Delete Transaction?',
            text: 'Are you sure you want to delete this transaction?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                setTransactions(transactions.filter(t => t.id !== id));
                Swal.fire('Deleted!', 'Transaction has been removed.', 'success');
            }
        });
    };

    const submitTransaction = () => {
        const amt = parseFloat(amount);
        const now = new Date();

        if (!desc.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Please enter a description',
                text: 'Please enter a description!',
            });
            return;
        }

        if (isNaN(amt) || amt <= 0) {

            Swal.fire({
                icon: 'error',
                title: 'Please enter a valid amount',
                text: 'Please enter a valid amount!',
            });
            return;
        }

        const newTxn = {
            id: editId || Date.now(),
            date: editId ? transactions.find(t => t.id === editId).date : now,
            desc: desc.trim(),
            amount: amt,
            type: detectType(desc),
            category: detectCategory(desc)
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
        desc,
        amount,
        setDesc,
        setAmount,
        editId,
        startEdit,
        cancelEdit,
        editTxn,
        setEditTxn,
        deleteTransaction,
        submitTransaction
    };
}
