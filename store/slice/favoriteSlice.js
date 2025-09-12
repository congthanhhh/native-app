import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/api/axiosConfig';

// Async thunk để fetch danh sách phim yêu thích từ backend
export const fetchFavorites = createAsyncThunk(
    'favorite/fetchFavorites',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/favorites/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk để thêm phim vào danh sách yêu thích
export const addFavorite = createAsyncThunk(
    'favorite/addFavorite',
    async ({ userId, movie }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/favorites/${userId}`, { movie });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk để xóa phim khỏi danh sách yêu thích
export const removeFavorite = createAsyncThunk(
    'favorite/removeFavorite',
    async ({ userId, movieId }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/favorites/${userId}/${movieId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload._id);
            });
    },
});

export default favoriteSlice.reducer;
