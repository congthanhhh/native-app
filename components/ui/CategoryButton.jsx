import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { getCategoryMovie } from '@/api/service/searchService';
import fallbackMoviePoster from '@/utils/fallbackImage';

// Cache for category images to avoid repeated API calls
const categoryImageCache = {};

const CategoryButton = ({ categoryName, searchTerm, onPress, size = "w-48 h-28" }) => {
    const [categoryImage, setCategoryImage] = useState(fallbackMoviePoster);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCategoryImage = async () => {
            try {
                setIsLoading(true);
                
                // Check cache first
                if (categoryImageCache[searchTerm]) {
                    setCategoryImage(categoryImageCache[searchTerm]);
                    setIsLoading(false);
                    return;
                }
                
                const result = await getCategoryMovie(searchTerm);
                if (result.movie && result.movie.poster && result.movie.imdbID && result.movie.title) {
                    categoryImageCache[searchTerm] = result.movie.poster; // Cache the result
                    setCategoryImage(result.movie.poster);
                } else {
                    categoryImageCache[searchTerm] = fallbackMoviePoster; // Cache fallback too
                    setCategoryImage(fallbackMoviePoster);
                }
            } catch (error) {
                console.error('Error loading category image:', error);
                categoryImageCache[searchTerm] = fallbackMoviePoster;
                setCategoryImage(fallbackMoviePoster);
            } finally {
                setIsLoading(false);
            }
        };

        loadCategoryImage();
    }, [searchTerm]);

    return (
        <Button 
            size="md" 
            variant="solid" 
            action="primary" 
            className={`${size} p-0 overflow-hidden`}
            onPress={() => onPress(searchTerm)}
        >
            <View className="relative w-full h-full justify-center items-center">
                <Image
                    source={{ uri: categoryImage }}
                    className="absolute w-full h-full left-0 top-0 z-0"
                    style={{ resizeMode: 'cover' }}
                    alt={`${categoryName}-bg`}
                />
                <View className="absolute w-full h-full left-0 top-0 bg-black/40 z-10" pointerEvents="none" />
                <ButtonText className="z-20 text-white font-extrabold text-xl text-center">
                    {categoryName}
                </ButtonText>
                {isLoading && (
                    <View className="absolute w-full h-full left-0 top-0 bg-black/60 z-30 justify-center items-center">
                        <ButtonText className="text-white text-xs">Loading...</ButtonText>
                    </View>
                )}
            </View>
        </Button>
    );
};

export default CategoryButton;