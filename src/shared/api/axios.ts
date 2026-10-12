import axios from 'axios';
import { storage } from '../lib/storage';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5067';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = storage.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            storage.clearAccessToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);