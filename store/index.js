import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slice/searchSlice';
import movieReducer from './slice/movieSlice';
import favoriteReducer from './slice/favoriteSlice';

export const store = configureStore({
    reducer: {
        search: searchReducer,
        movie: movieReducer,
        favorite: favoriteReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});
