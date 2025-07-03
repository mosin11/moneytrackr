// src/config.js

//const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'https://cashbook-backup-server.onrender.com';

const API_ENDPOINTS = {
    BACKUP: `${API_BASE_URL}/api/backup`,
    // Future endpoints
    REGISTER: `${API_BASE_URL}/api/register`,
    LOGIN: `${API_BASE_URL}/api/login`,
    EXPORT: `${API_BASE_URL}/api/export`,
    IMPORT: `${API_BASE_URL}/api/import`,
    // Add more here
};

export default API_ENDPOINTS;
