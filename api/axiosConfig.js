import axios from 'axios';


// OMDb API configuration
const OMDB_API_KEY = '7496806';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Tạo axios instance cho OMDb
const apiClient = axios.create({
    baseURL: OMDB_BASE_URL,
    timeout: 10000,
    params: {
        apikey: OMDB_API_KEY,
    },
});

// Tạo axios instance cho API backend
const apiBackend = axios.create({
    baseURL: 'http://10.0.2.2:5000',
    timeout: 10000,
});

apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default apiClient;
export { apiBackend };