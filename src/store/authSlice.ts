import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "../interfaces";

const initialState: AuthState = {
    user: null,
    token: ""
}

const authSLice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        }
    }

})
export const { setCredentials, logout } = authSLice.actions;
export default authSLice.reducer;