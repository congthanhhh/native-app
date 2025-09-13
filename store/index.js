import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './slice/movieSlice';
import favoriteReducer from './slice/favoriteSlice';

export const store = configureStore({
    reducer: {
        movie: movieReducer,
        favorite: favoriteReducer,
    },
});
