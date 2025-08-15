import axios from 'axios';

// OMDb API configuration
const API_KEY = 'your_api_key_here'; // Thay bằng API key thật từ omdbapi.com
const BASE_URL = 'https://www.omdbapi.com/';

// Tạo axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds timeout
    params: {
        apikey: API_KEY, // API key sẽ được thêm vào mọi request
    },
});

// Request interceptor - chạy trước khi gửi request
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
        console.log('📥 API Response:', response.data);
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