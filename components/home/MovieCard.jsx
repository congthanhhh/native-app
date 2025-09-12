import { FlatList, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoviesBySearch } from '@/store/slice/movieSlice';
import { Ionicons } from '@expo/vector-icons';

export default function MovieCard({
    title,
    typeCategory,
    searchTerm,
    // Bỏ maxDisplay = 10
}) {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchKey = `${searchTerm || ''}_${typeCategory || ''}`;
    const searchState = useSelector((state) => state.movie.search[searchKey] || { movies: [], loading: false, error: null });

    useEffect(() => {
        dispatch(fetchMoviesBySearch({ searchTerm, typeCategory }));
    }, [searchTerm]);

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
                {item.poster && item.poster !== "N/A" ? (
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

    if (searchState.loading) {
        return (
            <View className="mt-6 px-4">
                <Text className="text-netflix-white text-xl font-semibold mb-4">
                    {title}
                </Text>
                <ActivityIndicator size="large" color="#e50914" />
            </View>
        );
    }

    if (searchState.error) {
        return (
            <View className="mt-6 px-4">
                <Text className="text-netflix-white text-xl font-semibold mb-4">
                    {title}
                </Text>
                <Text className="text-netflix-lightGray">{error}</Text>
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
            </View>
            {/* FlatList */}
            <FlatList
                data={searchState.movies}
                renderItem={renderMovie}
                keyExtractor={(item, index) => `${item.imdbID}_${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            />
        </View>
    );
}