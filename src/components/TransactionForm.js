import React, { useState, useEffect, useRef } from 'react';
import { cashInKeywords, cashOutKeywords } from '../utils/categoryMapper';
import stringSimilarity from 'string-similarity';
import { getCategoryFromDescription } from '../utils/getCategoryFromDescription';
import Swal from 'sweetalert2';
import { getEmail } from '../utils/auth';
import { addTransactionToServer, updateTransactionOnServer } from '../utils/apiTransactions';

function TransactionForm({ addTransaction, editTxn, updateTransaction, cancelEdit }) {
    const [amount, setAmount] = useState('');
    const [desc, setDesc] = useState('');
    const descInputRef = useRef(null);       // 👈 reference to input
    const formRef = useRef(null);      

    useEffect(() => {
        if (editTxn) {
            
            setAmount(editTxn.amount);
            setDesc(editTxn.desc || editTxn.description);
             // Scroll and focus on edit
        setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
        descInputRef.current?.focus();
      }, 100); // delay to ensure DOM is rendered

        } else {
            setAmount('');
            setDesc('');

        }
    }, [editTxn]);

    function inferType(description = '') {
        const words = description.toLowerCase().split(/\s+/);

        // Then check for cash out
        for (let word of words) {
            const match = stringSimilarity.findBestMatch(word, cashOutKeywords);
            if (match.bestMatch.rating > 0.6) return 'out';
        }
        // First check for cash in
        for (let word of words) {
            const match = stringSimilarity.findBestMatch(word, cashInKeywords);
            if (match.bestMatch.rating > 0.6) return 'in';
        }



        return 'out'; // Default fallback
    }

 function formatDate(d) {
  const date = new Date(d);
  const dd = String(date.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const yyyy = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // convert 0 => 12

  const hh = String(hours).padStart(2, '0');

  return `${dd}-${month}-${yyyy} ${hh}:${minutes} ${ampm}`;
}

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!desc.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Please enter a description',
                text: 'Please enter a description!',
            });
            return;
        }

        if (isNaN(amount) || amount <= 0) {

            Swal.fire({
                icon: 'error',
                title: 'Please enter a valid amount',
                text: 'Please enter a valid amount!',
            });
            return;
        }


        const detectedType = inferType(desc);
        const category = getCategoryFromDescription(desc);
        const email = getEmail();
        const now = new Date();
        const txn = {
            id: editTxn ? editTxn.id : now.getTime(),
            amount: parseFloat(amount),
            desc: desc.trim(),
            type: detectedType,
            email: email,
            category: category.category,
            date: editTxn? editTxn.date : formatDate(now)
        };

        if (editTxn) {
            
            updateTransaction(txn);
            await updateTransactionOnServer(txn);
            Swal.fire({
                icon: 'success',
                title: 'Transaction Updated',
                text: 'Transaction has been updated successfully!',
            });
        } else {
            await addTransactionToServer(txn);
            addTransaction(txn);
            Swal.fire({
                icon: 'success',
                title: 'Transaction Added',
                text: 'Transaction has been added successfully!',
            });
        }

        setAmount('');
        setDesc('');

    };

    return (
        <form className="mb-4" ref={formRef} onSubmit={handleSubmit}>
            <div className="row g-2">
                <div className="col-md-4">
                    <input
                        ref={descInputRef}
                        type="text"
                        className="form-control"
                        placeholder="Description"
                        value={desc??''}
                        onChange={e => setDesc(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Amount"
                        value={amount ?? ''}
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>



                <div className="col-md-2 d-flex">
                    <button className="btn btn-primary me-2 w-100" type="submit">
                        {editTxn ? 'Update' : 'Add'}
                    </button>
                    {editTxn && (
                        <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}

export default TransactionForm;
