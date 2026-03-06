import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register'];

// Request interceptor to add token to all requests except auth endpoints
API.interceptors.request.use(
    (config) => {
        const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
            config.url?.includes(endpoint)
        );

        if (!isPublicEndpoint) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear user data
            localStorage.removeItem('user');
            // Optionally refresh page or redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const setAuthToken = (token: string | null) => {
    if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common['Authorization'];
    }
}

export default API;