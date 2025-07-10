// utils/apiTransactions.js
import axios from 'axios';
import API_ENDPOINTS from '../config';


/**
 * Add a new transaction to the server
 * @param {Object} txn - The transaction object
 */

export const addTransactionToServer = async (txn) => {
  const response = await axios.post(API_ENDPOINTS.ADD_TRANSACTION, txn);
  return response.data;
};

/**
 * Update a transaction on the server
 * @param {Object} txn - The transaction object (must include id, email, etc.)
 */
export const updateTransactionOnServer = async (txn) => {
  const response = await axios.put(API_ENDPOINTS.UPDATE_TRANSACTION, txn);
  return response.data;
};

/**
 * Delete a transaction from the server
 * @param {Object} param0 - Object containing id and email
 */
export const deleteTransactionFromServer = async ({ id, email }) => {
  try {
    const res = await axios.post(API_ENDPOINTS.DELETE_TRANSACTION, { id, email });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete transaction');
  }
};

/**
 * Fetch all transactions for a user by email
 * @param {string} email - User's email address
 */
export const getAllTransactionsFromServer = async (email) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.GET_ALL_TRANSACTIONS}/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
  }
};
