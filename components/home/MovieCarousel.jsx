import { View, ScrollView, Dimensions, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

const featuredMovies = [
    {
        id: 1,
        title: "Movie 1",
        subtitle: "modern day action thriller, set in the future, with a twist",
        image: "https://picsum.photos/400/600?random=1"
    },
    {
        id: 2,
        title: "Movie 2",
        subtitle: "a heartwarming story of love and friendship",
        image: "https://picsum.photos/400/600?random=2"
    },
];

export default function MovieCarousel() {
    return (
        <View className="h-[450px] bg-netflix-darkGray">
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                className="flex-1"

            >
                {featuredMovies.map((movie) => (
                    <View key={movie.id} className="relative justify-end" style={{ width }}>
                        {/* Background Image */}
                        <Image
                            source={require("../../assets/gameshow.jpg")}
                            // source={{ uri: movie.image }}
                            className="absolute inset-0 w-full h-full"
                            resizeMode="cover"
                        />

                        {/* Gradient Overlay */}
                        <View className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
                        <View className="absolute inset-0 bg-netflix-transparentBlack" />

                        {/* Movie Content */}
                        <View className="p-6 pb-6">
                            <Text className="text-netflix-white text-4xl font-bold mb-2">
                                {movie.title}
                            </Text>
                            <Text className="text-netflix-lightGray text-lg mb-8">
                                {movie.subtitle}
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
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}