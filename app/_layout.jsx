import { Tabs, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Pressable } from "@/components/ui/pressable";
import { View } from "react-native";

export default function RootLayout() {

    const router = useRouter();

    const HeaderButtons = () => (
        <View className="flex-row items-center">
            <Pressable onPress={() => router.push('/search')} className="mr-4">
                <Ionicons name="search" size={24} color="#fff" />
            </Pressable>
            <Pressable onPress={() => router.push('/notifications')} className="mr-4">
                <Ionicons name="notifications" size={24} color="#fff" />
            </Pressable>
        </View>
    );

    return (
        <SafeAreaProvider>
            <GluestackUIProvider mode="light">
                <StatusBar style="light" backgroundColor="#000000" />
                <Tabs
                    screenOptions={{
                        tabBarActiveTintColor: '#e50914',
                        tabBarInactiveTintColor: 'gray',
                        tabBarStyle: {
                            backgroundColor: '#141414',
                        },
                        headerTransparent: true,
                        headerStyle: {
                            backgroundColor: 'transparent',
                        },
                        headerTintColor: '#fff',
                        tabBarShowLabel: true,
                        headerRight: () => <HeaderButtons />,
                    }}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: 'Trang chủ',
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="home" size={size} color={color} />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="favorites"
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="heart" size={size} color={color} />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="account"
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="settings" size={size} color={color} />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="search"
                        options={{
                            href: null, // Ẩn khỏi tabs
                        }}
                    />
                </Tabs>
            </GluestackUIProvider>
        </SafeAreaProvider>
    );
}