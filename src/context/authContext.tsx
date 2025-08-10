// src/context/authContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGetUserQuery, useLoginMutation, useRegisterMutation } from '../api/userApi';
import type { User } from '../types/UsersTypes';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    register: (userData: { username: string; email: string; password: string; password2: string }) => Promise<void>;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => void;
    error: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Start with loading true
    const [shouldFetchUser, setShouldFetchUser] = useState<boolean>(false);
    
    const [registerMutation] = useRegisterMutation();
    const [loginMutation] = useLoginMutation();

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsAuthenticated(true);
            setShouldFetchUser(true);
        } else {
            setLoading(false); // No token, so we're done loading
        }
    }, []);

    // Only fetch user data when we should fetch and are authenticated
    const { data: currentUser, isLoading: userLoading, error: userError } = useGetUserQuery(undefined, {
        skip: !shouldFetchUser || !isAuthenticated,
    });

    // Update user and admin status when user data is fetched
    useEffect(() => {
        if (shouldFetchUser) {
            if (currentUser && !userLoading) {
                setUser(currentUser);
                setIsAdmin(currentUser.roles === 'admin');
                setLoading(false);
            } else if (userError && !userLoading) {
                // Only logout on authentication errors (401/403), not network errors
                const isAuthError = 'status' in userError && 
                    (userError.status === 401 || userError.status === 403);
                
                if (isAuthError) {
                    console.error('Authentication failed, logging out:', userError);
                    logout();
                } else {
                    // For network errors, keep user logged in but show they're authenticated
                    // The user can still navigate, and the query will retry
                    console.warn('Network error fetching user data:', userError);
                    setLoading(false);
                }
            }
        }
    }, [currentUser, userLoading, userError, shouldFetchUser]);

    const register = async (userData: { username: string; email: string; password: string; password2: string }) => {
        setLoading(true);
        setError(null);
        try {
            await registerMutation(userData).unwrap();
            await login({ username: userData.username, password: userData.password });
        } catch (err: any) {
            setError(err?.data?.detail || 'Registration failed');
            setLoading(false);
        }
    };

    const login = async (credentials: { username: string; password: string }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await loginMutation(credentials).unwrap();
            localStorage.setItem('accessToken', response.access);
            localStorage.setItem('refreshToken', response.refresh);
            
            setIsAuthenticated(true);
            setShouldFetchUser(true);
        } catch (err: any) {
            setError(err?.data?.detail || 'Login failed');
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
        setError(null);
        setShouldFetchUser(false);
        setLoading(false);
    };

    const value = {
        user,
        isAuthenticated,
        isAdmin,
        register,
        login,
        logout,
        error,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};