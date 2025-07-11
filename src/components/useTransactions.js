import { useState, useEffect } from 'react';
import stringSimilarity from 'string-similarity';
import Swal from 'sweetalert2';
import { getEmail } from '../utils/auth';

import {
  addTransactionToServer,
  updateTransactionOnServer,
  deleteTransactionFromServer,
  getAllTransactionsFromServer,
} from '../utils/apiTransactions';

import {
  keywordToCategory,
  cashInKeywords,
  cashOutKeywords,
} from '../utils/categoryMapper';

export default function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [editTxn, setEditTxn] = useState(null);

  const email = getEmail();

  // 🔃 Load transactions from server (or fallback)
  useEffect(() => {
    async function fetchTransactions() {

      if (!email) {
        Swal.fire('Login Required', 'Please log in to view transactions.', 'warning');
        return;
      }

      try {
        
        const list = localStorage.getItem("transactionsList");
        const hasLocalData = list && list !== "[]";

        if (hasLocalData) {
          const localTxns = JSON.parse(list);

          // Fetch from server and compare
          const serverTxns = await getAllTransactionsFromServer(email);

          const areEqual = JSON.stringify(localTxns) === JSON.stringify(serverTxns);

          if (!areEqual) {
            setTransactions(serverTxns);
            localStorage.setItem("transactionsList", JSON.stringify(serverTxns));
          } else {
            setTransactions(localTxns);
          }
        } else {
          // No local data or it's empty → fetch fresh
          const serverTxns = await getAllTransactionsFromServer(email);
          setTransactions(serverTxns);
          localStorage.setItem("transactionsList", JSON.stringify(serverTxns));
        }

      } catch (err) {
        Swal.fire('Error', 'Failed to fetch transactions from server. Loading local data.', 'error');
        const saved = localStorage.getItem('transactionsList');
        if (saved) setTransactions(JSON.parse(saved));
      }
    }

    fetchTransactions();
  }, [email]);

  // 🔒 Save locally on change
  useEffect(() => {
    localStorage.setItem('transactionsList', JSON.stringify(transactions));
  }, [transactions]);

  const detectType = (desc = '') => {
    const words = desc.toLowerCase().split(/\s+/);
    for (let word of words) {
      const matchIn = stringSimilarity.findBestMatch(word, cashInKeywords);
      if (matchIn.bestMatch.rating > 0.5) return 'in';
    }
    for (let word of words) {
      const matchOut = stringSimilarity.findBestMatch(word, cashOutKeywords);
      if (matchOut.bestMatch.rating > 0.5) return 'out';
    }
    return 'out';
  };

  const detectCategory = (desc) => {
    const lowerDesc = desc.toLowerCase();
    const keyword = Object.keys(keywordToCategory).find((k) =>
      lowerDesc.includes(k)
    );
    return keyword ? keywordToCategory[keyword] : 'Uncategorized';
  };

  const startEdit = (txn) => {
    setEditTxn(txn);
    setEditId(txn?.id);
    setDesc(txn?.desc || '');
    setAmount(txn?.amount?.toString() || '');
  };

  const cancelEdit = () => {
    setDesc('');
    setAmount('');
    setEditId(null);
    setEditTxn(null);
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
      cancelButtonColor: '#6c757d',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return Swal.fire('Invalid Email', 'Please log in again.', 'error');
          }

          await deleteTransactionFromServer({ id, email });
          setTransactions(transactions.filter((t) => t.id !== id));
          Swal.fire('Deleted!', 'Transaction has been removed.', 'success');
        } catch (err) {
          Swal.fire('Error', 'Failed to delete transaction from server.', 'error');
        }
      }
    });
  };

  const submitTransaction = async () => {
    const amt = parseFloat(amount);
    const now = new Date();

    if (!desc.trim()) {
      return Swal.fire('Error', 'Please enter a description.', 'error');
    }

    if (isNaN(amt) || amt <= 0) {
      return Swal.fire('Error', 'Please enter a valid positive amount.', 'error');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Swal.fire('Invalid Email', 'User email missing or invalid. Login again.', 'error');
    }

    const newTxn = {
      id: editId || new Date().toISOString(),
      date: editId
        ? transactions.find((t) => t.id === editId)?.date || now
        : now,
      desc: desc.trim(),
      amount: amt,
      type: detectType(desc),
      category: detectCategory(desc),
      email,
    };

    try {
      if (editId) {
        await updateTransactionOnServer(newTxn);
        setTransactions((prev) =>
          prev.map((t) => (t.id === editId ? newTxn : t))
        );
        Swal.fire('Updated', 'Transaction updated successfully!', 'success');
      } else {
        await addTransactionToServer(newTxn);
        setTransactions((prev) => [newTxn, ...prev]);
        Swal.fire('Added', 'Transaction added successfully!', 'success');
      }

      cancelEdit();
    } catch (err) {
      Swal.fire('Server Error', err?.message || 'Failed to sync with server.', 'error');
    }
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
    submitTransaction,
  };
}
