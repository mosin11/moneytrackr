import React, { useState, useEffect, useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import { ThemeContext } from './ThemeContext';
import API_ENDPOINTS from './config';
import { exportToExcel } from './utils/exportExcel';
import { exportPDF } from './utils/PdfExporter';
import { Link } from 'react-router-dom';

// Components
import Header from './components/Header';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import TabFilter from './components/TabFilter';
import DateRangePicker from './components/DateRangePicker';
import useTransactions from './components/TransactionManager';
import logo from './assets/logo.png';
import Swal from 'sweetalert2';


function Home() {
  const {
    transactions,
    editTxn,
    startEdit,
    setTransactions

  } = useTransactions();

  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [activeTab, setActiveTab] = useState('Daily');

  useEffect(() => {
    const data = localStorage.getItem('transactionsList');
    if (data) setTransactions(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('transactionsList', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (txn) => {

    setTransactions([txn, ...transactions]);
  };
  const updateTransaction = (updatedTxn) => {

    setTransactions(transactions.map(t => (t.id === updatedTxn.id ? updatedTxn : t)));
    startEdit(null);
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
  const cancelEdit = () => {

    startEdit(null);
  };

  const formatDate = (d) => {

    const date = new Date(d);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
  };


  const downloadExcel = (from, to) => {
    let exportData = [];

    const parseDate = (str) => {
      const [dd, mm, yyyy] = str.split('-');
      return new Date(`${yyyy}-${mm}-${dd}`);
    };

    if (from && to) {
      const fromTime = parseDate(from).setHours(0, 0, 0, 0);
      const toTime = parseDate(to).setHours(23, 59, 59, 999);

      exportData = transactions.filter((t) => {
        const txTime = new Date(parseCustomDate(t.date)).getTime();
        return txTime >= fromTime && txTime <= toTime;
      });
    } else {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      exportData = transactions.filter((t) => {

        const date = parseCustomDate(t.date);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      });
    }

    const data = exportData.map((t) => ({
      date: formatDate(new Date(parseCustomDate(t.date))),
      description: t.desc,
      'cashIn': t.type === 'in' ? t.amount : '',
      'cashOut': t.type === 'out' ? t.amount : '',
    }));

    setFromDate('');
    setToDate('');

    return data;
  };


  const getWeekNumber = (d) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  };

  const now = new Date();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  function parseCustomDate(dateStr) {
    const [datePart, timePart] = dateStr.split(' ');
    const [dd, mm, yyyy] = datePart.split('-').map(Number);
    const [HH, MM] = timePart ? timePart.split(':').map(Number) : [0, 0];
    return new Date(yyyy, mm - 1, dd, HH, MM);
  }

  const filteredTransactions = transactions.filter((t) => {
    const txDate = parseCustomDate(t.date); // custom parser
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentWeek = getWeekNumber(today);
    const txWeek = getWeekNumber(txDate);

    switch (activeTab) {
      case 'Daily':
        return (
          txDate.getDate() === today.getDate() &&
          txDate.getMonth() === today.getMonth() &&
          txDate.getFullYear() === today.getFullYear()
        );
      case 'Weekly':
        return txDate.getFullYear() === currentYear && txWeek === currentWeek;
      case 'Monthly':
        return (
          txDate.getFullYear() === currentYear &&
          txDate.getMonth() === currentMonth
        );
      case 'LastMonth':
        return txDate >= lastMonthStart && txDate <= lastMonthEnd;
      default:
        return true;
    }
  });

  const handleEdit = (txn) => {

    startEdit(txn);
  };
  const sendBackup = async () => {

    if (!email || !email.includes('@')) {

      Swal.fire({
        icon: 'error',
        title: 'Please enter a valid email address',
        text: 'Please enter a valid email address',
      });
      return;
    }

    try {
      const doc = await exportPDF(transactions, { download: false });
      const pdfBlob = doc.output('blob');
      const formData = new FormData();
      formData.append('email', email);
      formData.append('backupData', JSON.stringify(transactions));
      formData.append('pdf', pdfBlob, 'Cashbook_Report.pdf');
      const response = await fetch(API_ENDPOINTS.BACKUP, {
        method: 'POST',

        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '✅ Backup Sent!',
          text: result.message || 'Backup sent successfully!',
        });
        setShowEmailInput(false);
      } else {

        Swal.fire({
          icon: 'error',
          title: '❌ Backup Sent!',
          text: result.message || 'Failed to send backup.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '❌ Error',
        text: error.message || 'Something went wrong while sending the backup!',
      });

    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className={`navbar ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white'} border-bottom shadow-sm mb-4`}>
        <div className="container-fluid">
          <a className="navbar-brand mb-0 h1 d-flex align-items-center" href="/">
            <img
              src={logo}
              alt="MoneyTrackr Logo"
              height="40"
              className="me-2"
            />
            <span className="text-primary fw-bold d-none d-sm-block">MoneyTrackr</span>
          </a>
          <Link
  to="/seed"
  className={`btn btn-sm ms-2 ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
>
  🔁 Seed Data
</Link>

          <button
            className={`btn btn-sm ${darkMode ? 'btn-light' : 'btn-dark'}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container px-3">
        <Header transactions={filteredTransactions} tabLabel={activeTab} />
        <DateRangePicker fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />

        {/* Action Buttons */}

        <div className="row g-2 mb-3">

          <div className="col-12 col-sm-4">
            <button className="btn btn-success w-100"
              onClick={() => {
                const data = downloadExcel(fromDate, toDate);
                exportToExcel(data, fromDate, toDate);
              }}

            >⬇️ Download Excel</button>
          </div>
          <div className="col-12 col-sm-4">
            <button className="btn btn-danger w-100"
              onClick={() => exportPDF(transactions, { download: true })}
            >📄 Download PDF</button>
          </div>

          <div className="col-12 col-sm-4">
            <button className="btn btn-primary w-100" onClick={() => setShowEmailInput(!showEmailInput)}>📧 Send to Email</button>
          </div>
        </div>

        {/* Email Input */}
        {showEmailInput && (
          <div className="row g-2 mb-3 align-items-center">
            <div className="col-12 col-sm-8">
              <input
                type="email"
                className="form-control w-100"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
            </div>
            <div className="col-12 col-sm-4">
              <button className="btn btn-secondary w-100" onClick={sendBackup}>Send</button>
            </div>
          </div>
        )}

        {/* Tabs and Date Picker */}

        <TabFilter activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />

        {/* Transactions */}

        <TransactionForm
          addTransaction={addTransaction}
          editTxn={editTxn}
          updateTransaction={updateTransaction}
          cancelEdit={cancelEdit}
        />
        <TransactionList
          transactions={filteredTransactions}
          darkMode={darkMode}
          onEdit={handleEdit}
          onDelete={deleteTransaction}
        />
      </div>
    </>
  );
}

export default Home;
