import { View, FlatList, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text } from '@/components/ui/text';
import { ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoviesBySearch } from '@/store/slice/movieSlice';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function MovieMore() {
    const { searchTerm, typeCategory, title } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const [loadingMore, setLoadingMore] = useState(false);
    // Lấy state cho page 1 và page 2, gộp lại
    const searchKey1 = `${searchTerm || ''}_${typeCategory || ''}_page1`;
    const searchKey2 = `${searchTerm || ''}_${typeCategory || ''}_page2`;
    const searchState = useSelector((state) => {
        if (!state.movie || !state.movie.search) return { movies: [], loading: false, error: null };
        const page1 = state.movie.search[searchKey1] || { movies: [], loading: false, error: null };
        const page2 = state.movie.search[searchKey2] || { movies: [], loading: false, error: null };
        return {
            movies: [...(page1.movies || []), ...(page2.movies || [])],
            loading: page1.loading || page2.loading,
            error: page1.error || page2.error,
        };
    });

    // Khi vào màn này, fetch page 1 và page 2
    useEffect(() => {
        dispatch(fetchMoviesBySearch({ searchTerm, typeCategory, page: 1 }));
        dispatch(fetchMoviesBySearch({ searchTerm, typeCategory, page: 2 }));
    }, [searchTerm, typeCategory]);

    // Xóa hoàn toàn allMovies và pagesLoaded

    // Không loadMore khi scroll nữa
    const loadMore = () => { };

    const renderMovie = ({ item }) => (
        <TouchableOpacity
            className="w-[48%] mb-4"
            onPress={() => router.push(`/movie/${item.imdbID}`)}
        >
            <Image
                source={{ uri: item.poster || item.Poster }}
                className="w-full h-64 rounded-lg"
                resizeMode="cover"
            />
            <Text className="text-netflix-white text-sm mt-2" numberOfLines={2}>{item.title || item.Title}</Text>
        </TouchableOpacity>
    );

    // Chỉ loading lần đầu khi chưa có phim
    if (searchState.loading && searchState.movies.length === 0) {
        return (
            <View className="flex-1 bg-netflix-black justify-center items-center">
                <ActivityIndicator size="large" color="#e50914" />
                <Text className="text-netflix-white mt-4">Đang tải...</Text>
            </View>
        );
    }
    if (searchState.error) {
        return (
            <View className="flex-1 bg-netflix-black justify-center items-center">
                <Text className="text-netflix-white mt-4">{searchState.error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <View className="flex-1 bg-netflix-black px-4 pt-12">
                <Text className="text-netflix-white text-2xl font-bold mb-6">
                    {title}
                </Text>
                <FlatList
                    data={searchState.movies}
                    renderItem={renderMovie}
                    keyExtractor={(item, index) => `${item.imdbID}_${index}`}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    // Không gọi loadMore khi scroll
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaProvider>
    );
}