// app/movie/[id].jsx
import { ScrollView, View, Image, TouchableOpacity, ActivityIndicator, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getMovieDetails } from '@/api/service/movieService';

const { width, height } = Dimensions.get('window');

export default function MovieDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [episodesLoading, setEpisodesLoading] = useState(false); // Thêm state cho episodes loading
    const [selectedSeason, setSelectedSeason] = useState("1"); // State cho season được chọn - string để tương thích với Select
    const [showDropdown, setShowDropdown] = useState(false); // State cho custom dropdown

    useEffect(() => {
        fetchMovieDetails();
    }, [id]);

    const fetchMovieDetails = async () => {
        setLoading(true);
        setEpisodesLoading(true);

        try {
            const result = await getMovieDetails(id);
            console.log('API Result:', result); // Debug log

            if (result.success) {
                setMovie(result.movie);
                console.log('Movie type:', result.movie.type); // Debug log
                console.log('Total seasons:', result.movie.totalSeasons); // Debug log

                // Check if seasons data exists
                if (result.movie.seasons) {
                    console.log('Seasons data:', result.movie.seasons); // Debug log
                    // Set default selected season to first available season
                    if (result.movie.seasons.length > 0) {
                        setSelectedSeason(result.movie.seasons[0].season.toString());
                    }
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

    return (
        <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
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
                            <Button className="bg-netflix-white w-[60%] rounded-md shadow-lg">
                                <View className="flex-row items-center justify-center">
                                    <Ionicons name="play" size={24} color="#000" />
                                    <ButtonText className="text-black font-semibold ml-2">
                                        Phát
                                    </ButtonText>
                                </View>
                            </Button>

                            <TouchableOpacity className="bg-netflix-darkGray/80 rounded-md px-6 items-center justify-center shadow-lg">
                                <Ionicons name="add" size={24} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity className="bg-netflix-darkGray/80 rounded-md px-6 items-center justify-center shadow-lg">
                                <Ionicons name="share-outline" size={24} color="#fff" />
                            </TouchableOpacity>
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
                    {movie.type === 'series' && movie.seasons && movie.seasons.length > 0 && (
                        <View className="mt-8">
                            <Text className="text-netflix-white text-xl font-semibold mb-4">
                                Các tập phim
                            </Text>

                            {/* Season Dropdown - Custom với Tailwind */}
                            <View className="mb-4 relative z-10 w-[40%]">
                                <TouchableOpacity
                                    className="bg-netflix-darkGray border border-netflix-lightGray/30 rounded-md p-3 flex-row justify-between items-center"
                                    onPress={() => setShowDropdown(!showDropdown)}
                                >
                                    <Text className="text-netflix-white text-base font-semibold">
                                        Season {selectedSeason}
                                    </Text>
                                    <Ionicons
                                        name={showDropdown ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color="#fff"
                                    />
                                </TouchableOpacity>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <View
                                        className="absolute top-full left-0 right-0 bg-netflix-darkGray border border-netflix-lightGray/30 rounded-md mt-1 z-20"
                                        style={{
                                            elevation: 10,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 6
                                        }}
                                    >
                                        {movie.seasons.map((seasonData, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                className={`p-3 ${index !== movie.seasons.length - 1 ? 'border-b border-netflix-lightGray/20' : ''}`}
                                                onPress={() => {
                                                    setSelectedSeason(seasonData.season.toString());
                                                    setShowDropdown(false);
                                                }}
                                            >
                                                <Text className={`text-base ${selectedSeason === seasonData.season.toString() ? 'text-netflix-red font-semibold' : 'text-netflix-white'}`}>
                                                    Season {seasonData.season}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Episodes Grid - Hiển thị episodes của season được chọn */}
                            {(() => {
                                console.log('Selected season:', selectedSeason); // Debug log
                                console.log('Available seasons:', movie.seasons); // Debug log

                                const currentSeasonData = movie.seasons.find(s => s.season === parseInt(selectedSeason));
                                console.log('Current season data:', currentSeasonData); // Debug log

                                if (!currentSeasonData || !currentSeasonData.episodes) {
                                    return (
                                        <Text className="text-netflix-lightGray text-base">
                                            Không có tập phim cho season này
                                        </Text>
                                    );
                                }

                                return (
                                    <View className="flex-row flex-wrap justify-between">
                                        {currentSeasonData.episodes.map((episode, episodeIndex) => (
                                            <TouchableOpacity
                                                key={episodeIndex}
                                                className="bg-netflix-darkGray rounded-lg overflow-hidden mb-4"
                                                style={{ width: '48%' }}
                                                onPress={() => {
                                                    // TODO: Navigate to episode detail or play episode
                                                    console.log('Play episode:', episode.Title);
                                                }}
                                            >
                                                {/* Episode Thumbnail */}
                                                <View className="relative">
                                                    <Image
                                                        source={{ uri: movie.poster }}
                                                        style={{ width: '100%', height: 100 }}
                                                        resizeMode="cover"
                                                    />
                                                    <View className="absolute inset-0 bg-black/40 items-center justify-center">
                                                        <Ionicons name="play-circle" size={30} color="#fff" />
                                                    </View>
                                                </View>

                                                {/* Episode Info */}
                                                <View className="p-3">
                                                    <Text
                                                        className="text-netflix-white text-sm font-semibold mb-1"
                                                        numberOfLines={1}
                                                    >
                                                        {episode.Episode}. {episode.Title}
                                                    </Text>

                                                    <View className="flex-row justify-between items-center">
                                                        <Text className="text-netflix-lightGray text-xs">
                                                            {episode.Released}
                                                        </Text>
                                                        {episode.imdbRating && episode.imdbRating !== 'N/A' && (
                                                            <View className="flex-row items-center">
                                                                <Ionicons name="star" size={10} color="#ffd700" />
                                                                <Text className="text-netflix-white text-xs ml-1">
                                                                    {episode.imdbRating}
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                );
                            })()}
                        </View>
                    )}

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