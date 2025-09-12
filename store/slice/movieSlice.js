import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/axiosConfig';
import { TYPE_SERIES } from '@/const/OMDbapi';

export const fetchMoviesBySearch = createAsyncThunk(
    'movie/fetchMoviesBySearch',
    async ({ searchTerm, typeCategory, page = 1 }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/', {
                params: { s: searchTerm, type: typeCategory, page }
            });
            if (response.data.Response === 'True') {
                const movies = response.data.Search.map((movie, index) => ({
                    id: `${movie.imdbID}_${searchTerm}_${page}_${index}`,
                    imdbID: movie.imdbID,
                    title: movie.Title,
                    poster: movie.Poster,
                    year: movie.Year,
                })).sort((a, b) => parseInt(b.year) - parseInt(a.year));
                return {
                    movies,
                    totalResults: parseInt(response.data.totalResults),
                    currentPage: page,
                    hasMorePages: movies.length === 10
                };
            } else {
                return { movies: [], totalResults: 0, currentPage: page, hasMorePages: false };
            }
        } catch (error) {
            return rejectWithValue('Fetch movies by search failed');
        }
    }
);

export const fetchMoviesWithDetails = createAsyncThunk(
    'movie/fetchMoviesWithDetails',
    async ({ searchTerm, limit = 3 }, { rejectWithValue }) => {
        try {
            const params = { s: searchTerm, type: 'movie' };
            const response = await apiClient.get('/', { params });
            if (response.data.Response === 'True') {
                const moviesWithDetails = await Promise.all(
                    response.data.Search.slice(0, limit).map(async (movie, index) => {
                        try {
                            const detailResponse = await apiClient.get('/', {
                                params: { i: movie.imdbID, plot: 'short' }
                            });
                            return {
                                id: `${movie.imdbID}_${searchTerm}_${index}`,
                                imdbID: movie.imdbID,
                                title: movie.Title,
                                poster: movie.Poster !== 'N/A' ? movie.Poster : 'N/A',
                                year: movie.Year,
                                plot: detailResponse.data.Plot || 'Khám phá bộ phim đặc sắc này...'
                            };
                        } catch {
                            return {
                                id: `${movie.imdbID}_${searchTerm}_${index}`,
                                imdbID: movie.imdbID,
                                title: movie.Title,
                                poster: movie.Poster !== 'N/A' ? movie.Poster : 'N/A',
                                year: movie.Year,
                                plot: 'Khám phá bộ phim đặc sắc này...'
                            };
                        }
                    })
                );
                return { movies: moviesWithDetails, totalResults: parseInt(response.data.totalResults) };
            } else {
                return { movies: [], totalResults: 0 };
            }
        } catch (error) {
            return rejectWithValue('Fetch movies with details failed');
        }
    }
);

export const fetchMovieDetails = createAsyncThunk(
    'movie/fetchMovieDetails',
    async (imdbID, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/', {
                params: { i: imdbID, plot: 'full' }
            });
            if (response.data.Response === 'True') {
                const movieData = {
                    id: response.data.imdbID,
                    imdbID: response.data.imdbID,
                    title: response.data.Title,
                    poster: response.data.Poster !== 'N/A' ? response.data.Poster : 'N/A',
                    year: response.data.Year,
                    plot: response.data.Plot,
                    rating: response.data.imdbRating,
                    genre: response.data.Genre,
                    director: response.data.Director,
                    actors: response.data.Actors,
                    runtime: response.data.Runtime,
                    released: response.data.Released,
                    language: response.data.Language,
                    country: response.data.Country,
                    awards: response.data.Awards,
                    type: response.data.Type,
                    totalSeasons: response.data.totalSeasons,
                };
                return { success: true, movie: movieData };
            } else {
                return { success: false, error: response.data.Error };
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
            // Search movies (multi-key)
            .addCase(fetchMoviesBySearch.pending, (state, action) => {
                const { searchTerm, typeCategory } = action.meta.arg;
                const key = `${searchTerm || ''}_${typeCategory || ''}`;
                if (!state.search[key]) state.search[key] = { movies: [], totalResults: 0, currentPage: 1, hasMorePages: false, loading: false, error: null };
                state.search[key].loading = true;
                state.search[key].error = null;
            })
            .addCase(fetchMoviesBySearch.fulfilled, (state, action) => {
                const { searchTerm, typeCategory } = action.meta.arg;
                const key = `${searchTerm || ''}_${typeCategory || ''}`;
                state.search[key].loading = false;
                state.search[key].movies = action.payload.movies;
                state.search[key].totalResults = action.payload.totalResults;
                state.search[key].currentPage = action.payload.currentPage;
                state.search[key].hasMorePages = action.payload.hasMorePages;
            })
            .addCase(fetchMoviesBySearch.rejected, (state, action) => {
                const { searchTerm, typeCategory } = action.meta.arg;
                const key = `${searchTerm || ''}_${typeCategory || ''}`;
                if (!state.search[key]) state.search[key] = { movies: [], totalResults: 0, currentPage: 1, hasMorePages: false, loading: false, error: null };
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
