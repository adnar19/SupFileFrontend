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