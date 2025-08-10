// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, isAdmin, loading, user } = useAuth();

    // Show loading while authentication state is being determined
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-jordy-blue"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated but user data is still loading/missing, 
    // allow access (this prevents logout loops)
    if (!user) {
        // You might want to show a different loading state here
        // or fetch user data in the background
        console.warn('User authenticated but user data not available');
    }

    // Check role permissions
    if (allowedRoles && allowedRoles.length > 0) {
        const hasValidRole = allowedRoles.some(role => 
            (role === 'admin' && isAdmin) || (role === 'user' && !isAdmin)
        );
        
        if (!hasValidRole) {
            // Redirect based on user role instead of generic /home
            const redirectPath = isAdmin ? '/admin/dashboard' : '/active-polls';
            return <Navigate to={redirectPath} replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;