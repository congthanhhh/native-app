import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

export default function FavoriteMovieCard({ movie, onPress }) {
    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.push(`/movie/${movie.imdbID}`);
        }
    };

    if (!movie || movie.error) {
        return (
            <View style={{ width: cardWidth }} className="mb-4">
                <View className="w-full aspect-[2/3] rounded-xl bg-netflix-darkGray items-center justify-center border border-red-500/20">
                    <Ionicons name="alert-circle-outline" size={32} color="#ef4444" />
                    <Text className="text-red-500 text-xs mt-2 text-center px-2">
                        {movie?.error || 'Lỗi tải phim'}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <TouchableOpacity
            style={{ width: cardWidth }}
            className="mt-5"
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <View className="relative">
                {/* Movie Poster */}
                <View className="relative overflow-hidden rounded-xl">
                    {movie.Poster && movie.Poster !== "N/A" ? (
                        <Image
                            source={{ uri: movie.Poster }}
                            style={{ width: cardWidth, aspectRatio: 2 / 3 }}
                            className="rounded-xl"
                            resizeMode="cover"
                        />
                    ) : (
                        <View
                            style={{ width: cardWidth, aspectRatio: 2 / 3 }}
                            className="rounded-xl bg-netflix-darkGray items-center justify-center"
                        >
                            <Ionicons name="film-outline" size={40} color="#666" />
                            <Text className="text-netflix-lightGray text-xs mt-2">No Image</Text>
                        </View>
                    )}

                    {/* Gradient Overlay */}
                    <View className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />

                    {/* Favorite Badge */}
                    <View className="absolute top-2 right-2">
                        <View className="bg-red-600 rounded-full p-1">
                            <Ionicons name="heart" size={14} color="white" />
                        </View>
                    </View>

                    {/* Movie Info Overlay */}
                    <View className="absolute bottom-0 left-0 right-0 p-3">
                        <Text
                            className="text-white text-sm font-semibold"
                            numberOfLines={2}
                            style={{
                                textShadowColor: 'rgba(0, 0, 0, 0.7)',
                                textShadowOffset: { width: 0, height: 1 },
                                textShadowRadius: 2
                            }}
                        >
                            {movie.Title}
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <Text
                                className="text-netflix-lightGray text-xs"
                                style={{
                                    textShadowColor: 'rgba(0, 0, 0, 0.7)',
                                    textShadowOffset: { width: 0, height: 1 },
                                    textShadowRadius: 2
                                }}
                            >
                                {movie.Year}
                            </Text>
                            {movie.Type && (
                                <>
                                    <Text className="text-netflix-lightGray text-xs mx-1">•</Text>
                                    <Text
                                        className="text-netflix-lightGray text-xs capitalize"
                                        style={{
                                            textShadowColor: 'rgba(0, 0, 0, 0.7)',
                                            textShadowOffset: { width: 0, height: 1 },
                                            textShadowRadius: 2
                                        }}
                                    >
                                        {movie.Type}
                                    </Text>
                                </>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}