// src/pages/users/PollDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetPollQuery,
  useVoteMutation,
  useRetractVoteMutation,
} from "../../api/pollsApi";
import type { Poll, VoteData } from "../../types/PollsTypes";
import { useAuth } from "../../context/authContext";

const PollDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: poll, isLoading, error } = useGetPollQuery(Number(id));
  const [castVote] = useVoteMutation();
  const [retractVote] = useRetractVoteMutation();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVoting, setIsVoting] = useState(false);

  // Update current time every minute for accurate countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const calculateTimeRemaining = (expiryDate: string | null) => {
    if (!expiryDate)
      return { text: "No expiration", color: "text-charcoal/70" };

    const expiry = new Date(expiryDate);
    const now = currentTime;
    const timeDiff = expiry.getTime() - now.getTime();

    if (timeDiff <= 0) return { text: "Expired", color: "text-red-600" };

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    let timeText = "";
    let colorClass = "";

    if (days > 0) {
      timeText = `${days} day${days > 1 ? "s" : ""} ${hours}h remaining`;
      colorClass = "text-green-600";
    } else if (hours > 0) {
      timeText = `${hours}h ${minutes}m remaining`;
      colorClass = hours <= 24 ? "text-amber-600" : "text-green-600";
    } else {
      timeText = `${minutes}m remaining`;
      colorClass = "text-red-600";
    }

    return { text: timeText, color: colorClass };
  };

  const handleVote = async () => {
    if (!isAuthenticated || !id || selectedOption === null) return;

    setIsVoting(true);
    try {
      await castVote({
        pollId: Number(id),
        voteData: { option: selectedOption },
      }).unwrap();
      setSelectedOption(null);
      setVoteError(null);
    } catch (err) {
      setVoteError("Failed to cast vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const handleRetractVote = async () => {
    if (!isAuthenticated || !id) return;

    setIsVoting(true);
    try {
      await retractVote(Number(id)).unwrap();
      setVoteError(null);
    } catch (err) {
      setVoteError("Failed to retract vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading poll details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium text-lg">
              Error loading poll
            </p>
            <p className="text-gray-600 text-sm mt-2">{error.toString()}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Poll Not Found
            </h2>
            <p className="text-gray-600">
              The poll you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userHasVoted = poll.user_vote !== null;
  const isExpired = poll.expiry_date && new Date(poll.expiry_date) < new Date();
  const timeRemaining = calculateTimeRemaining(poll.expiry_date);
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-6 group"
          >
            <svg
              className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Polls
          </button>
        </div>

        {/* Main Poll Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {/* Poll Header */}
          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-8 border-b border-gray-100/50">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
                  {poll.question}
                </h1>

                {/* Poll Metadata */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                    <span className="font-medium">By {poll.creator}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mr-3"></div>
                    <span className="font-medium">{poll.category}</span>
                  </div>
                  <div className={`flex items-center ${timeRemaining.color}`}>
                    <div className="w-2 h-2 rounded-full bg-current mr-3"></div>
                    <span className="font-medium">{timeRemaining.text}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="font-medium">
                      {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  isExpired
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-green-50 text-green-600 border-green-200"
                }`}
              >
                {isExpired ? "🔒 Expired" : "✨ Active"}
              </div>
            </div>
          </div>

          {/* Voting Section */}
          <div className="p-8">
            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Please log in to vote on this poll
                </p>
              </div>
            )}

            {/* Poll Options */}
            <div className="space-y-4 mb-8">
              {poll.options.map((option, index) => (
                <div key={option.id} className="group">
                  <div
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedOption === option.id
                        ? "border-blue-500 bg-blue-50"
                        : poll.user_vote && poll.user_vote.id === option.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                    } ${!isAuthenticated || userHasVoted || isExpired ? "cursor-default" : "cursor-pointer"}`}
                    onClick={() => {
                      if (isAuthenticated && !userHasVoted && !isExpired) {
                        setSelectedOption(option.id);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center flex-1">
                        <input
                          type="radio"
                          id={`option-${option.id}`}
                          name="poll-option"
                          value={option.id}
                          checked={selectedOption === option.id}
                          onChange={() => setSelectedOption(option.id)}
                          disabled={
                            userHasVoted || isExpired || !isAuthenticated
                          }
                          className="w-4 h-4 text-blue-500 focus:ring-blue-500 focus:ring-2 border-gray-300 mr-4"
                        />
                        <label
                          htmlFor={`option-${option.id}`}
                          className="text-gray-800 font-medium flex-1 cursor-pointer"
                        >
                          {option.text}
                        </label>
                        {poll.user_vote && poll.user_vote.id === option.id && (
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium border border-green-200 ml-3">
                            <span className="mr-1">✓</span>Your Vote
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 font-medium ml-4">
                        {option.percentage}% ({option.votes})
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out ${
                          poll.user_vote && poll.user_vote.id === option.id
                            ? "bg-gradient-to-r from-green-500 to-green-400"
                            : `bg-gradient-to-r ${
                                index % 4 === 0
                                  ? "from-blue-500 to-blue-400"
                                  : index % 4 === 1
                                    ? "from-indigo-500 to-indigo-400"
                                    : index % 4 === 2
                                      ? "from-purple-500 to-purple-400"
                                      : "from-pink-500 to-pink-400"
                              }`
                        }`}
                        style={{
                          width: `${option.percentage}%`,
                          transitionDelay: `${index * 100}ms`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Error Message */}
            {voteError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {voteError}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {!userHasVoted && !isExpired && isAuthenticated && (
                <button
                  onClick={handleVote}
                  disabled={selectedOption === null || isVoting}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isVoting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Casting Vote...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Cast Vote
                    </>
                  )}
                </button>
              )}

              {userHasVoted && !isExpired && isAuthenticated && (
                <button
                  onClick={handleRetractVote}
                  disabled={isVoting}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-4 focus:ring-red-200 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVoting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Retracting...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Retract Vote
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollDetail;