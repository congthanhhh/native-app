import { Tabs, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import ReduxProvider from "@/components/ReduxProvider";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Pressable } from "@/components/ui/pressable";
import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect, createContext, useRef } from "react";
// Context để truyền setUsername xuống các màn hình con
export const UsernameContext = createContext({ setUsername: () => { } });
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeaderBgContext } from "@/context/HeaderBgContext";

export default function RootLayout() {

    const router = useRouter();
    const [headerBgColor, setHeaderBgColor] = useState('transparent');

    const [username, setUsername] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
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
            <Pressable onPress={() => router.push('/search')} className="mr-4">
                <Ionicons name="search" size={24} color="#fff" />
            </Pressable>
            {username ? (
                <View className="relative mr-4">
                    <TouchableOpacity
                        onPress={() => setShowDropdown(!showDropdown)}
                        className="flex-row items-center"
                    >
                        <View className="w-8 h-8 bg-red-600 rounded-full items-center justify-center mr-2">
                            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                                {username.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={16} color="#fff" />
                    </TouchableOpacity>

                    {showDropdown && (
                        <View
                            style={{
                                position: 'absolute',
                                top: 40,
                                right: 0,
                                backgroundColor: '#1a1a1a',
                                borderRadius: 8,
                                paddingVertical: 8,
                                minWidth: 160,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 8,
                                elevation: 5,
                                zIndex: 1000,
                            }}
                        >
                            {/* Username Display */}
                            <View style={{ paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#333' }}>
                                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{username}</Text>
                            </View>

                            {/* Account Page */}
                            <TouchableOpacity
                                onPress={() => {
                                    setShowDropdown(false);
                                    router.push('/account');
                                }}
                                style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Ionicons name="person" size={16} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={{ color: '#fff', fontSize: 14 }}>Tài khoản</Text>
                            </TouchableOpacity>

                            {/* Logout */}
                            <TouchableOpacity
                                onPress={async () => {
                                    setShowDropdown(false);
                                    await AsyncStorage.multiRemove(['token', 'user']);
                                    setUsername("");
                                    router.replace('/account/login');
                                }}
                                style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Ionicons name="log-out" size={16} color="#e50914" style={{ marginRight: 8 }} />
                                <Text style={{ color: '#e50914', fontSize: 14 }}>Đăng xuất</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ) : null}
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