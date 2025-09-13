// app/movie/[id].jsx
import { ScrollView, View, Image, TouchableOpacity, ActivityIndicator, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite, fetchFavorites } from '@/store/slice/favoriteSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getMovieDetails } from '@/api/service/movieService';
import SeasonEpisodeSelector from '@/components/movie/SeasonEpisodeSelector';

const { width, height } = Dimensions.get('window');

export default function MovieDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [episodesLoading, setEpisodesLoading] = useState(false); // Thêm state cho episodes loading
    const [selectedSeason, setSelectedSeason] = useState("1"); // State cho season được chọn - string để tương thích với Select
    const [selectedEpisode, setSelectedEpisode] = useState(1); // Thêm state cho episode được chọn
    const [showDropdown, setShowDropdown] = useState(false); // State cho custom dropdown
    const dispatch = useDispatch();
    const { items: favorites, loading: favoriteLoading } = useSelector(state => state.favorite);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const getUserId = async () => {
            try {
                const userStr = await AsyncStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    const id = user._id || user.id || user.userId || user.user_id || user.ID || null;
                    setUserId(id);
                } else {
                    setUserId(null);
                }
            } catch (error) {
                console.error('Error getting user from AsyncStorage:', error);
                setUserId(null);
            }
        };
        getUserId();
    }, []);

    useEffect(() => {
        fetchMovieDetails();
        // Fetch favorites when component mounts
        if (userId) {
            dispatch(fetchFavorites());
        }
    }, [id, userId]);

    const fetchMovieDetails = async () => {
        setLoading(true);
        setEpisodesLoading(true);

        try {
            const result = await getMovieDetails(id);

            if (result.success) {
                setMovie(result.movie);

                if (result.movie.seasons && result.movie.seasons.length > 0) {
                    setSelectedSeason(result.movie.seasons[0].season.toString());
                }
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
            setEpisodesLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-netflix-black justify-center items-center">
                <ActivityIndicator size="large" color="#e50914" />
                <Text className="text-netflix-white mt-4">Đang tải...</Text>
            </View>
        );
    }

    if (error || !movie) {
        return (
            <View className="flex-1 bg-netflix-black justify-center items-center px-4">
                <Text className="text-netflix-white text-lg text-center mb-4">
                    Không thể tải thông tin phim
                </Text>
                <Button onPress={() => router.back()} className="bg-netflix-red">
                    <ButtonText>Quay lại</ButtonText>
                </Button>
            </View>
        );
    }

    // Kiểm tra phim này đã favorite chưa
    const favoriteObj = favorites.find(fav => fav.movieId === id);
    const isFavorite = !!favoriteObj;

    const handleFavorite = async () => {
        if (!userId) {
            return;
        }

        try {
            if (isFavorite) {
                const result = await dispatch(removeFavorite(favoriteObj._id)).unwrap();
            } else {
                const result = await dispatch(addFavorite({ userId, movieId: id })).unwrap();
            }
        } catch (error) {
            console.error('Error in handleFavorite:', error);
        }
    };

    return (
        <TouchableWithoutFeedback
            onPress={(e) => {
                // Chỉ close dropdown nếu không phải click vào favorite button
                setShowDropdown(false);
            }}
        >
            <ScrollView className="flex-1 bg-netflix-black">
                {/* Hero Section */}
                <View className="relative" style={{ height: height * 0.6 }}>
                    <Image
                        source={{ uri: movie.poster }}
                        style={{ width, height: height * 0.6 }}
                        resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
                    <View className="absolute inset-0 bg-netflix-transparentBlack" />

                    <View className="absolute inset-0 bg-black/20" />
                    <View
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%)'
                        }}
                    />

                    {/* Additional dark overlay at the bottom for text readability */}
                    <View
                        className="absolute bottom-0 left-0 right-0"
                        style={{
                            height: height * 0.4,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)'
                        }}
                    />

                    {/* Movie Info Overlay */}
                    <View className="absolute bottom-0 left-0 right-0 p-6">
                        {/* Add text shadow for better readability */}
                        <Text
                            className="text-netflix-white text-3xl font-bold mb-2"
                            style={{
                                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                                textShadowOffset: { width: 2, height: 2 },
                                textShadowRadius: 4
                            }}
                        >
                            {movie.title}
                        </Text>

                        <View className="flex-row items-center mb-4">
                            <Text
                                className="text-netflix-lightGray text-base mr-4"
                                style={{
                                    textShadowColor: 'rgba(0, 0, 0, 0.7)',
                                    textShadowOffset: { width: 1, height: 1 },
                                    textShadowRadius: 3
                                }}
                            >
                                {movie.year}
                            </Text>
                            <Text
                                className="text-netflix-lightGray text-base mr-4"
                                style={{
                                    textShadowColor: 'rgba(0, 0, 0, 0.7)',
                                    textShadowOffset: { width: 1, height: 1 },
                                    textShadowRadius: 3
                                }}
                            >
                                {movie.runtime}
                            </Text>
                            <View className="flex-row items-center">
                                <Ionicons name="star" size={16} color="#ffd700" />
                                <Text
                                    className="text-netflix-white text-base ml-1"
                                    style={{
                                        textShadowColor: 'rgba(0, 0, 0, 0.7)',
                                        textShadowOffset: { width: 1, height: 1 },
                                        textShadowRadius: 3
                                    }}
                                >
                                    {movie.rating}/10
                                </Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row space-x-4 justify-between">
                            <Button
                                className="bg-netflix-white w-[60%] rounded-md shadow-lg"
                                onPress={() => router.push(`/movie/${id}/watch`)}
                            >
                                <View className="flex-row items-center justify-center">
                                    <Ionicons name="play" size={24} color="#000" />
                                    <ButtonText className="text-black font-semibold ml-2">
                                        Phát
                                    </ButtonText>
                                </View>
                            </Button>

                            <Button
                                variant="outline"
                                size="md"
                                className={`bg-netflix-darkGray/80 rounded-md shadow-lg ${favoriteLoading ? 'opacity-50' : ''}`}
                                onPress={(e) => {
                                    e.stopPropagation();

                                    if (!userId || favoriteLoading) {
                                        return;
                                    }

                                    handleFavorite();
                                }}
                                disabled={favoriteLoading || !userId}
                            >
                                <Ionicons
                                    name={isFavorite ? 'checkmark' : 'add'}
                                    size={24}
                                    color={isFavorite ? '#22c55e' : '#fff'}
                                />
                            </Button>

                            <Button
                                variant="outline"
                                size="md"
                                className="bg-netflix-darkGray/80 rounded-md shadow-lg"
                            >
                                <Ionicons name="share-outline" size={24} color="#fff" />
                            </Button>
                        </View>
                    </View>
                </View>

                {/* Movie Details */}
                <View className="px-6 py-6">
                    {/* Genre Tags */}
                    <View className="flex-row flex-wrap mb-4">
                        {movie.genre.split(', ').map((genre, index) => (
                            <View key={index} className="bg-netflix-darkGray rounded-full px-3 py-1 mr-2 mb-2">
                                <Text className="text-netflix-white text-lg">{genre}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Plot */}
                    <Text className="text-netflix-white text-lg font-semibold mb-2">
                        Tóm tắt
                    </Text>
                    <Text className="text-netflix-lightGray text-base mb-6 leading-6">
                        {movie.plot}
                    </Text>

                    {/* Additional Info */}
                    <View className="space-y-4">
                        <View>
                            <Text className="text-netflix-white text-base font-semibold">
                                Đạo diễn: <Text className="text-netflix-lightGray font-normal">{movie.director}</Text>
                            </Text>
                        </View>

                        <View>
                            <Text className="text-netflix-white text-base font-semibold">
                                Diễn viên: <Text className="text-netflix-lightGray font-normal">{movie.actors}</Text>
                            </Text>
                        </View>

                        <View>
                            <Text className="text-netflix-white text-base font-semibold">
                                Ngày phát hành: <Text className="text-netflix-lightGray font-normal">{movie.released}</Text>
                            </Text>
                        </View>

                        <View>
                            <Text className="text-netflix-white text-base font-semibold">
                                Ngôn ngữ: <Text className="text-netflix-lightGray font-normal">{movie.language}</Text>
                            </Text>
                        </View>

                        <View>
                            <Text className="text-netflix-white text-base font-semibold">
                                Quốc gia: <Text className="text-netflix-lightGray font-normal">{movie.country}</Text>
                            </Text>
                        </View>

                        {movie.awards !== "N/A" && (
                            <View>
                                <Text className="text-netflix-white text-base font-semibold">
                                    Giải thưởng: <Text className="text-netflix-lightGray font-normal">{movie.awards}</Text>
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Episodes Section - Chỉ hiển thị nếu là series */}
                    <SeasonEpisodeSelector
                        movie={movie}
                        selectedSeason={selectedSeason}
                        selectedEpisode={selectedEpisode}
                        onSeasonChange={setSelectedSeason}
                        onEpisodeChange={setSelectedEpisode}
                        showSeasonDropdown={showDropdown}
                        setShowSeasonDropdown={setShowDropdown}
                    />

                    {/* Episodes Loading State */}
                    {movie.type === 'series' && episodesLoading && (
                        <View className="mt-8">
                            <Text className="text-netflix-white text-xl font-semibold mb-4">
                                Các tập phim
                            </Text>
                            <View className="flex-row items-center">
                                <ActivityIndicator size="small" color="#e50914" />
                                <Text className="text-netflix-lightGray ml-2">Đang tải danh sách tập...</Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}