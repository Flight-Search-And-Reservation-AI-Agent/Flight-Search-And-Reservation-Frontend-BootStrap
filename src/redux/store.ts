import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
 // Ensure correct import of your slice

export const store = configureStore({
    reducer: {
        user: userSlice,  // Corrected the typo here
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;  // Corrected the typo here
