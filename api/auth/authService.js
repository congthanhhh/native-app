
import { apiBackend } from '../axiosConfig';


export const login = async (username, password) => {
    try {
        const response = await apiBackend.post('/api/users/login', {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Login failed' };
    }
};


export const register = async (username, email, password) => {
    try {
        const response = await apiBackend.post('/api/users/', {
            username,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Register failed' };
    }
};
