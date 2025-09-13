import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addFavorite as addFavoriteApi, removeFavorite as removeFavoriteApi, getFavorites } from '@/api/service/favoriteService';

// Async thunk để fetch danh sách favorite (không cần userId, token lấy từ AsyncStorage)
export const fetchFavorites = createAsyncThunk(
    'favorite/fetchFavorites',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getFavorites();
            return data; // array of {_id, userId, movieId, addedAt}
        } catch (error) {
            return rejectWithValue(error.message || 'Lỗi lấy danh sách favorite');
        }
    }
);

export const addFavorite = createAsyncThunk(
    'favorite/addFavorite',
    async ({ userId, movieId }, { rejectWithValue }) => {
        try {
            const data = await addFavoriteApi(userId, movieId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Lỗi thêm favorite');
        }
    }
);

// Async thunk để xóa favorite
export const removeFavorite = createAsyncThunk(
    'favorite/removeFavorite',
    async (favoriteId, { rejectWithValue }) => {
        try {
            await removeFavoriteApi(favoriteId);
            return favoriteId;
        } catch (error) {
            return rejectWithValue(error.message || 'Lỗi xóa favorite');
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
    reducers: {
        clearFavorites: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
        },
    },
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
            .addCase(addFavorite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(addFavorite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            });
    },
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
