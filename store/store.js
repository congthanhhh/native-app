import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice';
import movieReducer from './slice/movieSlice';

export const store = configureStore({
    reducer: {
        search: searchReducer,
        movie: movieReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});