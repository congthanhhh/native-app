import { View, FlatList, Image, TouchableOpacity } from 'react-native';
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
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setMovies([]);
        setPage(1);
        setHasMore(true);
        loadMovies();
    }, [searchTerm]);

    const loadMovies = async () => {
        setLoading(true);
        try {
            const result = await getMoviesBySearch(searchTerm, 20);
            setMovies(result.movies);
            setHasMore(false);
        } catch (error) {
            console.error('Error loading movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            loadMovies(page + 1);
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
            <View className="flex-1 bg-netflix-black px-4 pt-28">
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
                        loading ? <ActivityIndicator size="large" color="#e50914" /> : null
                    }
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaProvider>
    );
}