import React, { useState, useContext } from "react";
import { View } from "react-native";
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { login } from "@/api/auth/authService";
import { jwtDecode } from 'jwt-decode';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { UsernameContext } from '../_layout';

export default function LoginScreen() {
    const { setUsername: setHeaderUsername } = useContext(UsernameContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await login(username, password);

            if (data.token) {
                await AsyncStorage.setItem("token", data.token);

                try {
                    const decodedToken = jwtDecode(data.token);

                    const userData = {
                        username,
                        _id: decodedToken.id || decodedToken._id || decodedToken.userId || decodedToken.sub,
                        email: decodedToken.email,
                        ...decodedToken
                    };

                    await AsyncStorage.setItem("user", JSON.stringify(userData));
                } catch (tokenError) {
                    console.error('Error decoding token:', tokenError);
                    await AsyncStorage.setItem("user", JSON.stringify({ username }));
                }

                setHeaderUsername(username);
                router.replace("/account");
            } else {
                setError("Không nhận được token");
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.error || "Đăng nhập thất bại");
        } finally {
            setLoading(false);
        }
    }; return (
        <View className="flex-1 justify-center items-center bg-black px-6">
            <Text className="text-white text-2xl font-bold mb-8">Đăng nhập</Text>

            {/* Username input */}
            <Input className="mb-4 w-full bg-neutral-800 rounded-lg">
                <InputField
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    className="text-white px-3"
                />
            </Input>

            {/* Password input */}
            <Input className="mb-4 w-full bg-neutral-800 rounded-lg">
                <InputField
                    placeholder="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="text-white px-3"
                />
            </Input>

            {/* Error message */}
            {error ? (
                <Text className="text-red-500 mb-2">{error}</Text>
            ) : null}

            {/* Login button */}
            <Button
                className="w-full mb-2"
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ButtonSpinner color="white" />
                ) : (
                    <ButtonText>Đăng nhập</ButtonText>
                )}
            </Button>

            {/* Register button */}
            <Button
                variant="outline"
                className="w-full"
                onPress={() => router.push("/account/register")}
            >
                <ButtonText>Đăng ký tài khoản mới</ButtonText>
            </Button>
        </View>
    );
}
