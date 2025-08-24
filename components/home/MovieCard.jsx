import { FlatList, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { getMoviesBySearch } from '@/api/service/movieService';
import { Ionicons } from '@expo/vector-icons';

export default function MovieCard({
    title,
    typeCategory,
    searchTerm,
    // Bỏ maxDisplay = 10
}) {
    const router = useRouter();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        loadInitialMovies();
    }, [searchTerm]);

    const loadInitialMovies = async () => {
        setLoading(true);
        try {
            // Load page 1 (tối đa 10 movies)
            const result = await getMoviesBySearch(searchTerm, typeCategory, 1);
            setMovies(result.movies);
            setTotalResults(result.totalResults);
        } catch (error) {
            console.error('Error loading movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeeMore = () => {
        router.push({
            pathname: '/category/[id]',
            params: {
                searchTerm: searchTerm,
                typeCategory: typeCategory,
                title: title
            }
        });
    };

    const renderMovie = ({ item }) => (
        <TouchableOpacity
            className="mr-[14px]"
            onPress={() => router.push(`/movie/${item.imdbID}`)}
        >
            <View className="w-44">
                {item.poster !== "N/A" ? (
                    <Image
                        source={{ uri: item.poster }}
                        className="w-full h-56 rounded-lg"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-56 rounded-lg bg-netflix-darkGray items-center justify-center">
                        <Ionicons name="film-outline" size={40} color="#666" />
                        <Text className="text-netflix-lightGray text-xs mt-2">No Image</Text>
                    </View>
                )}
                <Text
                    className="text-netflix-white text-sm mt-2 text-center"
                    numberOfLines={2}
                >
                    {item.title}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View className="mt-6 px-4">
                <Text className="text-netflix-white text-xl font-semibold mb-4">
                    {title}
                </Text>
                <ActivityIndicator size="large" color="#e50914" />
            </View>
        );
    }

    return (
        <View className="mt-6">
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 mb-4">
                <Text className="text-netflix-white text-xl font-semibold">
                    {title}
                </Text>
                {/* Hiển thị "Xem thêm" nếu có nhiều hơn 10 kết quả (tức là có page 2) */}
                {totalResults > 10 && (
                    <TouchableOpacity onPress={handleSeeMore}>
                        <Text className="text-netflix-lightGray text-lg">
                            Xem thêm
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* FlatList */}
            <FlatList
                data={movies}
                renderItem={renderMovie}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            />
        </View>
    );
}