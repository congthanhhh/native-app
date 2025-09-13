// Lấy chi tiết phim OMDb chỉ với movieId (dùng cho favorite)
export const getMovieByIdFromOMDb = async (movieId) => {
    try {
        const response = await apiClient.get('/', {
            params: {
                i: movieId,
                plot: 'full',
            },
        });
        if (response.data.Response === 'True') {
            return { success: true, movie: response.data };
        } else {
            return { success: false, error: response.data.Error };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};
import { TYPE_SERIES } from "@/const/OMDbapi";
import apiClient from "../axiosConfig"

export const getMoviesBySearch = async (searchTerm, typeCategory, page = 1) => {
    try {
        const response = await apiClient.get("/", {
            params: {
                s: searchTerm,
                type: typeCategory,
                page: page, // Thêm page parameter
            }
        });

        if (response.data.Response === 'True') {
            const movies = response.data.Search.map((movie, index) => ({
                id: `${movie.imdbID}_${searchTerm}_${page}_${index}`,
                imdbID: movie.imdbID,
                title: movie.Title,
                poster: movie.Poster,
                year: movie.Year,
            }))
                .sort((a, b) => parseInt(b.year) - parseInt(a.year));

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
        return { movies: [], totalResults: 0, currentPage: page, hasMorePages: false };
    }
};

// MovieCarousel với details
export const getMoviesWithDetails = async (searchTerm, limit = 3) => {
    try {
        const params = {
            s: searchTerm,
            type: 'movie'
        };

        const response = await apiClient.get("/", { params });
        if (response.data.Response === 'True') {
            // Lấy chi tiết từng phim để có plot
            const moviesWithDetails = await Promise.all(
                response.data.Search.slice(0, limit).map(async (movie, index) => {
                    try {
                        const detailResponse = await apiClient.get("/", {
                            params: {
                                i: movie.imdbID,
                                plot: 'short'
                            }
                        });

                        return {
                            id: `${movie.imdbID}_${searchTerm}_${index}`,
                            imdbID: movie.imdbID,
                            title: movie.Title,
                            poster: movie.Poster !== "N/A" ? movie.Poster : "N/A",
                            year: movie.Year,
                            plot: detailResponse.data.Plot || 'Khám phá bộ phim đặc sắc này...',
                        };
                    } catch (error) {
                        return {
                            id: `${movie.imdbID}_${searchTerm}_${index}`,
                            imdbID: movie.imdbID,
                            title: movie.Title,
                            poster: movie.Poster !== "N/A" ? movie.Poster : "N/A",
                            year: movie.Year,
                            plot: 'Khám phá bộ phim đặc sắc này...',
                        };
                    }
                })
            );

            return {
                movies: moviesWithDetails,
                totalResults: parseInt(response.data.totalResults)
            };
        } else {
            return { movies: [], totalResults: 0 };
        }
    } catch (error) {
        return { movies: [], totalResults: 0 };
    }
};

// api/service/movieService.js
export const getMovieDetails = async (imdbID) => {
    try {
        const response = await apiClient.get("/", {
            params: {
                i: imdbID,
                plot: 'full',
            }
        });

        if (response.data.Response === 'True') {
            const movieData = {
                id: response.data.imdbID,
                imdbID: response.data.imdbID,
                title: response.data.Title,
                poster: response.data.Poster !== "N/A" ? response.data.Poster : "N/A",
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
                type: response.data.Type, // 'movie' hoặc 'series'
                totalSeasons: response.data.totalSeasons, // Số seasons nếu là series
            };

            if (response.data.Type === TYPE_SERIES && response.data.totalSeasons) {
                movieData.seasons = await getSeriesSeasons(imdbID, parseInt(response.data.totalSeasons));
            }

            return {
                success: true,
                movie: movieData
            };
        } else {
            return { success: false, error: response.data.Error };
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return { success: false, error: error.message };
    }
};

export const getSeriesSeasons = async (imdbID, totalSeasons) => {
    try {
        const seasonPromises = [];

        // Giới hạn chỉ lấy 2 seasons đầu để tránh quá nhiều API calls
        const seasonsToFetch = Math.min(totalSeasons, 2);

        for (let season = 1; season <= seasonsToFetch; season++) {
            seasonPromises.push(
                apiClient.get("/", {
                    params: {
                        i: imdbID,
                        Season: season,
                    }
                })
            );
        }

        const seasonsData = await Promise.all(seasonPromises);

        return seasonsData.map((seasonResponse, index) => {
            if (seasonResponse.data.Response === 'True') {
                return {
                    season: index + 1,
                    episodes: seasonResponse.data.Episodes?.slice(0, 8) || [], // 8 tập đầu
                };
            }
            return null;
        }).filter(Boolean);

    } catch (error) {
        console.error('Error fetching seasons:', error);
        return [];
    }
};

