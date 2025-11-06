import type { AuthState } from "../../interfaces";
import { logout } from "../../store/authSlice";
import { store } from "../../store/store";
import axiosInstance, { authInstance } from "../axiosInstance";

const AuthServices = {
    Login: async (data: { email: string; password: string }): Promise<AuthState> => {
        const res = await authInstance.post('/auth/login', data);
        console.log("reeees",res)
        return res.data;
    },
    logout: async (): Promise<void> => {
        await axiosInstance.post('/auth/login');

        store.dispatch(logout());
        localStorage.removeItem('token');
    }
}
export default AuthServices;