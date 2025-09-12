import { View, FlatList, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text } from '@/components/ui/text';
import { ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoviesBySearch } from '@/store/slice/movieSlice';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function MovieMore() {
    const { searchTerm, title } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { movies, loading, error, currentPage, hasMorePages } = useSelector((state) => state.movie);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        dispatch(fetchMoviesBySearch({ searchTerm, typeCategory: null, page: 1 }));
    }, [searchTerm]);

    const loadMore = () => {
        if (!loadingMore && hasMorePages) {
            setLoadingMore(true);
            dispatch(fetchMoviesBySearch({ searchTerm, typeCategory: null, page: currentPage + 1 }))
                .finally(() => setLoadingMore(false));
        }
    };

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

    if (loading) {
        return (
            <View className="flex-1 bg-netflix-black justify-center items-center">
                <ActivityIndicator size="large" color="#e50914" />
                <Text className="text-netflix-white mt-4">Đang tải...</Text>
            </View>
        );
    }
    if (error) {
        return (
            <View className="flex-1 bg-netflix-black justify-center items-center">
                <Text className="text-netflix-white mt-4">{error}</Text>
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
                    data={movies}
                    renderItem={renderMovie}
                    keyExtractor={(item, index) => `${item.imdbID}_${index}`}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loading || loadingMore ? <ActivityIndicator size="large" color="#e50914" /> : null
                    }
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaProvider>
    );
}