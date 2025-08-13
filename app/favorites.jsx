import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function FavoritesScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-black">
            <Text className="text-white text-xl">My Favorites</Text>
        </View>
    );
}