import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function AccountScreen() {
    const [token, setToken] = useState(null);
    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            const checkToken = async () => {
                const t = await AsyncStorage.getItem('token');
                if (!t) {
                    router.replace('/account/login');
                } else if (isActive) {
                    setToken(t);
                }
            };
            checkToken();
            return () => {
                isActive = false;
            };
        }, [router])
    );

    if (!token) {
        return null; // hoặc loading
    }

    return (
        <View className="flex-1 items-center justify-center bg-black">
            <Text className="text-white text-xl">My Account</Text>
        </View>
    );
}