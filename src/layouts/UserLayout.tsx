// src/layouts/UserLayout.tsx
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface UserLayoutProps {
    children: ReactNode;
}

export const UserLayout = ({ children }: UserLayoutProps) => {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigationItems = [
        { 
            id: 'home', 
            label: 'Home', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        { 
            id: 'explore', 
            label: 'Explore', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        { 
            id: 'history', 
            label: 'History', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        { 
            id: 'profile', 
            label: 'Profile', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
    ];

    const handleCreatePoll = () => {
        navigate('/create-poll');
    };

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar Toggle Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`hidden lg:fixed lg:top-4 lg:z-50 lg:flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50 border border-gray-200 ${
                    sidebarOpen ? 'lg:left-[260px]' : 'lg:left-4'
                }`}
            >
                <svg
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                        sidebarOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Desktop Sidebar */}
            <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 z-40 ${
                sidebarOpen ? 'lg:w-64 lg:translate-x-0' : 'lg:w-64 lg:-translate-x-full'
            }`}>
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
                    {/* Logo/Brand Section */}
                    <div className="flex items-center h-16 px-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Polly</h1>
                            </div>
                        </div>
                    </div>

                    {/* User Info Section */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                {isAuthenticated && user ? (
                                    <>
                                        {user.email ? (
                                            <img
                                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                        G
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {isAuthenticated && user ? user.username : 'Guest'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {isAuthenticated ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.id}
                                to={`/${item.id}`}
                                className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                                    location.pathname === `/${item.id}`
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <div className="mr-3">
                                    {item.icon}
                                </div>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Create Poll Button */}
                    <div className="p-4">
                        <button
                            onClick={handleCreatePoll}
                            className="w-full bg-gray-900 text-white py-2.5 px-4 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors duration-150 flex items-center justify-center space-x-2"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Create Poll</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Top Navbar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h1 className="text-lg font-semibold text-gray-900">Polly</h1>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        {isAuthenticated && user ? (
                            <>
                                {user.email ? (
                                    <img
                                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                G
                            </div>
                        )}
                        <button
                            onClick={logout}
                            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
                <div className="flex items-center justify-around py-2">
                    {navigationItems.slice(0, 2).map((item) => (
                        <Link
                            key={item.id}
                            to={`/${item.id}`}
                            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-150 ${
                                location.pathname === `/${item.id}`
                                    ? 'text-gray-900 bg-gray-100'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <div className="mb-1">{item.icon}</div>
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    ))}
                    
                    {/* Create Poll Button - Center */}
                    <button
                        onClick={handleCreatePoll}
                        className="bg-gray-900 w-12 h-12 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-800 transition-colors duration-150"
                    >
                        <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    
                    {navigationItems.slice(2).map((item) => (
                        <Link
                            key={item.id}
                            to={`/${item.id}`}
                            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-150 ${
                                location.pathname === `/${item.id}`
                                    ? 'text-gray-900 bg-gray-100'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <div className="mb-1">{item.icon}</div>
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
                <main className="min-h-screen pt-16 pb-20 lg:pt-6 lg:pb-6 px-4 lg:px-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};