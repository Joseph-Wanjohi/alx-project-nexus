// src/pages/users/Register.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const { register, error, loading } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

    const validateField = (name: string, value: string) => {
        const errors: {[key: string]: string} = {};
        
        switch (name) {
            case 'username':
                if (value.length < 3) {
                    errors.username = 'Username must be at least 3 characters';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors.email = 'Please enter a valid email address';
                }
                break;
            case 'password':
                if (value.length < 6) {
                    errors.password = 'Password must be at least 6 characters';
                }
                if (formData.password2 && value !== formData.password2) {
                    errors.password2 = 'Passwords do not match';
                }
                break;
            case 'password2':
                if (value !== formData.password) {
                    errors.password2 = 'Passwords do not match';
                }
                break;
        }
        
        setValidationErrors(prev => ({ ...prev, ...errors }));
        
        // Clear error if validation passes
        if (Object.keys(errors).length === 0) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Real-time validation
        if (value) {
            validateField(name, value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate all fields before submission
        Object.keys(formData).forEach(key => {
            validateField(key, formData[key as keyof typeof formData]);
        });
        
        if (Object.keys(validationErrors).length === 0) {
            await register(formData);
            if (!error && !loading) {
                navigate('/home');
            }
        }
    };

    const getFieldIcon = (fieldName: string) => {
        const icons = {
            username: (
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            email: (
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
            ),
            password: (
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
        };
        return icons[fieldName as keyof typeof icons] || icons.password;
    };

    const renderField = (
        name: string,
        type: string,
        placeholder: string,
        label: string,
        showPasswordToggle = false
    ) => (
        <div className="space-y-2">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {getFieldIcon(name)}
                </div>
                <input
                    type={
                        showPasswordToggle
                            ? (name === 'password' ? (showPassword ? 'text' : 'password') 
                               : name === 'password2' ? (showConfirmPassword ? 'text' : 'password') 
                               : type)
                            : type
                    }
                    id={name}
                    name={name}
                    value={formData[name as keyof typeof formData]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(name)}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-10 ${showPasswordToggle ? 'pr-12' : 'pr-4'} py-3 border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                        validationErrors[name]
                            ? 'border-red-500 bg-red-50/30 shadow-lg ring-4 ring-red-200/20'
                            : focusedField === name
                            ? 'border-blue-500 bg-blue-50/30 shadow-lg ring-4 ring-blue-200/20'
                            : 'border-gray-200 hover:border-gray-300'
                    } focus:outline-none`}
                    placeholder={placeholder}
                    required
                />
                {showPasswordToggle && (
                    <button
                        type="button"
                        onClick={() => {
                            if (name === 'password') setShowPassword(!showPassword);
                            if (name === 'password2') setShowConfirmPassword(!showConfirmPassword);
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {(name === 'password' ? showPassword : showConfirmPassword) ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3.122-3.122L15 15" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {validationErrors[name] && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {validationErrors[name]}
                </p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent mb-2">
                        Join Polly Today
                    </h1>
                    <p className="text-gray-600">Create your account to start polling</p>
                </div>

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-6 border-b border-gray-100/50">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></div>
                            Create Account
                        </h2>
                    </div>

                    {/* Form */}
                    <div className="p-6">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-red-600 text-sm flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {renderField('username', 'text', 'Enter your username', 'Username')}
                            {renderField('email', 'email', 'Enter your email', 'Email Address')}
                            {renderField('password', 'password', 'Create a password', 'Password', true)}
                            {renderField('password2', 'password', 'Confirm your password', 'Confirm Password', true)}

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Password strength</span>
                                        <span className={`font-medium ${
                                            formData.password.length >= 8 ? 'text-green-600' : 
                                            formData.password.length >= 6 ? 'text-amber-600' : 'text-red-600'
                                        }`}>
                                            {formData.password.length >= 8 ? 'Strong' : 
                                             formData.password.length >= 6 ? 'Medium' : 'Weak'}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                formData.password.length >= 8 ? 'bg-green-500 w-full' : 
                                                formData.password.length >= 6 ? 'bg-amber-500 w-2/3' : 'bg-red-500 w-1/3'
                                            }`}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || Object.keys(validationErrors).length > 0}
                                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Create Account
                                    </div>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-100/50">
                            <p className="text-center text-gray-600">
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline"
                                >
                                    Sign in instead
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        By creating an account, you agree to our terms of service
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;