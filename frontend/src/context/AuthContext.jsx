import { createContext, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage synchronously (no useEffect needed)
    const [user, setUser] = useState(() => {
        const storedUser = authService.getUser();
        const token = authService.getToken();
        return (storedUser && token) ? storedUser : null;
    });
    const [loading] = useState(false);

    const login = async (username, password) => {
        const response = await authService.login(username, password);
        authService.setAuth(response.data);
        const userData = {
            username: response.data.username,
            fullName: response.data.fullName,
            email: response.data.email,
            role: response.data.role,
        };
        setUser(userData);
        return userData;
    };

    const register = async (userData) => {
        const response = await authService.register(userData);
        authService.setAuth(response.data);
        const userInfo = {
            username: response.data.username,
            fullName: response.data.fullName,
            email: response.data.email,
            role: response.data.role,
        };
        setUser(userInfo);
        return userInfo;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const isAdmin = () => user?.role === 'ADMIN';

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
