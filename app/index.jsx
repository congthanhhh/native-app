import '../global.css';
import { View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"


export default function HomeScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-netflix-black">
            <Text className="text-netflix-white text-xl">Movie App Home</Text>
            <Button size="md" variant="solid" action="negative">
                <ButtonText>Hello World!</ButtonText>
            </Button>
        </View>
    );
}
