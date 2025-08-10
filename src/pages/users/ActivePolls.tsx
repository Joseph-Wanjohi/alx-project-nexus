// src/pages/users/ActivePolls.tsx
import React, { useState, useEffect } from 'react';
import { useGetActivePollsQuery } from '../../api/pollsApi';
import { Link } from 'react-router-dom';
import type { Poll } from '../../types/PollsTypes';

const ActivePolls = () => {
    const { data: polls = [], isLoading, error } = useGetActivePollsQuery();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every minute for accurate countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

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

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-jordy-blue border-t-transparent mx-auto mb-4"></div>
                    <p className="text-charcoal/70 text-lg">Loading active polls...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-coral-red/10 border border-coral-red/20 rounded-xl p-8 text-center">
                    <div className="text-coral-red text-4xl mb-4">⚠️</div>
                    <p className="text-coral-red font-medium">Error loading polls</p>
                    <p className="text-charcoal/70 text-sm mt-2">{error.toString()}</p>
                </div>
            </div>
        );
    }

    if (!polls.length) {
        return (
            <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">📊</div>
                    <h2 className="text-2xl font-bold text-charcoal mb-2">No Active Polls</h2>
                    <p className="text-charcoal/70">Check back later for new polls to participate in!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
            <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-jordy-blue to-light-sky-blue rounded-2xl mb-4 shadow-lg">
                        <span className="text-2xl text-white">📊</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-charcoal to-charcoal/80 bg-clip-text text-transparent mb-2">
                        Active Polls
                    </h1>
                    <p className="text-charcoal/60 text-lg">Participate in ongoing community discussions</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-jordy-blue to-light-sky-blue mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Polls Grid */}
                <div className="grid gap-6 md:gap-8 lg:grid-cols-3 lg:gap-6">
                    {polls.map((poll) => (
                        <Link
                            key={poll.id}
                            to={`/poll/${poll.id}`}
                            className="group block"
                        >
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:border-jordy-blue/30 overflow-hidden group-hover:-translate-y-1">
                                {/* Poll Header */}
                                <div className="p-6 pb-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                        <h3 className="text-xl font-bold text-charcoal group-hover:text-jordy-blue transition-colors duration-300 line-clamp-2">
                                            {poll.question}
                                        </h3>
                                        <div className="flex-shrink-0">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-jordy-blue/10 to-light-sky-blue/10 text-jordy-blue border border-jordy-blue/20">
                                                {poll.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Poll Metadata */}
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <div className="flex items-center text-charcoal/70">
                                            <div className="w-2 h-2 rounded-full bg-jordy-blue mr-2"></div>
                                            <span className="font-medium">By {poll.creator}</span>
                                        </div>
                                        <div className={`flex items-center ${getTimeRemainingColor(poll.expiry_date)}`}>
                                            <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                                            <span className="font-medium">{calculateTimeRemaining(poll.expiry_date)}</span>
                                        </div>
                                        <div className="flex items-center text-charcoal/70">
                                            <div className="w-2 h-2 rounded-full bg-forest-green mr-2"></div>
                                            <span className="font-medium">
                                                {poll.options.reduce((sum, option) => sum + option.votes, 0)} vote{poll.options.reduce((sum, option) => sum + option.votes, 0) !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Poll Options */}
                                <div className="px-6 pb-6">
                                    <div className="space-y-3">
                                        {poll.options.map((option, index) => (
                                            <div key={option.id} className="relative">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center flex-1">
                                                        <span className="text-sm font-medium text-charcoal mr-2">
                                                            {option.text}
                                                        </span>
                                                        {poll.user_vote && poll.user_vote.id === option.id && (
                                                            <div className="inline-flex items-center px-2 py-1 rounded-full bg-forest-green/10 text-forest-green text-xs font-medium border border-forest-green/20">
                                                                <span className="mr-1">✓</span>Your Vote
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-charcoal/60 font-medium">
                                                        {option.percentage}% ({option.votes})
                                                    </span>
                                                </div>
                                                
                                                {/* Progress Bar */}
                                                <div className="relative h-2 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full overflow-hidden">
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
                                                            transitionDelay: `${index * 100}ms`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-jordy-blue/5 to-light-sky-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                                
                                {/* Click Indicator */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                    <div className="w-8 h-8 rounded-full bg-jordy-blue/10 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-jordy-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivePolls;