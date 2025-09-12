import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './slice/movieSlice';
// import favoriteReducer from '../features/favorite/favoriteSlice';

export const store = configureStore({
    reducer: {
        movie: movieReducer,
        // favorite: favoriteReducer,
    },
});
