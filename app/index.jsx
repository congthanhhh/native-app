import '../global.css';
import { View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"


export default function HomeScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-lg mb-4">Welcome to the Home Screen!</Text>
            <Button size="md" variant="solid" action="positive">
                <ButtonText>Hello World!</ButtonText>
            </Button>

            <Card size="md" variant="elevated" className="m-3">
                <Heading size="lg" className="mb-1">
                    Quick Start
                </Heading>
                <Text size="sm">Start building your next project in minutes</Text>
            </Card>
        </View>
    );
}
