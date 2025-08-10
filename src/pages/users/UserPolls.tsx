import React, { useState } from 'react';
import { useGetUserPollsQuery, useDeleteUserPollMutation, useUpdateUserPollMutation } from '../../api/pollsApi';
import type { Poll, PollCreateData } from '../../types/PollsTypes';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Assuming react-toastify is installed

const UserPolls: React.FC = () => {
  const { data: polls = [], isLoading, error } = useGetUserPollsQuery();
  const [deleteUserPoll] = useDeleteUserPollMutation();
  const [updateUserPoll] = useUpdateUserPollMutation();
  const navigate = useNavigate();

  const [editPollId, setEditPollId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<PollCreateData>({ question: '', category: 'TECH', options: [] });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      try {
        await deleteUserPoll(id).unwrap();
        toast.success('Poll deleted!', { position: 'top-center', autoClose: 2000 });
      } catch (err) {
        console.error('Failed to delete poll:', err);
        toast.error('Failed to delete poll', { position: 'top-center', autoClose: 2000 });
      }
    }
  };

  const handleEdit = (poll: Poll) => {
    setEditPollId(poll.id);
    setEditForm({
      question: poll.question,
      category: poll.category,
      options: poll.options.map(opt => opt.text),
    });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await updateUserPoll({ id, data: editForm }).unwrap();
      toast.success('Poll updated!', { position: 'top-center', autoClose: 2000 });
      setEditPollId(null);
    } catch (err) {
      console.error('Failed to update poll:', err);
      toast.error('Failed to update poll', { position: 'top-center', autoClose: 2000 });
    }
  };

  const handleCancelEdit = () => {
    setEditPollId(null);
    setEditForm({ question: '', category: 'TECH', options: [] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'options') {
      setEditForm(prev => ({ ...prev, options: value.split(',').map(opt => opt.trim()) }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

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

  if (isLoading) return <div className="text-slate-gray text-center py-4 animate-pulse">Loading your polls...</div>;
  if (error) return <div className="text-error text-center py-4">Error loading polls: {error.toString()}</div>;
  if (!polls.length) return <div className="text-slate-gray text-center py-4">No polls found—create your first one!</div>;

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <h2 className="text-3xl font-extrabold text-charcoal mb-6 text-center">
        Your Polls Showcase
      </h2>
      <div className="grid gap-6">
        {polls.map((poll: Poll) => {
          const categoryStyle = getCategoryStyle(poll.category);
          return (
            <div
              key={poll.id}
              className="bg-warm-white rounded-2xl shadow-medium hover:shadow-strong transition-all duration-500 border border-light-gray hover:border-jordy-blue hover:-translate-y-1 animate-fade-in"
            >
              {editPollId === poll.id ? (
                <div className="p-6 space-y-4">
                  <input
                    type="text"
                    name="question"
                    value={editForm.question}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-light-gray rounded-lg focus:ring-2 focus:ring-jordy-blue focus:ring-opacity-50 focus:border-jordy-blue transition-all"
                    placeholder="Enter your question"
                  />
                  <input
                    type="text"
                    name="options"
                    value={editForm.options.join(', ')}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-light-gray rounded-lg focus:ring-2 focus:ring-jordy-blue focus:ring-opacity-50 focus:border-jordy-blue transition-all"
                    placeholder="Options (e.g., Yes, No, Maybe)"
                  />
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleSaveEdit(poll.id)}
                      className="w-full bg-forest-green text-white px-4 py-2 rounded-lg hover:bg-emerald-green transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="w-full bg-light-gray text-charcoal px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Cancel Edit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className={`${categoryStyle.bg} p-4 rounded-lg mb-4 flex items-center justify-between border ${categoryStyle.badge.split(' ').pop()}`}>
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{categoryStyle.icon}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryStyle.badge}`}>
                        {poll.category}
                      </span>
                    </div>
                    <span className="text-sm text-slate-gray">{new Date(poll.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${categoryStyle.text}`}>{poll.question}</h3>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => handleEdit(poll)}
                      className="w-full bg-jordy-blue text-white px-4 py-2 rounded-lg hover:bg-deep-sky-blue transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Edit Poll
                    </button>
                    <button
                      onClick={() => handleDelete(poll.id)}
                      className="w-full bg-error text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Delete Poll
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserPolls;