import React from 'react';
import { View, TouchableOpacity, ToastAndroid } from 'react-native';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';

const ActionButtons = ({
    onDownload,
    onAddToList,
    onShare,
    showDownloadText = true
}) => {
    const handleDownload = () => {
        if (onDownload) {
            onDownload();
        } else {
            ToastAndroid.show('Tính năng tải xuống đang phát triển', ToastAndroid.SHORT);
        }
    };

    const handleAddToList = () => {
        if (onAddToList) {
            onAddToList();
        } else {
            ToastAndroid.show('Đã thêm vào danh sách yêu thích', ToastAndroid.SHORT);
        }
    };

    const handleShare = () => {
        if (onShare) {
            onShare();
        } else {
            ToastAndroid.show('Tính năng chia sẻ đang phát triển', ToastAndroid.SHORT);
        }
    };

    return (
        <View className="flex-row space-x-4 mb-6">
            <TouchableOpacity
                className="bg-netflix-white flex-1 rounded-md py-3"
                onPress={handleDownload}
            >
                <View className="flex-row items-center justify-center">
                    <Ionicons name="download" size={20} color="#000" />
                    {showDownloadText && (
                        <Text className="text-black font-semibold ml-2">
                            Tải xuống
                        </Text>
                    )}
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                className="bg-netflix-darkGray rounded-md px-6 py-3"
                onPress={handleAddToList}
            >
                <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
                className="bg-netflix-darkGray rounded-md px-6 py-3"
                onPress={handleShare}
            >
                <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

export default ActionButtons;
