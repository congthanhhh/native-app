import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { register } from "@/api/auth/authService";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await register(username, email, password);
            setSuccess("Đăng ký thành công!");
            setTimeout(() => router.replace("/account/login"), 1000);
        } catch (err) {
            setError(err.error || "Đăng ký thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="flex-1 bg-black justify-center px-6">
            <VStack space="lg" className="w-full max-w-md mx-auto">
                <Text className="text-white text-2xl font-bold text-center mb-4">
                    Đăng ký
                </Text>

                <Input className="mb-2">
                    <InputField
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        className="text-white"
                    />
                </Input>

                <Input className="mb-2">
                    <InputField
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        className="text-white"
                    />
                </Input>

                <Input className="mb-2">
                    <InputField
                        placeholder="Mật khẩu"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        className="text-white"
                    />
                </Input>

                {error ? (
                    <Text className="text-red-500 text-center">{error}</Text>
                ) : null}
                {success ? (
                    <Text className="text-green-500 text-center">{success}</Text>
                ) : null}

                <Button onPress={handleRegister} isDisabled={loading} className="w-full">
                    <ButtonText>{loading ? "Đang đăng ký..." : "Đăng ký"}</ButtonText>
                </Button>

                <Button
                    variant="outline"
                    onPress={() => router.replace("/account/login")}
                    className="w-full"
                >
                    <ButtonText>Đã có tài khoản? Đăng nhập</ButtonText>
                </Button>
            </VStack>
        </Box>
    );
}
