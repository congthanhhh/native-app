import { apiBackend } from '../axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper to get token
const getToken = async () => {
    return await AsyncStorage.getItem('token');
};

export const getUserById = async (userId) => {
    try {
        const token = await getToken();
        const response = await apiBackend.get(`/api/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {
            success: true,
            user: response.data
        };
    } catch (error) {
        console.error('Get user error:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.error || 'Lỗi khi lấy thông tin user'
        };
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const token = await getToken();
        const response = await apiBackend.put(`/api/users/${userId}`, userData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {
            success: true,
            user: response.data
        };
    } catch (error) {
        console.error('Update user error:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.error || 'Lỗi khi cập nhật thông tin user'
        };
    }
};