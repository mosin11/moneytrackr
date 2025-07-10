// src/config.js

//const API_BASE_URL = 'http://localhost:5000'; 
 const API_BASE_URL = 'https://cashbook-backup-server.onrender.com'; // Use this in production 

const API_ENDPOINTS = {
  // 🔐 Auth APIs
  REGISTER_SEND_OTP: `${API_BASE_URL}/api/auth/register/send-otp`,
  REGISTER_VERIFY_OTP: `${API_BASE_URL}/api/auth/register/verify`,
  LOGIN_SEND_OTP: `${API_BASE_URL}/api/auth/login/send-otp`,
  LOGIN_VERIFY_OTP: `${API_BASE_URL}/api/auth/login/verify`,
  SET_MPIN: `${API_BASE_URL}/api/mpin/set`,
  VERIFY_MPIN: `${API_BASE_URL}/api/mpin/verify`,

  // 🔁 Backup
  BACKUP_SEND: `${API_BASE_URL}/api/backup`,
  BACKUP_HISTORY: (email) => `${API_BASE_URL}/api/backup/history/${email}`,

  // 💸 Transactions
  ADD_TRANSACTION: `${API_BASE_URL}/api/transactions/add`,
  GET_ALL_TRANSACTIONS: `${API_BASE_URL}/api/transactions/getAllTransaction`,
  DELETE_TRANSACTION: (id) => `${API_BASE_URL}/api/transactions/delete/${id}`, // optional
  UPDATE_TRANSACTION: (id) => `${API_BASE_URL}/api/transactions/update/${id}`, // optional

  // 📤 Data Export/Import (future)
  EXPORT: `${API_BASE_URL}/api/export`,
  IMPORT: `${API_BASE_URL}/api/import`,

  // 🌱 Seed (for test/demo)
  SEED_TRANSACTIONS: `${API_BASE_URL}/api/seed`,

  // 🛡️ User profile (future enhancement)
  GET_PROFILE: `${API_BASE_URL}/api/user/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/user/update`,
};

export default API_ENDPOINTS;
