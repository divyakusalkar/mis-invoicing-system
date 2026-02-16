import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const authApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authService = {
    login: (username, password) =>
        authApi.post('/auth/login', { username, password }),

    register: (userData) =>
        authApi.post('/auth/register', userData),

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken: () => localStorage.getItem('token'),

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    setAuth: (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            username: data.username,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
        }));
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    isAdmin: () => {
        const user = authService.getUser();
        return user?.role === 'ADMIN';
    },
};

export default authService;
