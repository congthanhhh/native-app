import apiClient from "../axiosConfig"

export const getMoviesBySearch = async (searchTerm, limit = 20, page = 1) => {
    try {
        const response = await apiClient.get("/", {
            params: {
                s: searchTerm,
                type: 'movie',
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
export const getMoviesWithDetails = async (searchTerm, limit = 20) => {
    try {
        const response = await apiClient.get("/", {
            params: {
                s: searchTerm,
                type: 'movie',
            }
        });
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

export const SEARCH_TERMS = {
    NEW_MOVIES: '2024',
    ACTION: 'marvel',
    POPULAR: 'star wars',
    COMEDY: 'comedy',
    DRAMA: 'drama',
    // Thêm các thể loại mới
    HORROR: 'horror',
    THRILLER: 'thriller',
    ROMANCE: 'romance',
    SCI_FI: 'science fiction',
    FANTASY: 'fantasy',
    ANIMATION: 'animation',
    CRIME: 'crime',
    MYSTERY: 'mystery',
    ADVENTURE: 'adventure',
    FAMILY: 'family',
    WAR: 'war',
    WESTERN: 'western',
    DOCUMENTARY: 'documentary',
    MUSICAL: 'musical',
    BIOGRAPHY: 'biography',
    // Các từ khóa phổ biến khác
    SUPERHERO: 'superhero',
    DISNEY: 'disney',
    PIXAR: 'pixar',
    ZOMBIE: 'zombie',
    VAMPIRE: 'vampire',
    CHRISTMAS: 'christmas',
    CLASSIC: 'classic',
    OSCAR: 'oscar winner',
    // Theo năm
    MOVIES_2023: '2023',
    MOVIES_2022: '2022',
    MOVIES_2021: '2021',
    // Theo thập niên
    MOVIES_90S: '1990s',
    MOVIES_80S: '1980s',
    // Theo studio/franchise
    BATMAN: 'batman',
    SPIDER_MAN: 'spider man',
    JAMES_BOND: 'james bond',
    HARRY_POTTER: 'harry potter',
    FAST_FURIOUS: 'fast furious'
};