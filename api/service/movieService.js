import apiClient from "../axiosConfig"

export const getMoviesBySearch = async (searchTerm, typeCategory, limit = 20, page = 1) => {
    try {
        const response = await apiClient.get("/", {
            params: {
                s: searchTerm,
                type: typeCategory,
            }
        });
        if (response.data.Response === 'True') {
            const movies = response.data.Search.slice(0, limit).map((movie, index) => ({
                id: `${movie.imdbID}_${searchTerm}_${index}`,
                imdbID: movie.imdbID,
                title: movie.Title,
                poster: movie.Poster,
                year: movie.Year,
            }));

            return {
                movies,
                totalResults: parseInt(response.data.totalResults)
            };
        } else {
            console.log('API Error:', response.data.Error);
            return { movies: [], totalResults: 0 };
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        return { movies: [], totalResults: 0 };
    }
};

// Function riêng cho MovieCarousel với details
export const getMoviesWithDetails = async (searchTerm, typeCategory, limit = 20) => {
    try {
        // Tạo params object động
        const params = {};

        if (searchTerm) {
            params.s = searchTerm;
        }

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
                            poster: movie.Poster,
                            year: movie.Year,
                            plot: detailResponse.data.Plot || 'Không có mô tả',
                        };
                    } catch (error) {
                        return {
                            id: `${movie.imdbID}_${searchTerm}_${index}`,
                            imdbID: movie.imdbID,
                            title: movie.Title,
                            poster: movie.Poster,
                            year: movie.Year,
                            plot: 'Không có mô tả',
                        };
                    }
                })
            );

            return {
                movies: moviesWithDetails,
                totalResults: parseInt(response.data.totalResults)
            };
        } else {
            console.log('API Error:', response.data.Error);
            return { movies: [], totalResults: 0 };
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
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
                poster: response.data.Poster !== "N/A" ? response.data.Poster : "https://via.placeholder.com/300x450?text=No+Image",
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

            // Nếu là series, lấy thêm thông tin seasons
            if (response.data.Type === 'series' && response.data.totalSeasons) {
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

// Hàm lấy thông tin seasons của series
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
                    episodes: seasonResponse.data.Episodes?.slice(0, 8) || [], // Giới hạn 8 tập đầu
                };
            }
            return null;
        }).filter(Boolean);

    } catch (error) {
        console.error('Error fetching seasons:', error);
        return [];
    }
};

