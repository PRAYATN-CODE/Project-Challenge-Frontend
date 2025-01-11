// src/utils/axiosConfig.js

import axios from 'axios';

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: 'https://project-challenge-backend.onrender.com/api', // Set base URL for the API
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
