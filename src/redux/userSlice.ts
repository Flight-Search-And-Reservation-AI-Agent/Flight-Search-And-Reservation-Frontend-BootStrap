import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
    username: string;
    email: string;
    fullName?: string;
    role: string;
}

interface UserState {
    user: UserProfile | null;
    token: string | null;
}

const initialState: UserState = {
    user: null,
    token: localStorage.getItem('token') || null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserProfile>) => {
            state.user = action.payload;
        },
        updateUser: (state, action: PayloadAction<Partial<UserProfile>>) => {
            if (state.user) {
                state.user = {
                    ...state.user,
                    ...action.payload,
                };
            }
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('usernamee');
            localStorage.removeItem('userId');
            localStorage.removeItem('role');
        },
    },
});

export const { setUser, setToken, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;
