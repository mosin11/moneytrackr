import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import { ThemeContext } from "./ThemeContext";
import API_ENDPOINTS from "./config";
import { exportToExcel } from "./utils/exportExcel";
import { exportPDF } from "./utils/PdfExporter";
import { Link } from "react-router-dom";

// Components
import Header from "./components/Header";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import TabFilter from "./components/TabFilter";
import DateRangePicker from "./components/DateRangePicker";
import useTransactions from "./components/useTransactions";
import logo from "./assets/logo.png";

import { getAllTransactionsFromServer } from "./utils/apiTransactions";
import EditTransactionModal from "./components/EditTransactionModal";
import { showAlert } from "./utils/alerts";
import UserDropdown from "./components/UserDropdown";


function Home() {
  const {
    transactions,
    editTxn,
    deleteTransaction,
    startEdit,
    setTransactions,
  } = useTransactions();
  const [isLoading, setIsLoading] = useState(true); // NEW

  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState("Daily");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [filteredByDate, setFilteredByDate] = useState([]);
  const [isDateSearchActive, setIsDateSearchActive] = useState(false);
 

  const handleSearch = () => {
    if (!fromDate || !toDate) return;

    const fromTime = new Date(fromDate).setHours(0, 0, 0, 0);
    const toTime = new Date(toDate).setHours(23, 59, 59, 999);

    const result = transactions.filter((t) => {
      const txTime = new Date(parseCustomDate(t.date)).getTime();
      return txTime >= fromTime && txTime <= toTime;
    });

    setFilteredByDate(result); // ✅ This updates the list
    setIsDateSearchActive(true); // Optional: track if date filter is active
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setFilteredByDate([]);
    setIsDateSearchActive(false); // Turn off date filtering
  };

  const handleSave = (updatedTxn) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTxn.id ? updatedTxn : t))
    );
  };

  useEffect(() => {
    const userName = sessionStorage.getItem("userName");
    if (userName) setUserName(userName);

    const list = localStorage.getItem("transactionsList");
    const hasLocalData = list && list !== "[]";
    if (hasLocalData) {
      const localTxns = JSON.parse(list);

      // Simulate server sync (compare later if needed)
      getAllTransactionsFromServer(userName).then((serverTxns) => {
        const areEqual =
          JSON.stringify(localTxns) === JSON.stringify(serverTxns);

        if (!areEqual) {
          setTransactions(serverTxns);
          localStorage.setItem("transactionsList", JSON.stringify(serverTxns));
        } else {
          setTransactions(localTxns);
        }

        setIsLoading(false); // ✅ Stop loading
      });
    } else {
      setIsLoading(false); // No data, still show UI
    }
  }, []);

  const addTransaction = (txn) => {
    setTransactions([txn, ...transactions]);
  };
  const updateTransaction = (updatedTxn) => {
    setTransactions(
      transactions.map((t) => (t.id === updatedTxn.id ? updatedTxn : t))
    );
    startEdit(null);
  };

  const cancelEdit = () => {
    startEdit(null);
  };

  function formatDate(d) {
    const date = new Date(d);
    const dd = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const yyyy = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // convert 0 => 12

    const hh = String(hours).padStart(2, "0");

    return `${dd}-${month}-${yyyy} ${hh}:${minutes} ${ampm}`;
  }

  const downloadExcel = (from, to) => {
    let exportData = [];

    const parseDate = (str) => {
      const [dd, mm, yyyy] = str.split("-");
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
        return (
          date.getFullYear() === currentYear && date.getMonth() === currentMonth
        );
      });
    }

    const data = exportData.map((t) => ({
      date: formatDate(new Date(parseCustomDate(t.date))),
      description: t.description || t.desc,
      cashIn: t.type === "in" ? t.amount : "",
      cashOut: t.type === "out" ? t.amount : "",
    }));

    setFromDate("");
    setToDate("");

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
    if (!dateStr) return new Date();
    if (dateStr.includes("T")) return new Date(dateStr); // ISO case

    const [datePart, timePart] = dateStr.split(" ");
    const [dd, mm, yyyy] = datePart.split("-").map(Number);
    const [HH, MM] = timePart ? timePart.split(":").map(Number) : [0, 0];
    return new Date(yyyy, mm - 1, dd, HH, MM);
  }

  const filteredTransactions = transactions.filter((t) => {
    const txDate = new Date(t.id); // custom parser
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentWeek = getWeekNumber(today);
    const txWeek = getWeekNumber(txDate);

    switch (activeTab) {
      case "Daily":
        return (
          txDate.getDate() === today.getDate() &&
          txDate.getMonth() === today.getMonth() &&
          txDate.getFullYear() === today.getFullYear()
        );
      case "Weekly":
        return txDate.getFullYear() === currentYear && txWeek === currentWeek;
      case "Monthly":
        return (
          txDate.getFullYear() === currentYear &&
          txDate.getMonth() === currentMonth
        );
      case "LastMonth":
        return txDate >= lastMonthStart && txDate <= lastMonthEnd;
      default:
        return true;
    }
  });

  const handleEdit = (txn) => {
    setSelectedTxn(txn);
    setShowEditModal(true);
    startEdit(txn);
  };
  const sendBackup = async () => {
    if (!email || !email.includes("@")) {
      showAlert( "warning","Please enter a valid email address","Please enter a valid email address")
      
      return;
    }

    try {
      const doc = await exportPDF(transactions, { download: false });
      const pdfBlob = doc.output("blob");
      const formData = new FormData();
      formData.append("email", email);
      formData.append("backupData", JSON.stringify(transactions));
      formData.append("pdf", pdfBlob, "Cashbook_Report.pdf");
      const response = await fetch(API_ENDPOINTS.BACKUP_SEND, {
        method: "POST",

        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        showAlert("success","✅ Backup Sent!",result.message || "Backup sent successfully!")
       
        setShowEmailInput(false);
      } else {
        showAlert("error","Backup Sent!",  result.message || "Failed to send backup.");
       
      }
    } catch (error) {
      showAlert("error","Error",error.message || "Something went wrong while sending the backup!");
      
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Navbar */}
      <nav
        className={`navbar navbar-expand-lg ${
          darkMode ? "navbar-dark" : "navbar-light"
        } border-bottom shadow-sm mb-4`}
        style={{
          background: darkMode
            ? "linear-gradient(to right, #232526, #414345)"
            : "linear-gradient(to right, #f8f9fa, #e0e0e0)",
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Left Logo + Brand */}
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src={logo}
              alt="MoneyTrackr Logo"
              height="45"
              className="me-2"
            />
            <span
              className={`fw-bold ${darkMode ? "text-white" : "text-dark"}`}
              style={{ fontSize: "1.5rem" }}
            >
              MoneyTrackr
            </span>
          </a>

          {/* Right actions */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Seed Button */}
            <Link
              to="/seed"
              className={`btn btn-sm ${
                darkMode ? "btn-outline-light" : "btn-outline-dark"
              }`}
            >
              🔁 Seed Data
            </Link>

            <UserDropdown userName={userName} darkMode ={darkMode} />

            {/* Theme Toggle */}
            <button
              className={`btn btn-sm ${darkMode ? "btn-light" : "btn-dark"}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container px-3">
        <Header transactions={filteredTransactions} tabLabel={activeTab} />
        <DateRangePicker
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {/* Action Buttons */}

        <div className="row g-2 mb-3">
          <div className="col-12 col-sm-4">
            <button
              className="btn btn-success fs-5 w-100"
              onClick={() => {
                const data = downloadExcel(fromDate, toDate);
                exportToExcel(data, fromDate, toDate);
              }}
            >
              ⬇️ Download Excel
            </button>
          </div>
          <div className="col-12 col-sm-4">
            <button
              className="btn btn-danger fs-5 w-100"
              onClick={() => exportPDF(transactions, { download: true })}
            >
              📄 Download PDF
            </button>
          </div>

          <div className="col-12 col-sm-4">
            <button
              className="btn btn-primary fs-5 w-100"
              onClick={() => setShowEmailInput(!showEmailInput)}
            >
              📧 Send to Email
            </button>
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
                value={email ?? ""}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  maxWidth: "100%",
                  fontSize: "1rem",
                  padding: "0.5rem 1rem",
                }}
              />
            </div>
            <div className="col-12 col-sm-4">
              <button
                className="btn btn-secondary fs-5 w-100"
                onClick={sendBackup}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Tabs and Date Picker */}

        <TabFilter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
        />

        {/* Transactions */}

        <TransactionForm
          addTransaction={addTransaction}
          editTxn={editTxn}
          updateTransaction={updateTransaction}
          cancelEdit={cancelEdit}
        />
        <TransactionList
          transactions={
            isDateSearchActive
              ? filteredByDate
              : filteredTransactions
          }
          darkMode={darkMode}
          onEdit={handleEdit}
          onDelete={deleteTransaction}
        />
        {showEditModal && (
          <EditTransactionModal
            txn={selectedTxn}
            onClose={() => setShowEditModal(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </>
  );
}

export default Home;
