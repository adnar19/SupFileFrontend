import axios from "axios";
import { API_URL } from "./config";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

export const Signin = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
        });

        if (response.data.success) {
            Cookies.set('token', response.data.data.token, { expires: 15 });
            return response.status;
        } else {
            toast.error(response.data.message)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status !== undefined &&
                error.response.status >= 400 &&
                error.response.status < 500) {
                toast.error(
                    error.response.data?.message
                );
                return;
            }

            toast.error("Server Error !");
        }
    }
};

export const Signup = async (fullName: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            fullName,
            email,
            password,
        });

        if (response.data.success) {
            Cookies.set('token', response.data.accessToken, { expires: 15 });
            return response.status;
        } else {
            toast.error(response.data.message)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status !== undefined &&
                error.response.status >= 400 &&
                error.response.status < 500) {
                toast.error(
                    error.response?.data?.message || "Une erreur est survenue"
                );
                return;
            }

            toast.error("Server Error !");
        }
    }
};

export const GoogleSignup = async (token: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/oauth/signup`, {
            idToken: token
        });
        console.log(response.data);

        if (response.data.success) {
            Cookies.set('token', response.data.accessToken, { expires: 15 });
        } else {
            toast.error(response.data.message)
        }
        return response.data.statusCode;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status !== undefined &&
                error.response.status >= 400 &&
                error.response.status < 500) {
                toast.error(
                    error.response?.data?.message || "Une erreur est survenue"
                );
                return;
            }
            console.log(error);
            toast.error("Server Error !");
        }
    }
};

export const Logout = async () => {
    try {
        const token = Cookies.get('token');
        await axios.post(`${API_URL}/auth/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        Cookies.remove('token');
        return true;
    } catch (error) {
        Cookies.remove('token');
        return false;
    }
};

export const ForgotPassword = async (email: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
        return null;
    }
};

export const ResetPassword = async (token: string, password: string, confirmPassword: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, {
            password,
            confirmPassword
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "Reset failed");
        }
        return null;
    }
};

export const ChangePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
        const token = Cookies.get('token');
        const response = await axios.post(`${API_URL}/auth/change-password`, {
            currentPassword,
            newPassword,
            confirmPassword
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "Change password failed");
        }
        return null;
    }
};