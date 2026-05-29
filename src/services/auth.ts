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
            return response;
        } else {
            toast.error(response.data.message)
            return response;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status !== undefined &&
                error.response.status >= 400 &&
                error.response.status < 500) {
                toast.error(
                    error.response.data?.message
                );
                return error.response;
            }

            toast.error("Server Error !");
        }
    }
};

export const Logout = async () => {
    try {
        const token = Cookies.get('token');
        const response = await axios.post(`${API_URL}/auth/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.status === 200 || response.data.success) {
            Cookies.remove('token');
            return true;
        }
        return false;
    } catch (error) {
        console.error("Logout error", error);
        Cookies.remove('token'); 
        return false;
    }
};

export const ForgotPassword = async (email: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status !== undefined &&
                error.response.status >= 400 &&
                error.response.status < 500) {
                toast.error(error.response?.data?.message || "Une erreur est survenue");
                return error.response;
            }
            toast.error("Server Error !");
        }
        return null;
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
            return response;
        } else {
            toast.error(response.data.message)
            return response;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status !== undefined &&
                error.response.status >= 400 &&
                error.response.status < 500) {
                toast.error(
                    error.response?.data?.message || "Une erreur est survenue"
                );
                return error.response;
            }

            toast.error("Server Error !");
        }
    }
};

export const GoogleSignup = async (token: string) => {
    return OAuthSignup(token, 'google');
};

export const OAuthSignup = async (token: string, provider: 'google' | 'microsoft') => {
    try {
        const response = await axios.post(`${API_URL}/auth/oauth/signup`, {
            provider,
            idToken: token
        });
        if (response.data.success) {
            Cookies.set('token', response.data.data.token, { expires: 15 });
        } else {
            toast.error(response.data.message);
        }
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status !== undefined &&
                error.response.status >= 400 &&
                error.response.status < 500) {
                toast.error(
                    error.response?.data?.message || "Une erreur est survenue"
                );
                return error.response;
            }
            toast.error("Server Error !");
        }
    }
};

export const OAuthSignin = async (token: string, provider: 'google' | 'microsoft') => {
    try {
        const response = await axios.post(`${API_URL}/auth/oauth/signin`, {
            provider,
            idToken: token
        });
        if (response.data.success) {
            Cookies.set('token', response.data.data.token, { expires: 15 });
        } else {
            toast.error(response.data.message);
        }
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status !== undefined &&
                error.response.status >= 400 &&
                error.response.status < 500) {
                toast.error(
                    error.response?.data?.message || "Une erreur est survenue"
                );
                return error.response;
            }
            toast.error("Server Error !");
        }
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
        const response = await axios.put(`${API_URL}/auth/change-password`, {
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

export const GetUser = async (id: string) => {
    try {
        const token = Cookies.get('token');
        const response = await axios.get(`${API_URL}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Get user error", error);
        return null;
    }
};

export const UploadAvatar = async (file: File) => {
    try {
        const token = Cookies.get('token');
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.put(`${API_URL}/auth/avatar`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "Avatar upload failed");
        }
        return null;
    }
};

export const UpdateProfile = async (id: string, fullName: string, theme: string, email: string) => {
    try {
        const token = Cookies.get('token');
        const response = await axios.put(`${API_URL}/users/${id}/profile`, {
            fullName,
            theme,
            email
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "Update profile failed");
        }
        return null;
    }
};