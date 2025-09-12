import apiClient from "../axiosConfig";

/**
 * Search movies by search term
 * @param {string} searchTerm - The search term
 * @param {number} page - Page number for pagination
 * @param {string} type - Type of content (movie, series, or empty for all)
 * @returns {Promise} API response with movies
 */
export const searchMovies = async (searchTerm, page = 1, type = '') => {
    try {
        if (!searchTerm || searchTerm.trim() === '') {
            return {
                movies: [],
                totalResults: 0,
                currentPage: 1,
                hasMorePages: false,
                error: 'Search term is required'
            };
        }

        const params = {
            s: searchTerm.trim(),
            page: page,
        };

        // Add type if specified
        if (type && type !== '') {
            params.type = type;
        }

        const response = await apiClient.get("/", { params });

        if (response.data.Response === 'True') {
            // Filter only movies with complete information
            const movies = response.data.Search
                .filter(movie => 
                    movie.imdbID && 
                    movie.Title && 
                    movie.Year && 
                    movie.Type
                ) // Only keep movies with required info
                .map((movie, index) => ({
                    id: `${movie.imdbID}_search_${page}_${index}`,
                    imdbID: movie.imdbID,
                    title: movie.Title,
                    poster: movie.Poster !== 'N/A' ? movie.Poster : null,
                    year: movie.Year,
                    type: movie.Type,
                }))
                .sort((a, b) => parseInt(b.year) - parseInt(a.year));

            return {
                movies,
                totalResults: parseInt(response.data.totalResults),
                currentPage: page,
                hasMorePages: movies.length === 10 && page * 10 < parseInt(response.data.totalResults),
                error: null
            };
        } else {
            console.warn('OMDb API returned no results for:', searchTerm);
            return {
                movies: [],
                totalResults: 0,
                currentPage: page,
                hasMorePages: false,
                error: response.data.Error || 'No results found'
            };
        }
    } catch (error) {
        console.error('Search movies error:', error.message);
        return {
            movies: [],
            totalResults: 0,
            currentPage: page,
            hasMorePages: false,
            error: error.message || 'Failed to search movies'
        };
    }
};

/**
 * Search movies by title only (for auto-suggestions)
 * @param {string} query - The search query
 * @returns {Promise} API response with limited movies for suggestions
 */
export const searchMovieSuggestions = async (query) => {
    try {
        if (!query || query.trim().length < 2) {
            return {
                suggestions: [],
                error: null
            };
        }

        const response = await searchMovies(query, 1);
        
        // Return only first 5 results for suggestions
        return {
            suggestions: response.movies.slice(0, 5),
            error: response.error
        };
    } catch (error) {
        console.error('Search suggestions error:', error);
        return {
            suggestions: [],
            error: error.message || 'Failed to get suggestions'
        };
    }
};

/**
 * Get movies for category display
 * @param {string} categoryTerm - The search term for category
 * @returns {Promise} API response with first movie for category
 */
export const getCategoryMovie = async (categoryTerm) => {
    try {
        const response = await searchMovies(categoryTerm, 1);
        if (response.movies && response.movies.length > 0) {
            return {
                movie: response.movies[0],
                error: null
            };
        } else {
            return {
                movie: null,
                error: 'No movie found for category'
            };
        }
    } catch (error) {
        console.error('Get category movie error:', error);
        return {
            movie: null,
            error: error.message || 'Failed to get category movie'
        };
    }
};