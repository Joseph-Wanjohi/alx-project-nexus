// Correct types based on the API responses
export interface User {
    id: number;
    username: string;
    email: string;
    roles: 'user' | 'admin';
    is_active: boolean;
    date_joined: string;
}

export interface UserCreateData {
    username: string;
    email: string;
    password?: string;
    roles: 'user' | 'admin';
}

export interface Option {
    id?: number;
    text: string;
}

export interface AdminPoll {
    id: number;
    question: string;
    creator: number;
    category: string;
    created_at: string;
    expiry_date: string;
    options: Option[];
}

export interface AdminPollCreateData {
    question: string;
    creator: number;
    category: string;
    expiry_date: string;
    options: { text: string }[];
}

export interface Category {
    value: string;
    label: string;
}

// Updated Vote type to match your API response
export interface Vote {
    id: number;
    user: string;
    poll: string;
    option: string;
    created_at: string;
}

// Types for authentication and user registration
export interface RegisterUser {
    username: string;
    email: string;
    password: string;
    password2: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
}

export interface RegisterError {
    [key: string]: string[];
}
