import { Tabs, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import ReduxProvider from "@/components/ReduxProvider";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Pressable } from "@/components/ui/pressable";
import { View, Text } from "react-native";
import { useState, useEffect, createContext } from "react";
// Context để truyền setUsername xuống các màn hình con
export const UsernameContext = createContext({ setUsername: () => { } });
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeaderBgContext } from "@/context/HeaderBgContext";

export default function RootLayout() {

    const router = useRouter();
    const [headerBgColor, setHeaderBgColor] = useState('transparent');

    const [username, setUsername] = useState("");
    useEffect(() => {
        const getUsername = async () => {
            const userStr = await AsyncStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setUsername(user.username || "");
                } catch {
                    setUsername("");
                }
            } else {
                setUsername("");
            }
        };
        getUsername();
    }, []);

    const HeaderButtons = () => (
        <View className="flex-row items-center">
            {username ? (
                <View className="flex-row items-center mr-4">
                    <Ionicons name="person" size={20} color="#fff" style={{ marginRight: 4 }} />
                    <Text style={{ color: '#fff', fontSize: 14, marginRight: 8 }}>{username}</Text>
                    <Pressable
                        onPress={async () => {
                            await AsyncStorage.removeItem('token');
                            await AsyncStorage.removeItem('user');
                            setUsername("");
                            router.replace('/account/login');
                        }}
                        style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#e50914', borderRadius: 4 }}
                    >
                        <Text style={{ color: '#fff', fontSize: 12 }}>Logout</Text>
                    </Pressable>
                </View>
            ) : null}
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
                        <UsernameContext.Provider value={{ setUsername }}>
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
                                    name="favorites/index"
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
                                    name="account/login"
                                    options={{
                                        href: null,
                                        headerShown: false,
                                    }}
                                />
                                <Tabs.Screen
                                    name="account/register"
                                    options={{
                                        href: null,
                                        headerShown: false,
                                    }}
                                />
                                <Tabs.Screen
                                    name="movie"
                                    options={{
                                        href: null, // Hide entire movie section from tabs
                                        headerShown: false, // No header for nested routes
                                    }}
                                />
                                <Tabs.Screen
                                    name="search"
                                    options={{
                                        href: null, // Hide entire movie section from tabs
                                        headerShown: false, // No header for nested routes
                                    }}
                                />
                                <Tabs.Screen
                                    name="category/[id]"
                                    options={{
                                        href: null, // Hide entire movie section from tabs
                                        headerShown: false, // No header for nested routes
                                    }}
                                />
                            </Tabs>
                        </UsernameContext.Provider>
                    </HeaderBgContext.Provider>
                </GluestackUIProvider>
            </SafeAreaProvider>
        </ReduxProvider>
    );
    // ...existing code...
}