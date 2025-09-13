import { apiBackend } from '../axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper to get token
const getToken = async () => {
    return await AsyncStorage.getItem('token');
};

export const addFavorite = async (userId, movieId) => {
    try {
        const token = await getToken();

        const res = await apiBackend.post(
            '/api/favorites/',
            { userId, movieId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return res.data;
    } catch (error) {
        console.error('Add favorite API error:', error.response?.data || error.message);
        throw error;
    }
}; export const removeFavorite = async (favoriteId) => {
    const token = await getToken();
    const res = await apiBackend.delete(`/api/favorites/${favoriteId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const getFavorites = async () => {
    const token = await getToken();
    const res = await apiBackend.get('/api/favorites/', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
