import React, { useState, useContext } from 'react';
import { View, ScrollView, Alert, RefreshControl } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getUserById, updateUser } from '@/api/service/userService';
import { UsernameContext } from './_layout';
import { useDispatch } from 'react-redux';
import { clearFavorites } from '@/store/slice/favoriteSlice';

export default function AccountScreen() {
    const { setUsername: setHeaderUsername } = useContext(UsernameContext);
    const dispatch = useDispatch();
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    // Form states
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            const loadUserData = async () => {
                try {
                    setLoading(true);
                    const [tokenData, userData] = await Promise.all([
                        AsyncStorage.getItem('token'),
                        AsyncStorage.getItem('user')
                    ]);

                    if (!tokenData) {
                        router.replace('/account/login');
                        return;
                    }

                    if (isActive) {
                        setToken(tokenData);

                        if (userData) {
                            const parsedUser = JSON.parse(userData);
                            setUser(parsedUser);
                            setUsername(parsedUser.username || '');
                            setEmail(parsedUser.email || '');

                            // Fetch fresh user data from API
                            if (parsedUser._id) {
                                const result = await getUserById(parsedUser._id);
                                if (result.success && isActive) {
                                    setUser(result.user);
                                    setUsername(result.user.username || '');
                                    setEmail(result.user.email || '');
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error loading user data:', error);
                    setError('Lỗi khi tải thông tin user');
                } finally {
                    if (isActive) {
                        setLoading(false);
                    }
                }
            };

            loadUserData();

            return () => {
                isActive = false;
            };
        }, [router])
    );

    const handleSave = async () => {
        if (!user?._id) {
            setError('Không tìm thấy ID user');
            return;
        }

        setUpdateLoading(true);
        setError('');

        try {
            const updateData = {
                username,
                email
            };

            // Only include password if it's entered
            if (password.trim()) {
                updateData.password = password;
            }

            const result = await updateUser(user._id, updateData);

            if (result.success) {
                // Update local state
                setUser(result.user);
                setHeaderUsername(result.user.username);

                // Update AsyncStorage
                await AsyncStorage.setItem('user', JSON.stringify(result.user));

                setIsEditing(false);
                setPassword(''); // Clear password field

                Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Save error:', error);
            setError('Lỗi khi cập nhật thông tin');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form to original values
        setUsername(user?.username || '');
        setEmail(user?.email || '');
        setPassword('');
        setIsEditing(false);
        setError('');
    };

    const handleLogout = async () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Đăng xuất',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.multiRemove(['token', 'user']);
                        dispatch(clearFavorites());
                        setHeaderUsername('');
                        router.replace('/account/login');
                    }
                }
            ]
        );
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setError('');

        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                if (parsedUser._id) {
                    const result = await getUserById(parsedUser._id);
                    if (result.success) {
                        setUser(result.user);
                        setUsername(result.user.username || '');
                        setEmail(result.user.email || '');

                        // Update AsyncStorage with fresh data
                        await AsyncStorage.setItem('user', JSON.stringify(result.user));
                    } else {
                        setError(result.error);
                    }
                }
            }
        } catch (error) {
            console.error('Error refreshing user data:', error);
            setError('Lỗi khi làm mới thông tin');
        } finally {
            setRefreshing(false);
        }
    };

    if (!token || loading) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <Text className="text-white">Đang tải...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-black"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#e50914']}
                    tintColor="#e50914"
                    progressBackgroundColor="#141414"
                />
            }
        >
            <View className="px-6 py-8 mt-24">
                {/* Profile Avatar with First Letter */}
                <View className="self-center mb-2 mt-4 w-24 h-24 bg-red-600 rounded-full items-center justify-center">
                    <Text className="text-white text-3xl font-bold">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </Text>
                </View>
                <Text className='text-white text-xl text-center mb-2 font-bold uppercase'>{user?.username}</Text>

                {/* Profile Info */}
                <View className="bg-neutral-900 rounded-lg p-6 mb-6">
                    <Text className="text-white text-xl font-semibold mb-4">Thông tin cá nhân</Text>

                    {/* Username */}
                    <View className="mb-4">
                        <Text className="text-gray-400 text-sm mb-2">Tên đăng nhập</Text>
                        {isEditing ? (
                            <Input className="bg-neutral-800 rounded-lg">
                                <InputField
                                    value={username}
                                    onChangeText={setUsername}
                                    className="text-white px-3"
                                    autoCapitalize="none"
                                />
                            </Input>
                        ) : (
                            <Text className="text-white text-lg">{user?.username || 'Chưa có'}</Text>
                        )}
                    </View>

                    {/* Email */}
                    <View className="mb-4">
                        <Text className="text-gray-400 text-sm mb-2">Email</Text>
                        {isEditing ? (
                            <Input className="bg-neutral-800 rounded-lg">
                                <InputField
                                    value={email}
                                    onChangeText={setEmail}
                                    className="text-white px-3"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </Input>
                        ) : (
                            <Text className="text-white text-lg">{user?.email || 'Chưa có'}</Text>
                        )}
                    </View>

                    {/* Password (only when editing) */}
                    {isEditing && (
                        <View className="mb-4">
                            <Text className="text-gray-400 text-sm mb-2">Mật khẩu mới (để trống nếu không đổi)</Text>
                            <Input className="bg-neutral-800 rounded-lg">
                                <InputField
                                    value={password}
                                    onChangeText={setPassword}
                                    className="text-white px-3"
                                    secureTextEntry
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </Input>
                        </View>
                    )}

                    {/* Error message */}
                    {error ? (
                        <Text className="text-red-500 mb-4">{error}</Text>
                    ) : null}

                    {/* Action buttons */}
                    {isEditing ? (
                        <View className="flex-row gap-3">
                            <Button
                                className="flex-1 bg-green-600"
                                onPress={handleSave}
                                disabled={updateLoading}
                            >
                                {updateLoading ? (
                                    <ButtonSpinner color="white" />
                                ) : (
                                    <ButtonText>Lưu</ButtonText>
                                )}
                            </Button>

                            <Button
                                className="flex-1 bg-blue-600"
                                onPress={handleCancel}
                                disabled={updateLoading}
                            >
                                <ButtonText>Hủy</ButtonText>
                            </Button>
                        </View>
                    ) : (
                        <Button
                            className="bg-blue-600"
                            onPress={() => setIsEditing(true)}
                        >
                            <ButtonText>Chỉnh sửa</ButtonText>
                        </Button>
                    )}
                </View>

                {/* Account Info */}
                {user?.createdAt && (
                    <View className="bg-neutral-900 rounded-lg p-6 mb-6">
                        <Text className="text-white text-xl font-semibold mb-4">Thông tin tài khoản</Text>
                        <View className="mb-2">
                            <Text className="text-gray-400 text-sm">Ngày tạo tài khoản</Text>
                            <Text className="text-white text-lg">
                                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Logout button */}
                <Button
                    className="bg-red-600"
                    onPress={handleLogout}
                >
                    <ButtonText>Đăng xuất</ButtonText>
                </Button>
            </View>
        </ScrollView>
    );
}