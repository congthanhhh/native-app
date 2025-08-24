import { View, FlatList, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text } from '@/components/ui/text';
import { ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { getMoviesBySearch } from '@/api/service/movieService';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function MovieMore() {
    const { searchTerm, title } = useLocalSearchParams();
    const router = useRouter();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadInitialPages();
    }, [searchTerm]);

    // Load page 1 và page 2 ngay khi vào trang "Xem thêm"
    const loadInitialPages = async () => {
        setLoading(true);
        setMovies([]);
        setPage(2); // Set page hiện tại là 2 vì đã load 2 pages

        try {
            // Load page 1
            const page1Result = await getMoviesBySearch(searchTerm, null, 1);

            // Load page 2
            const page2Result = await getMoviesBySearch(searchTerm, null, 2);

            // Combine cả 2 pages
            const allMovies = [...page1Result.movies, ...page2Result.movies];
            setMovies(allMovies);

            // Kiểm tra có page 3 không
            setHasMore(page2Result.hasMorePages);

        } catch (error) {
            console.error('Error loading initial pages:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load thêm page tiếp theo khi scroll xuống cuối
    const loadMore = () => {
        if (!loadingMore && hasMore) {
            loadNextPage();
        }
    };

    const loadNextPage = async () => {
        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const result = await getMoviesBySearch(searchTerm, null, nextPage);

            setMovies(prev => [...prev, ...result.movies]);
            setPage(nextPage);
            setHasMore(result.hasMorePages);

        } catch (error) {
            console.error('Error loading more movies:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const renderMovie = ({ item }) => (
        <TouchableOpacity
            className="w-[48%] mb-4"
            onPress={() => router.push(`/movie/${item.imdbID}`)}
        >
            <Image
                source={{ uri: item.poster }}
                className="w-full h-64 rounded-lg"
                resizeMode="cover"
            />
            <Text className="text-netflix-white text-sm mt-2" numberOfLines={2}>
                {item.title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaProvider>
            <TouchableWithoutFeedback onPress={() => setShowSeasonDropdown(false)}>
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
            </TouchableWithoutFeedback>
        </SafeAreaProvider>
    );
}