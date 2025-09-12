import { View, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoviesWithDetails } from '@/store/slice/movieSlice';
import { useRouter } from 'expo-router';
import { SEARCH_TERMS } from '@/const/OMDbapi';

const { width } = Dimensions.get('window');

export default function MovieCarousel() {
    const dispatch = useDispatch();
    const { movies: featuredMovies, loading, error } = useSelector((state) => state.movie.featured);
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchMoviesWithDetails({ searchTerm: SEARCH_TERMS.SPIDER_MAN, limit: 5 }));
    }, []);

    if (loading) {
        return (
            <View className="h-[450px] bg-netflix-darkGray justify-center items-center">
                <Text className="text-netflix-white text-lg">Đang tải phim...</Text>
            </View>
        );
    }
    if (error) {
        return (
            <View className="h-[450px] bg-netflix-darkGray justify-center items-center">
                <Text className="text-netflix-white text-lg">{error}</Text>
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
                        key={movie.imdbID}
                        className="relative justify-end"
                        style={{ width }}
                        onPress={() => router.push(`/movie/${movie.imdbID}`)}
                    >
                        {/* Background Image */}
                        {movie.poster && movie.poster !== "N/A" ? (
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
                                {'Khám phá bộ phim đặc sắc này...'}
                            </Text>

                            {/* Buttons */}
                            <View className="flex-row space-x-8">
                                <View className="flex-1 flex-row items-center justify-between">
                                    <View className="items-center">
                                        <Ionicons name="add" size={28} color="#fff" />
                                        <Text className="text-netflix-white text-xs mt-1">My List</Text>
                                    </View>
                                    <Button
                                        className="bg-netflix-white rounded-md mr-4 flex-row items-center px-6 py-2"
                                        onPress={() => router.push(`/movie/${movie.imdbID}/watch`)}
                                    >
                                        <Ionicons name="play" size={18} color="#000" style={{ marginRight: 8 }} />
                                        <ButtonText className="text-black font-semibold">Play</ButtonText>
                                    </Button>
                                    <TouchableOpacity
                                        className="items-center"
                                        onPress={() => router.push(`/movie/${movie.imdbID}`)}
                                    >
                                        <Ionicons name="information-circle-outline" size={28} color="#fff" />
                                        <Text className="text-netflix-white text-xs mt-1">Info</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}