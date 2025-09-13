import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFavorites } from '@/store/slice/favoriteSlice';
import { getMovieByIdFromOMDb } from '@/api/service/movieService';
import { Text } from '@/components/ui/text';
import FavoriteMovieCard from '@/components/favorites/FavoriteMovieCard';
import { useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { items: favorites, loading, error } = useSelector(state => state.favorite);
    const [movies, setMovies] = useState([]);
    const [loadingMovies, setLoadingMovies] = useState(false);

    useEffect(() => {
        dispatch(fetchFavorites());
    }, [dispatch]);

    useEffect(() => {
        const fetchAllMovies = async () => {
            if (favorites.length === 0) {
                setMovies([]);
                return;
            }

            setLoadingMovies(true);

            const results = await Promise.all(
                favorites.map(async (fav) => {
                    try {
                        if (!fav.movieId) {
                            return null;
                        }

                        const res = await getMovieByIdFromOMDb(fav.movieId);

                        if (!res.success) {
                            return { error: res.error, imdbID: fav.movieId };
                        }
                        return res.movie || null;
                    } catch (err) {
                        return { error: err.message, imdbID: fav.movieId };
                    }
                })
            );

            const validMovies = results.filter(Boolean);
            setMovies(validMovies);
            setLoadingMovies(false);
        };

        if (favorites.length > 0) {
            fetchAllMovies();
        } else {
            setMovies([]);
        }
    }, [favorites]); if (loading || loadingMovies) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <ActivityIndicator size="large" color="#e50914" />
                <Text className="text-white mt-4">Đang tải danh sách yêu thích...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <Text className="text-red-500">{error}</Text>
            </View>
        );
    }


    if (movies.length === 0) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <Text className="text-white">Bạn chưa thêm phim nào vào yêu thích.</Text>
            </View>
        );
    }

    const errorMovies = movies.filter(m => m && m.error);
    if (errorMovies.length > 0) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <Text className="text-red-500 mb-2">Lỗi tải thông tin phim</Text>
                {errorMovies.map(m => (
                    <Text key={m.imdbID} className="text-red-400">{m.imdbID}: {m.error}</Text>
                ))}
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <View className="flex-1 px-3 bg-black">
                <FlatList
                    className='mt-32'
                    data={movies}
                    keyExtractor={item => item.imdbID}
                    renderItem={({ item }) => (
                        <FavoriteMovieCard
                            movie={item}
                            onPress={() => router.push(`/movie/${item.imdbID}`)}
                        />
                    )}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                        marginBottom: 20,
                        paddingHorizontal: 2
                    }}
                    contentContainerStyle={{
                        paddingVertical: 10
                    }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaProvider>
    );
}
