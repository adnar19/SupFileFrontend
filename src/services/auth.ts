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
            Cookies.set('token', response.data.accessToken, { expires: 15 });
            return response.status;
        } else {
            toast.error(response.data.message)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
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