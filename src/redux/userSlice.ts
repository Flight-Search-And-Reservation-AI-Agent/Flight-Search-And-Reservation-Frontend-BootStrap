import { createSlice,type PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
    username: string;
    email: string;
    fullName?: string;
}

interface UserState {
    user: UserProfile | null;
    token: string | null;
}

const initialState: UserState = {
    user: null,
    token: localStorage.getItem('token') || null,  // Retrieve token from localStorage
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Set user profile
        setUser: (state, action: PayloadAction<UserProfile>) => {
            state.user = action.payload;
        },

        // Update user profile (for example after editing the profile)
        updateUser: (state, action: PayloadAction<Partial<UserProfile>>) => {
            if (state.user) {
                state.user = {
                    ...state.user,
                    ...action.payload,  // Merge existing user data with the updated data
                };
            }
        },

        // Set JWT token
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);  // Store token in localStorage
        },

        // Clear user and token data (for logout)
        clearUser: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token'); // Remove token from localStorage
        },
    },
});

// Export actions for dispatch
export const { setUser, setToken, clearUser, updateUser } = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;
