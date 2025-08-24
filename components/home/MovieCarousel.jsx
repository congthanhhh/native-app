import { View, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { getMoviesWithDetails } from '@/api/service/movieService';
import { useRouter } from 'expo-router';
import { SEARCH_TERMS } from '@/const/OMDbapi';

const { width } = Dimensions.get('window');

export default function MovieCarousel() {
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadFeaturedMovies();
    }, []);

    const loadFeaturedMovies = async () => {
        setLoading(true);
        try {
            const result = await getMoviesWithDetails(SEARCH_TERMS.SPIDER_MAN, 5);
            if (result.movies) {
                setFeaturedMovies(result.movies);
            }
        } catch (error) {
            console.error('Error loading featured movies:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="h-[450px] bg-netflix-darkGray justify-center items-center">
                <Text className="text-netflix-white text-lg">Đang tải phim...</Text>
            </View>
        );
    }
    return (
        <View className="h-[450px] bg-netflix-darkGray">
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                className="flex-1"

            >
                {featuredMovies.map((movie) => (
                    <TouchableOpacity
                        key={movie.id}
                        className="relative justify-end"
                        style={{ width }}
                        onPress={() => router.push(`/movie/${movie.imdbID}`)} // Thêm navigation
                    >
                        {/* Background Image */}
                        {movie.poster !== "N/A" ? (
                            <Image
                                source={{ uri: movie.poster }}
                                className="absolute inset-0 w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="absolute inset-0 w-full h-full bg-netflix-darkGray items-center justify-center">
                                <Ionicons name="film-outline" size={80} color="#666" />
                                <Text className="text-netflix-lightGray text-lg">No Image</Text>
                            </View>
                        )}

                        {/* Gradient Overlay */}
                        <View className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
                        <View className="absolute inset-0 bg-netflix-transparentBlack" />

                        {/* Movie Content */}
                        <View className="p-6 pb-6">
                            <Text className="text-netflix-red text-sm font-medium mb-2">
                                Netflix Original • {movie.year}
                            </Text>
                            <Text className="text-netflix-white text-2xl font-bold mb-2">
                                {movie.title}
                            </Text>
                            <Text
                                className="text-netflix-lightGray text-base mb-8 leading-6"
                                numberOfLines={3}
                                style={{ lineHeight: 24 }}
                            >
                                {movie.plot || 'Khám phá bộ phim đặc sắc này...'}
                            </Text>

                            {/* Buttons */}
                            <View className="flex-row space-x-8">
                                <View className="flex-1 flex-row items-center justify-between">
                                    <View className="items-center">
                                        <Ionicons name="add" size={28} color="#fff" />
                                        <Text className="text-netflix-white text-xs mt-1">My List</Text>
                                    </View>
                                    <Button className="bg-netflix-white rounded-md mr-4 flex-row items-center px-6 py-2">
                                        <Ionicons name="play" size={18} color="#000" style={{ marginRight: 8 }} />
                                        <ButtonText className="text-black font-semibold">Play</ButtonText>
                                    </Button>
                                    <View className="items-center">
                                        <Ionicons name="information-circle-outline" size={28} color="#fff" />
                                        <Text className="text-netflix-white text-xs mt-1">Info</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}