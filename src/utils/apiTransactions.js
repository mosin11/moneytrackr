import axios from 'axios';
import API_ENDPOINTS from '../config';
import { getToken } from './auth';
// Optional encryption
import { encryptData } from './encryptor'; // Only if using encryption
const useEncryption = true; // Set true if encryption enabled


const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

/**
 * Add a new transaction to the server
 */
export const addTransactionToServer = async (txn) => {
  
  const payload =  useEncryption ? { data: await encryptData(txn) } : txn;
  const response = await axios.post(API_ENDPOINTS.ADD_TRANSACTION, payload, getAuthHeader());
  return response.data;
};

/**
 * Update a transaction on the server
 */
export const updateTransactionOnServer = async (txn) => {
  console.log(txn)
  const payload = useEncryption ?{ data: await encryptData(txn) } : txn;
  
  const response = await axios.put(API_ENDPOINTS.UPDATE_TRANSACTION, payload, getAuthHeader());
  return response.data;
};

/**
 * Delete a transaction from the server
 */
export const deleteTransactionFromServer = async ({ id, email }) => {
  try {

    const payload = useEncryption ? { data: await encryptData({ id, email }) } : { id, email };
    const res = await axios.post(API_ENDPOINTS.DELETE_TRANSACTION, payload, getAuthHeader());
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete transaction');
  }
};

/**
 * Fetch all transactions for a user by email
 */
export const getAllTransactionsFromServer = async (email) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.GET_ALL_TRANSACTIONS}/${email}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
  }
};
