import React, { useState, useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { View, StatusBar, BackHandler, Alert, ScrollView, TouchableWithoutFeedback, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Text } from '@/components/ui/text';
import { getMovieDetails } from '@/api/service/movieService';
import SeasonEpisodeSelector from '@/components/movie/SeasonEpisodeSelector';

export default function WatchMovieScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const navigation = useNavigation();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Series states
    const [selectedSeason, setSelectedSeason] = useState("1");
    const [selectedEpisode, setSelectedEpisode] = useState(1);
    const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);

    const DEFAULT_TRAILER_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

    useEffect(() => {
        fetchMovieDetails();
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => backHandler.remove();
    }, [id]);

    // Hide/show tab bar based on fullscreen
    useEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: isFullscreen ? { display: 'none' } : {
                backgroundColor: '#000',
                borderTopColor: '#333',
            }
        });
    }, [isFullscreen]);

    // Cleanup orientation when component unmounts
    useEffect(() => {
        return () => {
            ScreenOrientation.unlockAsync();
        };
    }, []);

    const fetchMovieDetails = async () => {
        try {
            const result = await getMovieDetails(id);
            if (result.success) {
                setMovie(result.movie);
                if (result.movie.type === 'series' && result.movie.seasons?.length > 0) {
                    setSelectedSeason(result.movie.seasons[0].season.toString());
                    setSelectedEpisode(1);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    // Manual fullscreen function
    const enterFullscreen = async () => {
        setIsFullscreen(true);
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };

    // Manual exit fullscreen function
    const exitFullscreen = async () => {
        console.log('exitFullscreen called');
        setIsFullscreen(false);
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };

    const handleBackPress = async () => {
        console.log('handleBackPress called, isFullscreen:', isFullscreen);
        if (isFullscreen) {
            await exitFullscreen();
            return true;
        }
        Alert.alert('Thoát xem phim?', 'Bạn có chắc chắn muốn thoát?', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Thoát', onPress: () => router.back() }
        ]);
        return true;
    };

    const getCurrentEpisodeInfo = () => {
        if (movie?.type === 'series' && movie.seasons) {
            const currentSeason = movie.seasons.find(s => s.season === parseInt(selectedSeason));
            const currentEpisode = currentSeason?.episodes?.find(e => e.Episode === selectedEpisode.toString());
            return currentEpisode;
        }
        return null;
    };

    const currentEpisode = getCurrentEpisodeInfo();
    const displayTitle = currentEpisode
        ? `${movie.title} - S${selectedSeason}E${selectedEpisode}: ${currentEpisode.Title}`
        : movie?.title || 'Loading...';

    if (loading) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <ActivityIndicator size="large" color="#E50914" />
                <Text className="text-white mt-4">Đang tải...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-black">
            <TouchableWithoutFeedback onPress={() => setShowSeasonDropdown(false)}>
                <View className="flex-1 bg-black">
                    <StatusBar hidden={isFullscreen} backgroundColor="black" barStyle="light-content" />

                    {/* Fullscreen Video Player */}
                    {isFullscreen && (
                        <View className="flex-1 relative">
                            <Video
                                source={{ uri: DEFAULT_TRAILER_URL }}
                                style={{ flex: 1, backgroundColor: 'black' }}
                                useNativeControls={true}
                                resizeMode={ResizeMode.CONTAIN}
                                shouldPlay={true}
                                isLooping={false}
                                onFullscreenUpdate={({ fullscreenUpdate }) => {
                                    console.log('onFullscreenUpdate:', fullscreenUpdate);
                                    if (fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS) {
                                        exitFullscreen();
                                    }
                                }}
                            />

                            {/* Fullscreen Exit Button Overlay */}
                            <View className="absolute top-4 left-4 z-10">
                                <TouchableOpacity
                                    className="bg-black/60 p-3 rounded-full"
                                    onPress={exitFullscreen}
                                >
                                    <Text className="text-white text-lg font-bold">
                                        ← Back
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Regular Portrait Mode */}
                    {!isFullscreen && movie && (
                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={false}
                            bounces={true}
                        >
                            {/* Video Player */}
                            <View className="px-0">
                                <Video
                                    source={{ uri: DEFAULT_TRAILER_URL }}
                                    style={{
                                        width: '100%',
                                        height: 300,
                                        backgroundColor: 'black'
                                    }}
                                    useNativeControls={true}
                                    onFullscreenUpdate={({ fullscreenUpdate }) => {
                                        if (fullscreenUpdate) {
                                            enterFullscreen();
                                        }
                                    }}
                                    resizeMode={ResizeMode.CONTAIN}
                                    shouldPlay={false}
                                    isLooping={false}
                                />
                            </View>

                            {/* Custom Fullscreen Button */}
                            <View className="mx-4 mt-4">
                                <TouchableOpacity
                                    className="flex-row items-center justify-center bg-white/20 py-3 px-6 rounded-md"
                                    onPress={enterFullscreen}
                                >
                                    <Text className="text-white text-center font-medium text-base">
                                        ⛶ Fullscreen
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Movie Info Section */}
                            <View className="p-4">
                                <Text className="text-white text-2xl font-bold mb-2">
                                    {displayTitle}
                                </Text>

                                <View className="flex-row items-center">
                                    <Text className="text-netflix-lightGray mr-4">{movie.year}</Text>
                                    {movie.type === 'movie' && (
                                        <Text className="text-netflix-lightGray mr-4">{movie.runtime}</Text>
                                    )}
                                    <View className="flex-row items-center">
                                        <Text className="text-white ml-1">
                                            ⭐ {currentEpisode?.imdbRating || movie.rating}/10
                                        </Text>
                                    </View>
                                </View>

                                <Text className="text-netflix-lightGray leading-6 mb-6">
                                    {movie.plot}
                                </Text>

                                <SeasonEpisodeSelector
                                    movie={movie}
                                    selectedSeason={selectedSeason}
                                    selectedEpisode={selectedEpisode}
                                    onSeasonChange={setSelectedSeason}
                                    onEpisodeChange={setSelectedEpisode}
                                    showSeasonDropdown={showSeasonDropdown}
                                    setShowSeasonDropdown={setShowSeasonDropdown}
                                />

                                {/* Movie Details */}
                                <View className="space-y-3 mt-6">
                                    <Text className="text-netflix-white text-base font-semibold">
                                        Thể loại: <Text className="text-netflix-lightGray font-normal">{movie.genre}</Text>
                                    </Text>
                                    <Text className="text-netflix-white text-base font-semibold">
                                        Đạo diễn: <Text className="text-netflix-lightGray font-normal">{movie.director}</Text>
                                    </Text>
                                    <Text className="text-netflix-white text-base font-semibold">
                                        Diễn viên: <Text className="text-netflix-lightGray font-normal">{movie.actors}</Text>
                                    </Text>
                                    {movie.type === 'series' && (
                                        <Text className="text-netflix-white text-base font-semibold">
                                            Tổng số season: <Text className="text-netflix-lightGray font-normal">{movie.totalSeasons}</Text>
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </ScrollView>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
