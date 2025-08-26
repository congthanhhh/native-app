import React, { useState } from 'react';
import { View, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';

const SeasonEpisodeSelector = ({
    movie,
    selectedSeason,
    selectedEpisode,
    onSeasonChange,
    onEpisodeChange,
    showSeasonDropdown,
    setShowSeasonDropdown
}) => {
    if (!movie || movie.type !== 'series' || !movie.seasons || movie.seasons.length === 0) {
        return null;
    }

    const handleSeasonSelect = (seasonNumber) => {
        onSeasonChange(seasonNumber.toString());
        onEpisodeChange(1); // Reset to first episode
        setShowSeasonDropdown(false);
    };

    const handleEpisodeSelect = (episodeNumber, episodeTitle) => {
        onEpisodeChange(parseInt(episodeNumber));
        ToastAndroid.show(`Đã chọn tập ${episodeNumber}: ${episodeTitle}`, ToastAndroid.SHORT);
    };

    const currentSeasonData = movie.seasons.find(s => s.season === parseInt(selectedSeason));

    return (
        <View className="mb-6">
            <Text className="text-netflix-white text-lg font-semibold mb-4">
                Các tập phim
            </Text>

            {/* Season Dropdown */}
            <View className="mb-4 relative z-10 w-[40%]">
                <TouchableOpacity
                    className="bg-netflix-darkGray border border-netflix-lightGray/30 rounded-md p-3 flex-row justify-between items-center"
                    onPress={() => setShowSeasonDropdown(!showSeasonDropdown)}
                >
                    <Text className="text-netflix-white text-base font-semibold">
                        Season {selectedSeason}
                    </Text>
                    <Ionicons
                        name={showSeasonDropdown ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#fff"
                    />
                </TouchableOpacity>

                {/* Season Dropdown Menu */}
                {showSeasonDropdown && (
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
                                onPress={() => handleSeasonSelect(seasonData.season)}
                            >
                                <Text className={`text-base ${selectedSeason === seasonData.season.toString() ? 'text-netflix-red font-semibold' : 'text-netflix-white'}`}>
                                    Season {seasonData.season}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            {/* Episodes Grid */}
            {(() => {
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
                                className={`bg-netflix-darkGray rounded-lg overflow-hidden mb-4 ${selectedEpisode === parseInt(episode.Episode) ? 'border-2 border-netflix-red' : ''}`}
                                style={{ width: '48%' }}
                                onPress={() => handleEpisodeSelect(episode.Episode, episode.Title)}
                            >
                                {/* Episode Thumbnail */}
                                <View className="relative">
                                    <Image
                                        source={{ uri: movie.poster }}
                                        style={{ width: '100%', height: 100 }}
                                        resizeMode="cover"
                                    />
                                    <View className="absolute inset-0 bg-black/40 items-center justify-center">
                                        <Ionicons
                                            name={selectedEpisode === parseInt(episode.Episode) ? "checkmark-circle" : "play-circle"}
                                            size={30}
                                            color={selectedEpisode === parseInt(episode.Episode) ? "#E50914" : "#fff"}
                                        />
                                    </View>
                                </View>

                                {/* Episode Info */}
                                <View className="p-3">
                                    <Text
                                        className={`text-sm font-semibold mb-1 ${selectedEpisode === parseInt(episode.Episode) ? 'text-netflix-red' : 'text-netflix-white'}`}
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

                                    {/* Episode Plot - short preview */}
                                    <Text className="text-netflix-lightGray text-xs mt-1" numberOfLines={2}>
                                        {episode.Plot}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            })()}
        </View>
    );
};

export default SeasonEpisodeSelector;
