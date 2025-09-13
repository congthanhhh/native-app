import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchMovies, searchMovieSuggestions } from '../api/service/searchService';

// Async thunks for API calls
export const searchMoviesThunk = createAsyncThunk(
    'search/searchMovies',
    async ({ searchTerm, page = 1, type = '' }, { rejectWithValue }) => {
        try {
            const result = await searchMovies(searchTerm, page, type);
            if (result.error) {
                return rejectWithValue(result.error);
            }
            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const searchSuggestionsThunk = createAsyncThunk(
    'search/searchSuggestions',
    async (query, { rejectWithValue }) => {
        try {
            const result = await searchMovieSuggestions(query);
            if (result.error) {
                return rejectWithValue(result.error);
            }
            return result.suggestions;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    // Search results
    searchResults: [],
    totalResults: 0,
    currentPage: 1,
    hasMorePages: false,
    
    // Search term and type
    searchTerm: '',
    searchType: '', // 'movie', 'series', or ''
    
    // Loading states
    isLoading: false,
    isLoadingMore: false,
    isSuggestionsLoading: false,
    
    // Suggestions
    suggestions: [],
    showSuggestions: false,
    
    // Error handling
    error: null,
    suggestionError: null,
    
    // UI states
    isSearchFocused: false,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        // Reset search state
        clearSearch: (state) => {
            state.searchResults = [];
            state.totalResults = 0;
            state.currentPage = 1;
            state.hasMorePages = false;
            state.searchTerm = '';
            state.error = null;
        },
        
        // Clear suggestions
        clearSuggestions: (state) => {
            state.suggestions = [];
            state.showSuggestions = false;
            state.suggestionError = null;
        },
        
        // Set search term
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        
        // Set search type
        setSearchType: (state, action) => {
            state.searchType = action.payload;
        },
        
        // Toggle suggestions visibility
        setShowSuggestions: (state, action) => {
            state.showSuggestions = action.payload;
        },
        
        // Set search focus state
        setSearchFocused: (state, action) => {
            state.isSearchFocused = action.payload;
        },
        
        // Clear errors
        clearError: (state) => {
            state.error = null;
            state.suggestionError = null;
        },
        
        // Load more results (append to existing results)
        appendSearchResults: (state, action) => {
            state.searchResults = [...state.searchResults, ...action.payload];
        },
    },
    extraReducers: (builder) => {
        // Search movies
        builder
            .addCase(searchMoviesThunk.pending, (state, action) => {
                const isLoadingMore = action.meta.arg.page > 1;
                if (isLoadingMore) {
                    state.isLoadingMore = true;
                } else {
                    state.isLoading = true;
                    state.searchResults = [];
                }
                state.error = null;
            })
            .addCase(searchMoviesThunk.fulfilled, (state, action) => {
                const { movies, totalResults, currentPage, hasMorePages } = action.payload;
                const isLoadingMore = currentPage > 1;
                
                if (isLoadingMore) {
                    // Limit total results to 20
                    const remainingSlots = 20 - state.searchResults.length;
                    const moviesToAdd = movies.slice(0, remainingSlots);
                    state.searchResults = [...state.searchResults, ...moviesToAdd];
                    state.isLoadingMore = false;
                    
                    // Stop loading more if we reach 20 results
                    if (state.searchResults.length >= 20) {
                        state.hasMorePages = false;
                    } else {
                        state.hasMorePages = hasMorePages;
                    }
                } else {
                    // For new search, limit to first 10 results
                    state.searchResults = movies.slice(0, 10);
                    state.isLoading = false;
                    state.hasMorePages = movies.length === 10 && totalResults > 10;
                }
                
                state.totalResults = Math.min(totalResults, 20); // Cap displayed total at 20
                state.currentPage = currentPage;
                state.error = null;
            })
            .addCase(searchMoviesThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.isLoadingMore = false;
                state.error = action.payload || 'Failed to search movies';
                state.searchResults = [];
            });
            
        // Search suggestions
        builder
            .addCase(searchSuggestionsThunk.pending, (state) => {
                state.isSuggestionsLoading = true;
                state.suggestionError = null;
            })
            .addCase(searchSuggestionsThunk.fulfilled, (state, action) => {
                state.isSuggestionsLoading = false;
                state.suggestions = action.payload;
                state.showSuggestions = true;
                state.suggestionError = null;
            })
            .addCase(searchSuggestionsThunk.rejected, (state, action) => {
                state.isSuggestionsLoading = false;
                state.suggestionError = action.payload || 'Failed to get suggestions';
                state.suggestions = [];
            });
    },
});

export const {
    clearSearch,
    clearSuggestions,
    setSearchTerm,
    setSearchType,
    setShowSuggestions,
    setSearchFocused,
    clearError,
    appendSearchResults,
} = searchSlice.actions;

export default searchSlice.reducer;

// Selectors
export const selectSearchResults = (state) => state.search.searchResults;
export const selectIsLoading = (state) => state.search.isLoading;
export const selectIsLoadingMore = (state) => state.search.isLoadingMore;
export const selectSearchTerm = (state) => state.search.searchTerm;
export const selectSearchType = (state) => state.search.searchType;
export const selectTotalResults = (state) => state.search.totalResults;
export const selectHasMorePages = (state) => state.search.hasMorePages;
export const selectCurrentPage = (state) => state.search.currentPage;
export const selectError = (state) => state.search.error;
export const selectSuggestions = (state) => state.search.suggestions;
export const selectShowSuggestions = (state) => state.search.showSuggestions;
export const selectIsSuggestionsLoading = (state) => state.search.isSuggestionsLoading;
export const selectIsSearchFocused = (state) => state.search.isSearchFocused;