import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';

export default function MovieCard({
    title,
    movies,
    onSeeMore,
    categoryId
}) {
    const router = useRouter();

    const handleSeeMore = () => {
        if (onSeeMore) {
            onSeeMore();
        } else {
            router.push(`/category/${categoryId}`);
        }
    };

    return (
        <View className="mt-6">
            <View className="flex-row justify-between items-center px-4 mb-4">
                <Text className="text-netflix-white text-xl font-semibold">
                    {title}
                </Text>
                <TouchableOpacity onPress={handleSeeMore}>
                    <Text className="text-netflix-lightGray text-sm">
                        Xem thêm
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="px-4"
                contentContainerStyle={{ paddingRight: 20 }}
            >
                {movies.slice(0, 8).map((movie) => (
                    <TouchableOpacity
                        key={movie.id}
                        className="mr-4"
                        onPress={() => router.push(`/movie/${movie.id}`)}
                    >
                        <View className="w-48">
                            <Image
                                source={{ uri: movie.poster }}
                                className="w-full h-72 rounded-md"
                                resizeMode="cover"
                            />
                            <Text
                                className="text-netflix-white text-base mt-2 text-center"
                                numberOfLines={2}
                            >
                                {movie.title}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}