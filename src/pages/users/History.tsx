import React, { useState } from 'react';
import { useGetUserPollHistoryQuery } from '../../api/pollsApi';
import { useAuth } from '../../context/authContext';
import { Link } from 'react-router-dom';
import type { Poll } from '../../types/PollsTypes';
import UserPolls from './UserPolls';

const History = () => {
  const { isAuthenticated } = useAuth();
  const { data: polls = [], isLoading, error } = useGetUserPollHistoryQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [showMyPolls, setShowMyPolls] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-warm-white rounded-2xl shadow-medium border border-light-gray text-center p-12">
            <div className="text-6xl mb-6 text-charcoal">🔒</div>
            <h2 className="text-3xl font-bold text-charcoal mb-4">Access Required</h2>
            <p className="text-slate-gray text-lg mb-8">Sign in to view your poll history and track your voting journey.</p>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-3 bg-jordy-blue text-white font-medium rounded-lg hover:bg-deep-sky-blue focus:outline-none focus:ring-4 focus:ring-jordy-blue focus:ring-opacity-20 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-jordy-blue border-t-transparent mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-charcoal mb-2">Loading Your History</h2>
            <p className="text-slate-gray">Gathering your poll journey...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-warm-white rounded-2xl shadow-medium border border-light-gray text-center p-12">
            <div className="text-6xl mb-6 text-error">⚠️</div>
            <h2 className="text-2xl font-bold text-error mb-4">Error Loading History</h2>
            <p className="text-slate-gray mb-8">{error.toString()}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-8 py-3 bg-error text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-error focus:ring-opacity-20 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-warm-white rounded-2xl shadow-medium border border-light-gray text-center p-12">
            <div className="text-6xl mb-6 text-charcoal">📊</div>
            <h2 className="text-3xl font-bold text-charcoal mb-4">No History Yet</h2>
            <p className="text-slate-gray text-lg mb-8">Start your polling journey by participating in polls or creating your own!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/polls"
                className="inline-flex items-center px-8 py-3 bg-jordy-blue text-white font-medium rounded-lg hover:bg-deep-sky-blue focus:outline-none focus:ring-4 focus:ring-jordy-blue focus:ring-opacity-20 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Browse Polls
              </Link>
              <Link
                to="/create-poll"
                className="inline-flex items-center px-8 py-3 bg-forest-green text-white font-medium rounded-lg hover:bg-emerald-green focus:outline-none focus:ring-4 focus:ring-forest-green focus:ring-opacity-20 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Poll
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryStyle = (category: string) => {
    const styles = {
      ENT: { bg: 'bg-blue-50', text: 'text-jordy-blue', badge: 'bg-blue-100 text-jordy-blue border-blue-200', icon: '🎬' },
      TECH: { bg: 'bg-indigo-50', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-600 border-indigo-200', icon: '💻' },
      SPRT: { bg: 'bg-green-50', text: 'text-forest-green', badge: 'bg-green-100 text-forest-green border-green-200', icon: '⚽' },
      POL: { bg: 'bg-purple-50', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-600 border-purple-200', icon: '🏛️' },
      LIFE: { bg: 'bg-orange-50', text: 'text-sunset-orange', badge: 'bg-orange-100 text-sunset-orange border-orange-200', icon: '🌟' },
      EDU: { bg: 'bg-teal-50', text: 'text-teal-600', badge: 'bg-teal-100 text-teal-600 border-teal-200', icon: '📚' },
    };
    return styles[category as keyof typeof styles] || { bg: 'bg-gray-50', text: 'text-slate-gray', badge: 'bg-gray-100 text-slate-gray border-gray-200', icon: '📋' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeStatus = (poll: Poll) => {
    if (!poll.expiry_date) return { text: 'Ongoing', color: 'text-forest-green', bg: 'bg-green-50 border-green-200' };
    
    const now = new Date();
    const expiry = new Date(poll.expiry_date);
    
    if (expiry < now) {
      return { text: 'Expired', color: 'text-error', bg: 'bg-red-50 border-red-200' };
    } else {
      return { text: 'Active', color: 'text-forest-green', bg: 'bg-green-50 border-green-200' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Your Polling History</h1>
          <p className="text-xl text-slate-gray">Track your voting journey and see how your opinions evolved</p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-warm-white rounded-full border border-light-gray shadow-soft">
            <span className="text-sm text-slate-gray">Total polls participated: </span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-jordy-blue rounded-full text-sm font-medium">{polls.length}</span>
          </div>
        </div>

        {/* Toggle Button for UserPolls */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowMyPolls(!showMyPolls)}
            className="relative inline-flex items-center px-8 py-3 bg-jordy-blue text-white font-semibold rounded-full hover:bg-deep-sky-blue focus:outline-none focus:ring-4 focus:ring-jordy-blue focus:ring-opacity-20 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <span className="mr-2">View My Polls</span>
            <div className={`w-5 h-5 ${showMyPolls ? 'rotate-45' : ''} transition-transform duration-300`}>
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </button>
        </div>

        {/* UserPolls Component with Animation */}
        {showMyPolls && (
          <div className="mb-8 animate-fade-in">
            <UserPolls />
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-powder-blue hidden lg:block"></div>

          <div className="space-y-8">
            {polls.map((poll, index) => {
              const categoryStyle = getCategoryStyle(poll.category);
              const timeStatus = getTimeStatus(poll);
              const isEven = index % 2 === 0;

              return (
                <div key={poll.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-jordy-blue rounded-full z-10 hidden lg:block"></div>

                  <div className={`lg:flex lg:items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8`}>
                    {/* Poll Card */}
                    <div className={`lg:w-1/2 ${isEven ? 'lg:pr-8' : 'lg:pl-8'}`}>
                      <div className="bg-warm-white rounded-2xl shadow-medium border border-light-gray overflow-hidden hover:shadow-strong transition-all duration-300 transform hover:-translate-y-1">
                        {/* Card Header */}
                        <div className={`${categoryStyle.bg} p-6 border-b border-gray-200`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{categoryStyle.icon}</span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryStyle.badge}`}>
                                {poll.category}
                              </span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${timeStatus.bg} ${timeStatus.color}`}>
                              {timeStatus.text}
                            </div>
                          </div>
                          <h3 className={`text-xl font-bold leading-tight ${categoryStyle.text}`}>{poll.question}</h3>
                        </div>

                        {/* Card Body */}
                        <div className="p-6">
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center text-sm text-slate-gray">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Created by {poll.creator}
                            </div>
                            <div className="flex items-center text-sm text-slate-gray">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-4 8l-6-6M2 17l6-6" />
                              </svg>
                              {formatDate(poll.created_at)}
                            </div>
                            {poll.expiry_date && (
                              <div className="flex items-center text-sm text-slate-gray">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Expires {formatDate(poll.expiry_date)}
                              </div>
                            )}
                          </div>

                          {/* Your Vote Status */}
                          {poll.user_vote && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-jordy-blue rounded-full mr-3"></div>
                                <span className="text-sm font-medium text-jordy-blue">Your Vote:</span>
                                <span className="ml-2 text-sm text-jordy-blue">{poll.user_vote.text}</span>
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => setSelectedPoll(poll)}
                            className={`w-full ${categoryStyle.bg} ${categoryStyle.text} font-medium py-3 px-4 rounded-lg hover:bg-opacity-80 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 transform hover:scale-105 border ${categoryStyle.badge.split(' ').pop()}`}
                          >
                            View Full Results
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Spacer for the other side */}
                    <div className="lg:w-1/2 hidden lg:block"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal */}
        {selectedPoll && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-warm-white rounded-2xl shadow-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className={`${getCategoryStyle(selectedPoll.category).bg} p-6 border-b border-gray-200`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getCategoryStyle(selectedPoll.category).icon}</span>
                    <div>
                      <h3 className={`text-xl font-bold ${getCategoryStyle(selectedPoll.category).text}`}>{selectedPoll.question}</h3>
                      <p className="text-slate-gray text-sm mt-1">
                        {selectedPoll.user_vote ? `Your vote: ${selectedPoll.user_vote.text}` : 'No vote cast'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPoll(null)}
                    className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="space-y-4">
                  {selectedPoll.options.map((option) => {
                    const isUserVote = selectedPoll.user_vote?.id === option.id;
                    return (
                      <div key={option.id} className={`p-4 rounded-xl border-2 ${isUserVote ? 'border-forest-green bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center flex-1">
                            <span className="font-medium text-charcoal">{option.text}</span>
                            {isUserVote && (
                              <span className="ml-3 px-2 py-1 bg-green-100 text-forest-green text-xs rounded-full border border-green-200">
                                ✓ Your Vote
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-slate-gray font-medium">
                            {option.votes} vote{option.votes !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-3 bg-light-gray rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${isUserVote ? 'bg-forest-green' : 'bg-jordy-blue'}`}
                              style={{ width: `${option.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-slate-gray w-12 text-right">
                            {option.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;