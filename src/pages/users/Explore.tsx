// src/pages/users/Explore.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useGetActivePollsQuery, useGetCategoriesQuery } from '../../api/pollsApi';
import { Link } from 'react-router-dom';
import type { Poll } from '../../types/PollsTypes';

const Explore = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [currentTime, setCurrentTime] = useState(new Date());

    // Get polls with category filter
    const { data: allPolls = [], isLoading, error } = useGetActivePollsQuery(
        selectedCategory === 'All' ? {} : { category: selectedCategory }
    );
    
    const { data: categoriesData = [] } = useGetCategoriesQuery();

    // Update current time every minute for accurate countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    // Extract unique categories from API or fallback to default
    const categories = useMemo(() => {
        return ['All', ...categoriesData.map(cat => cat.label).sort()];
    }, [categoriesData]);

    // Since we're now filtering on the backend, we don't need to filter again
    const filteredPolls = allPolls;

    const calculateTimeRemaining = (expiryDate: string | null) => {
        if (!expiryDate) return 'No expiration';

        const expiry = new Date(expiryDate);
        const now = currentTime;
        const timeDiff = expiry.getTime() - now.getTime();

        if (timeDiff <= 0) return 'Expired';

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ${hours}h remaining`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m remaining`;
        } else {
            return `${minutes}m remaining`;
        }
    };

    const getTimeRemainingColor = (expiryDate: string | null) => {
        if (!expiryDate) return 'text-charcoal/70';

        const expiry = new Date(expiryDate);
        const now = currentTime;
        const timeDiff = expiry.getTime() - now.getTime();
        const hoursRemaining = timeDiff / (1000 * 60 * 60);

        if (hoursRemaining <= 0) return 'text-coral-red';
        if (hoursRemaining <= 24) return 'text-amber-600';
        return 'text-forest-green';
    };

    const getPollStatus = (expiryDate: string | null) => {
        if (!expiryDate) return { text: 'Ongoing', color: 'bg-blue-100 text-blue-800 border-blue-200' };
        
        const isExpired = new Date(expiryDate) < currentTime;
        return isExpired 
            ? { text: 'Expired', color: 'bg-coral-red/10 text-coral-red border-coral-red/20' }
            : { text: 'Active', color: 'bg-forest-green/10 text-forest-green border-forest-green/20' };
    };

    // Get total counts for category badges
    const getCategoryCount = (category: string) => {
        if (category === 'All') {
            return allPolls.length;
        }
        // Since we're filtering on backend, we need to show current filtered count
        // This is a limitation - we'd need a separate endpoint to get all counts
        return selectedCategory === category ? allPolls.length : 0;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
                <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-jordy-blue border-t-transparent mx-auto mb-4"></div>
                        <p className="text-charcoal/70 text-lg">Loading polls...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
                <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="bg-coral-red/10 border border-coral-red/20 rounded-xl p-8 text-center">
                        <div className="text-coral-red text-4xl mb-4">⚠️</div>
                        <p className="text-coral-red font-medium">Error loading polls</p>
                        <p className="text-charcoal/70 text-sm mt-2">{error.toString()}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-charcoal mb-2">Explore Polls</h1>
                    <p className="text-charcoal/60 text-lg">Discover and participate in community discussions</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-jordy-blue to-light-sky-blue mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Category Filter - Mobile Optimized Grid */}
                <div className="mb-8">
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 sm:justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-2 sm:px-6 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                                    selectedCategory === category
                                        ? 'bg-gradient-to-r from-jordy-blue to-light-sky-blue text-white shadow-lg shadow-jordy-blue/25'
                                        : 'bg-white/70 text-charcoal hover:bg-white/90 shadow-md border border-gray-200/50 hover:border-jordy-blue/30'
                                }`}
                            >
                                <span className="truncate block">{category}</span>
                                {selectedCategory === category && (
                                    <span className="ml-1 sm:ml-2 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-white/20 rounded-full text-xs">
                                        {getCategoryCount(category)}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Summary */}
                <div className="text-center mb-8">
                    <p className="text-charcoal/70">
                        Showing <span className="font-semibold text-jordy-blue">{filteredPolls.length}</span> poll{filteredPolls.length !== 1 ? 's' : ''}
                        {selectedCategory !== 'All' && (
                            <span> in <span className="font-semibold text-jordy-blue">{selectedCategory}</span></span>
                        )}
                    </p>
                </div>

                {/* Polls Grid */}
                {filteredPolls.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-2xl font-bold text-charcoal mb-2">No Polls Found</h3>
                        <p className="text-charcoal/70">
                            {selectedCategory === 'All' 
                                ? "No polls available at the moment." 
                                : `No polls found in the "${selectedCategory}" category.`
                            }
                        </p>
                        {selectedCategory !== 'All' && (
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className="mt-4 px-6 py-2 bg-jordy-blue text-white rounded-lg hover:bg-jordy-blue/90 transition-colors"
                            >
                                View All Polls
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6 md:gap-8 lg:grid-cols-3 lg:gap-6">
                        {filteredPolls.map((poll) => {
                            const status = getPollStatus(poll.expiry_date);
                            return (
                                <Link
                                    key={poll.id}
                                    to={`/poll/${poll.id}`}
                                    className="group block"
                                >
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:border-jordy-blue/30 overflow-hidden group-hover:-translate-y-1">
                                        {/* Poll Header */}
                                        <div className="p-4 sm:p-6 pb-4">
                                            {/* Title and Status/Category Row */}
                                            <div className="mb-4">
                                                <h3 className="text-lg sm:text-xl font-bold text-charcoal group-hover:text-jordy-blue transition-colors duration-300 line-clamp-2 mb-3">
                                                    {poll.question}
                                                </h3>
                                                
                                                {/* Mobile-optimized Category and Status */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-gradient-to-r from-jordy-blue/10 to-light-sky-blue/10 text-jordy-blue border border-jordy-blue/20 flex-shrink-0">
                                                        {poll.category}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium border flex-shrink-0 ${status.color}`}>
                                                        {status.text}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Poll Metadata - Mobile Optimized */}
                                            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-sm">
                                                <div className="flex items-center text-charcoal/70">
                                                    <div className="w-2 h-2 rounded-full bg-jordy-blue mr-2 flex-shrink-0"></div>
                                                    <span className="font-medium truncate">By {poll.creator}</span>
                                                </div>
                                                <div className={`flex items-center ${getTimeRemainingColor(poll.expiry_date)}`}>
                                                    <div className="w-2 h-2 rounded-full bg-current mr-2 flex-shrink-0"></div>
                                                    <span className="font-medium">{calculateTimeRemaining(poll.expiry_date)}</span>
                                                </div>
                                                <div className="flex items-center text-charcoal/70">
                                                    <div className="w-2 h-2 rounded-full bg-forest-green mr-2 flex-shrink-0"></div>
                                                    <span className="font-medium">
                                                        {poll.options.reduce((sum, option) => sum + option.votes, 0)} vote{poll.options.reduce((sum, option) => sum + option.votes, 0) !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Poll Options Preview */}
                                        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                                            <div className="space-y-2">
                                                {poll.options.slice(0, 3).map((option, index) => (
                                                    <div key={option.id} className="relative">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="flex items-center flex-1 min-w-0">
                                                                <span className="text-sm font-medium text-charcoal mr-2 truncate">
                                                                    {option.text}
                                                                </span>
                                                                {poll.user_vote && poll.user_vote.id === option.id && (
                                                                    <div className="inline-flex items-center px-2 py-1 rounded-full bg-forest-green/10 text-forest-green text-xs font-medium border border-forest-green/20 flex-shrink-0">
                                                                        <span className="mr-1">✓</span>
                                                                        <span className="hidden sm:inline">Your Vote</span>
                                                                        <span className="sm:hidden">You</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-charcoal/60 font-medium ml-2 flex-shrink-0">
                                                                {option.percentage}%
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Progress Bar */}
                                                        <div className="relative h-1.5 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full overflow-hidden">
                                                            <div
                                                                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out ${
                                                                    poll.user_vote && poll.user_vote.id === option.id
                                                                        ? 'bg-gradient-to-r from-forest-green to-forest-green/80'
                                                                        : `bg-gradient-to-r ${
                                                                            index % 4 === 0 ? 'from-jordy-blue to-jordy-blue/80' :
                                                                            index % 4 === 1 ? 'from-light-sky-blue to-light-sky-blue/80' :
                                                                            index % 4 === 2 ? 'from-indigo-400 to-indigo-400/80' :
                                                                            'from-purple-400 to-purple-400/80'
                                                                        }`
                                                                }`}
                                                                style={{ 
                                                                    width: `${option.percentage}%`,
                                                                    transitionDelay: `${index * 50}ms`
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                {poll.options.length > 3 && (
                                                    <div className="text-xs text-charcoal/60 text-center pt-2">
                                                        +{poll.options.length - 3} more option{poll.options.length - 3 !== 1 ? 's' : ''}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Hover Effect Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-jordy-blue/5 to-light-sky-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                                        
                                        {/* Click Indicator */}
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-jordy-blue/10 flex items-center justify-center">
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-jordy-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;