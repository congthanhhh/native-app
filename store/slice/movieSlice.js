import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/axiosConfig';
import { getMoviesBySearch, getMoviesWithDetails, getMovieDetails } from '@/api/service/movieService';
import { TYPE_SERIES } from '@/const/OMDbapi';

export const fetchMoviesBySearch = createAsyncThunk(
    'movie/fetchMoviesBySearch',
    async ({ searchTerm, typeCategory, page = 1 }, { rejectWithValue }) => {
        try {
            const result = await getMoviesBySearch(searchTerm, typeCategory, page);
            return result;
        } catch (error) {
            return rejectWithValue('Fetch movies by search failed');
        }
    }
);

export const fetchMoviesWithDetails = createAsyncThunk(
    'movie/fetchMoviesWithDetails',
    async ({ searchTerm, limit = 3 }, { rejectWithValue }) => {
        try {
            const result = await getMoviesWithDetails(searchTerm, limit);
            return result;
        } catch (error) {
            return rejectWithValue('Fetch movies with details failed');
        }
    }
);

export const fetchMovieDetails = createAsyncThunk(
    'movie/fetchMovieDetails',
    async (imdbID, { rejectWithValue }) => {
        try {
            const result = await getMovieDetails(imdbID);
            if (result) {
                return { success: true, movie: result };
            } else {
                return { success: false, error: 'Not found' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
);

const movieSlice = createSlice({
    name: 'movie',
    initialState: {
        search: {}, // { [searchKey]: { movies, totalResults, currentPage, hasMorePages, loading, error } }
        featured: {
            movies: [],
            loading: false,
            error: null,
        },
        category: {}, // { [categoryId]: { movies, totalResults, loading, error } }
        movieDetails: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Search movies (multi-key, mỗi page là 1 key riêng)
            .addCase(fetchMoviesBySearch.pending, (state, action) => {
                const { searchTerm, typeCategory, page = 1 } = action.meta.arg;
                const key = `${searchTerm || ''}_${typeCategory || ''}_page${page}`;
                if (!state.search[key]) state.search[key] = { movies: [], totalResults: 0, currentPage: page, hasMorePages: false, loading: false, error: null };
                state.search[key].loading = true;
                state.search[key].error = null;
            })
            .addCase(fetchMoviesBySearch.fulfilled, (state, action) => {
                const { searchTerm, typeCategory, page = 1 } = action.meta.arg;
                const key = `${searchTerm || ''}_${typeCategory || ''}_page${page}`;
                state.search[key].loading = false;
                state.search[key].movies = action.payload.movies;
                state.search[key].totalResults = action.payload.totalResults;
                state.search[key].currentPage = action.payload.currentPage;
                state.search[key].hasMorePages = action.payload.hasMorePages;
            })
            .addCase(fetchMoviesBySearch.rejected, (state, action) => {
                const { searchTerm, typeCategory, page = 1 } = action.meta.arg;
                const key = `${searchTerm || ''}_${typeCategory || ''}_page${page}`;
                if (!state.search[key]) state.search[key] = { movies: [], totalResults: 0, currentPage: page, hasMorePages: false, loading: false, error: null };
                state.search[key].loading = false;
                state.search[key].error = action.payload;
            })
            // Featured movies
            .addCase(fetchMoviesWithDetails.pending, (state) => {
                state.featured.loading = true;
                state.featured.error = null;
            })
            .addCase(fetchMoviesWithDetails.fulfilled, (state, action) => {
                state.featured.loading = false;
                state.featured.movies = action.payload.movies;
            })
            .addCase(fetchMoviesWithDetails.rejected, (state, action) => {
                state.featured.loading = false;
                state.featured.error = action.payload;
            })
            // Movie details
            .addCase(fetchMovieDetails.pending, (state) => {
                // Optionally, add a loading state for details
            })
            .addCase(fetchMovieDetails.fulfilled, (state, action) => {
                state.movieDetails = action.payload.movie;
            })
            .addCase(fetchMovieDetails.rejected, (state, action) => {
                // Optionally, add an error state for details
            });
    },
});

export default movieSlice.reducer;
