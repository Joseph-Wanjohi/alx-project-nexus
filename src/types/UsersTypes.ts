// src/types/UsersTypes.ts
export interface User {
    id: number;
    username: string;
    email: string;
    roles: string;  
    is_active: boolean;
    date_joined: string;
}

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