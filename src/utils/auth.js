// Save token
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

// Get token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Remove token
export const clearToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
};

// Check if logged in
export const isLoggedIn = () => {
  return !!getToken();
};
// utils/auth.js
export const saveEmail = (email) => localStorage.setItem('userEmail', email);
export const getEmail = () => localStorage.getItem('userEmail');
export const clearEmail = () => localStorage.removeItem('userEmail');


