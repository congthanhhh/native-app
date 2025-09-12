import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { Input, InputField, InputIcon } from "@/components/ui/input";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
  ButtonGroup,
} from "@/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  searchMoviesThunk, 
  searchSuggestionsThunk,
  setSearchTerm,
  setShowSuggestions,
  clearSearch,
  clearSuggestions,
  selectSearchResults,
  selectIsLoading,
  selectSearchTerm,
  selectSuggestions,
  selectShowSuggestions,
  selectError,
  selectTotalResults,
  selectHasMorePages,
  selectCurrentPage,
  selectIsLoadingMore
} from "@/store/searchSlice";
import fallbackMoviePoster from "@/utils/fallbackImage";
import CategoryButton from "@/components/ui/CategoryButton";

export default function Search() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isWaitingToSearch, setIsWaitingToSearch] = useState(false);
  
  // Redux state
  const searchResults = useSelector(selectSearchResults);
  const isLoading = useSelector(selectIsLoading);
  const isLoadingMore = useSelector(selectIsLoadingMore);
  const searchTerm = useSelector(selectSearchTerm);
  const suggestions = useSelector(selectSuggestions);
  const showSuggestions = useSelector(selectShowSuggestions);
  const error = useSelector(selectError);
  const totalResults = useSelector(selectTotalResults);
  const hasMorePages = useSelector(selectHasMorePages);
  const currentPage = useSelector(selectCurrentPage);
  
  // Handle input change with auto-search and debounce
  const handleInputChange = (text) => {
    setInputValue(text);
    dispatch(setSearchTerm(text));
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Auto search with debounce - search after 800ms delay
    if (text.trim().length >= 3) {
      setIsWaitingToSearch(true);
      const newTimeout = setTimeout(() => {
        setIsWaitingToSearch(false);
        dispatch(clearSuggestions());
        dispatch(setShowSuggestions(false));
        dispatch(searchMoviesThunk({ searchTerm: text.trim(), page: 1 }));
      }, 800);
      setSearchTimeout(newTimeout);
    } else if (text.trim().length === 0) {
      // Clear results when input is empty
      setIsWaitingToSearch(false);
      dispatch(clearSearch());
      dispatch(clearSuggestions());
    } else {
      // Less than 3 characters
      setIsWaitingToSearch(false);
    }
  };
  
  // Handle search submission (still keep for Enter key)
  const handleSearch = () => {
    if (inputValue.trim().length >= 3) {
      // Clear timeout to avoid duplicate search
      if (searchTimeout) {
        clearTimeout(searchTimeout);
        setSearchTimeout(null);
      }
      
      setIsWaitingToSearch(false);
      dispatch(clearSuggestions());
      dispatch(setShowSuggestions(false));
      dispatch(searchMoviesThunk({ searchTerm: inputValue.trim(), page: 1 }));
    }
  };
  
  // Handle suggestion selection
  const handleSuggestionSelect = (movie) => {
    setInputValue(movie.title);
    dispatch(setSearchTerm(movie.title));
    dispatch(clearSuggestions());
    dispatch(setShowSuggestions(false));
    dispatch(searchMoviesThunk({ searchTerm: movie.title, page: 1 }));
  };
  
  // Handle load more - Limit to 20 results total
  const handleLoadMore = () => {
    if (hasMorePages && !isLoadingMore && searchTerm && searchResults.length < 20) {
      dispatch(searchMoviesThunk({ 
        searchTerm: searchTerm, 
        page: currentPage + 1 
      }));
    }
  };
  
  // Clear search
  const handleClearSearch = () => {
    setInputValue('');
    dispatch(clearSearch());
    dispatch(clearSuggestions());
  };
  
  // Handle input focus
  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      dispatch(setShowSuggestions(true));
    }
  };
  
  // Handle input blur
  const handleInputBlur = () => {
    // Delay hiding suggestions to allow selection
    setTimeout(() => {
      dispatch(setShowSuggestions(false));
    }, 200);
  };

  // Handle category selection
  const handleCategorySelect = (searchTerm) => {
    setInputValue(searchTerm);
    dispatch(setSearchTerm(searchTerm));
    dispatch(clearSuggestions());
    dispatch(setShowSuggestions(false));
    dispatch(searchMoviesThunk({ searchTerm: searchTerm, page: 1 }));
  };

  // Render search result item
  const renderSearchResult = ({ item }) => {
    // Only render movies with complete information
    if (!item.imdbID || !item.title || !item.year) {
      return null;
    }

    return (
      <TouchableOpacity onPress={() => router.push(`/movie/${item.imdbID}`)}>
        <Card size="md" variant="filled" className="bg-black mb-3">
          <View className="flex-row items-center">
            <Image
              source={{ 
                uri: item.poster && item.poster !== 'N/A' 
                  ? item.poster 
                  : fallbackMoviePoster 
              }}
              className="w-32 h-20 rounded mr-3 bg-gray-300"
              alt={item.title}
              style={{ resizeMode: 'cover' }}
            />
            <View className="flex-1">
              <Heading size="md" className="mb-1 text-white">
                {item.title}
              </Heading>
              <Text className="text-gray-400 text-sm">
                {item.year} • {item.type || 'movie'}
              </Text>
            </View>
            <Ionicons name="play" size={28} color="#fff" className="ml-2" />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  // Render suggestion item
  const renderSuggestion = ({ item }) => {
    // Only render movies with complete information
    if (!item.imdbID || !item.title || !item.year) {
      return null;
    }

    return (
      <TouchableOpacity onPress={() => router.push(`/movie/${item.imdbID}`)}>
        <Card size="md" variant="filled" className="bg-black/80 mb-2">
          <View className="flex-row items-center">
            <Image
              source={{ 
                uri: item.poster && item.poster !== 'N/A' 
                  ? item.poster 
                  : fallbackMoviePoster 
              }}
              className="w-16 h-12 rounded mr-3 bg-gray-300"
              alt={item.title}
              style={{ resizeMode: 'cover' }}
            />
            <View className="flex-1">
              <Text className="text-white font-medium">{item.title}</Text>
              <Text className="text-gray-400 text-xs">{item.year}</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color="#fff" className="ml-2" />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView className="flex-1 px-4 pt-20 bg-netflix-black w-full">
      {/* Search Input */}
      <View className="relative">
        <Input
          className="w-full h-12 bg-gray-50/10"
          variant="outline"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputField
            className="text-white font-bold"
            placeholder="Search movies, series... (min 3 characters)"
            value={inputValue}
            onChangeText={handleInputChange}
            onSubmitEditing={handleSearch}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            returnKeyType="search"
          />
          {inputValue ? (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close" size={24} color="#fff" className="m-2" />
            </TouchableOpacity>
          ) : (
            <Ionicons name="search" size={24} color="#fff" className="m-2" />
          )}
        </Input>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <View className="absolute top-14 left-0 right-0 z-50 bg-gray-900/95 rounded-lg p-2 max-h-60">
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              renderItem={renderSuggestion}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <View className="flex-1 mt-4">
          <Text className="text-white text-lg font-bold mb-3">
            Search Results ({Math.min(totalResults, 20)})
            {totalResults > 20 && (
              <Text className="text-gray-400 text-sm"> • Showing top 20 results</Text>
            )}
          </Text>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={renderSearchResult}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => {
              if (isLoadingMore) {
                return (
                  <View className="py-4 items-center">
                    <ButtonSpinner size="small" color="#fff" />
                    <Text className="text-white mt-2">Loading more...</Text>
                  </View>
                );
              }
              if (searchResults.length >= 20 && totalResults > 20) {
                return (
                  <View className="py-4 items-center">
                    <Text className="text-gray-400 text-sm text-center">
                      Showing top 20 results to save API usage
                    </Text>
                  </View>
                );
              }
              return null;
            }}
          />
        </View>
      )}

      {/* Minimum Characters Message */}
      {inputValue.length > 0 && inputValue.length < 3 && !isLoading && !isWaitingToSearch && (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="information-circle" size={48} color="#6b7280" />
          <Text className="text-gray-400 mt-4 text-center">
            Type at least 3 characters to search
          </Text>
          <Text className="text-gray-500 mt-2 text-center text-sm">
            Current: {inputValue.length}/3 characters
          </Text>
        </View>
      )}

      {/* Waiting to Search State */}
      {isWaitingToSearch && (
        <View className="flex-1 justify-center items-center">
          <ButtonSpinner size="large" color="#fff" />
          <Text className="text-white mt-4">Preparing search...</Text>
        </View>
      )}

      {/* Loading State */}
      {isLoading && !isWaitingToSearch && (
        <View className="flex-1 justify-center items-center">
          <ButtonSpinner size="large" color="#fff" />
          <Text className="text-white mt-4">Searching...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text className="text-white mt-4 text-center">{error}</Text>
          <Button 
            size="md" 
            variant="outline" 
            className="mt-4"
            onPress={() => inputValue && handleSearch()}
          >
            <ButtonText>Try Again</ButtonText>
          </Button>
        </View>
      )}

      {/* Empty State */}
      {!isLoading && !isWaitingToSearch && !error && searchResults.length === 0 && !inputValue && (
        <>
          <Text className="text-white text-lg font-bold mt-4 mb-3">Browse Categories</Text>
          {/* Categories Grid */}
          <View className="flex-row mt-4">
            <View className="flex-1 p-1 right-2">
              <CategoryButton
                categoryName="Anime"
                searchTerm="anime"
                onPress={handleCategorySelect}
              />
            </View>
            <View className="flex-1 p-1 left-1">
              <CategoryButton
                categoryName="K-Drama"
                searchTerm="korean drama"
                onPress={handleCategorySelect}
              />
            </View>
          </View>
          <View className="flex-row mt-3">
            <View className="flex-1 p-1 right-2">
              <CategoryButton
                categoryName="Marvel"
                searchTerm="marvel"
                onPress={handleCategorySelect}
              />
            </View>
            <View className="flex-1 p-1 left-1">
              <CategoryButton
                categoryName="Comedy"
                searchTerm="comedy"
                onPress={handleCategorySelect}
              />
            </View>
          </View>
          <View className="flex-row mt-3">
            <View className="flex-1 p-1 right-2">
              <CategoryButton
                categoryName="Action"
                searchTerm="action"
                onPress={handleCategorySelect}
              />
            </View>
            <View className="flex-1 p-1 left-1">
              <CategoryButton
                categoryName="Sport"
                searchTerm="sport"
                onPress={handleCategorySelect}
              />
            </View>
          </View>
          <View className="flex-row mt-3">
            <View className="flex-1 p-1 right-2">
              <CategoryButton
                categoryName="Horror"
                searchTerm="horror"
                onPress={handleCategorySelect}
              />
            </View>
            <View className="flex-1 p-1 left-1">
              <CategoryButton
                categoryName="Romance"
                searchTerm="romance"
                onPress={handleCategorySelect}
              />
            </View>
          </View>
          <View className="flex-row mt-3">
            <View className="flex-1 p-1 right-2">
              <CategoryButton
                categoryName="Thriller"
                searchTerm="thriller"
                onPress={handleCategorySelect}
              />
            </View>
            <View className="flex-1 p-1 left-1">
              <CategoryButton
                categoryName="Sci-Fi"
                searchTerm="science fiction"
                onPress={handleCategorySelect}
              />
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
