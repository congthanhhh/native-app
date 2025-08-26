import { Stack } from 'expo-router';
import { View } from 'react-native';
import { Pressable } from "@/components/ui/pressable";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MovieLayout() {
    const router = useRouter();

    const HeaderBackButton = () => (
        <Pressable onPress={() => router.back()} style={{ paddingLeft: 16 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
    );

    return (
        <Stack>
            <Stack.Screen
                name="[id]/index"
                options={{
                    headerTitle: '',
                    headerLeft: () => <HeaderBackButton />,
                    headerTransparent: true,
                    headerStyle: {
                        backgroundColor: 'transparent',
                    },
                }}
            />
            <Stack.Screen
                name="[id]/watch"
                options={{
                    headerShown: false, // Hide header for fullscreen video
                    presentation: 'modal', // Optional: present as modal
                }}
            />
        </Stack>
    );
}
