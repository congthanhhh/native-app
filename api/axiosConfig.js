import axios from 'axios';

// OMDb API configuration
const API_KEY = '7496806';
const BASE_URL = 'https://www.omdbapi.com/';

// Tạo axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    params: {
        apikey: API_KEY,
    },
});

apiClient.interceptors.request.use(
    (config) => {
        console.log('📤 API Request:', config.url, config.params);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - chạy sau khi nhận response
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', error.response?.data || error.message);

        // Handle different error cases
        if (error.response?.status === 401) {
            console.error('🔑 Invalid API Key');
        } else if (error.response?.status === 429) {
            console.error('⏰ API Rate Limit Exceeded');
        }

        return Promise.reject(error);
    }
);

export default apiClient;