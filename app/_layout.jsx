import { Tabs, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import ReduxProvider from "@/components/ReduxProvider";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Pressable } from "@/components/ui/pressable";
import { View } from "react-native";
import { useState } from "react";
import { HeaderBgContext } from "@/context/HeaderBgContext";

export default function RootLayout() {

    const router = useRouter();
    const [headerBgColor, setHeaderBgColor] = useState('transparent');

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

    const HeaderBackButton = () => {
        const router = useRouter();
        return (
            <Pressable onPress={() => router.back()} style={{ paddingLeft: 16 }}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
        );
    }
    return (
        <ReduxProvider>
            <SafeAreaProvider>
                <GluestackUIProvider mode="light">
                    <StatusBar style="light" />
                    <HeaderBgContext.Provider value={{ headerBgColor, setHeaderBgColor }}>
                        <Tabs
                            screenOptions={{
                                tabBarActiveTintColor: '#e50914',
                                tabBarInactiveTintColor: 'gray',
                                tabBarStyle: {
                                    backgroundColor: '#141414',
                                },
                                headerTransparent: true,
                                headerStyle: {
                                    backgroundColor: headerBgColor,
                                },
                                headerTintColor: '#fff',
                                tabBarShowLabel: true,
                                headerRight: () => <HeaderButtons />,
                            }}
                        >
                            <Tabs.Screen
                                name="index"
                                options={{
                                    tabBarLabel: 'Trang chủ',
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="home" size={size} color={color} />
                                    ),
                                    headerTitle: '',
                                    headerShown: true,
                                    headerTransparent: true,
                                    headerLeft: () => null,
                                }}
                            />
                            <Tabs.Screen
                                name="favorites"
                                options={{
                                    tabBarLabel: 'Yêu thích',
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="heart" size={size} color={color} />
                                    ),
                                    headerTitle: 'Yêu thích',
                                    headerTransparent: true,
                                    headerLeft: () => <HeaderBackButton />,
                                }}
                            />
                            <Tabs.Screen
                                name="account"
                                options={{
                                    tabBarLabel: 'Tài khoản',
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="person" size={size} color={color} />
                                    ),
                                    headerTitle: 'Tài khoản',
                                    headerTransparent: true,
                                    headerLeft: () => <HeaderBackButton />,
                                }}
                            />
                            <Tabs.Screen
                                name="movie"
                                options={{
                                    href: null, // Hide entire movie section from tabs
                                    headerShown: false, // No header for nested routes
                                }}
                            />
                        </Tabs>
                    </HeaderBgContext.Provider>
                </GluestackUIProvider>
            </SafeAreaProvider>
        </ReduxProvider>
    );
    // ...existing code...
}