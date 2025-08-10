// src/pages/users/PollCreate.tsx
import React, { useState } from 'react';
import { useCreatePollMutation } from '../../api/pollsApi';
import { useNavigate } from 'react-router-dom';
import type { PollCreateData } from '../../types/PollsTypes';

const PollCreate = () => {
    const [createPoll, { isLoading, isError, error }] = useCreatePollMutation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<PollCreateData>({
        question: '',
        category: '',
        expiry_date: null,
        options: ['', ''],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === 'null' ? null : value,
        }));
    };

    const handleOptionChange = (index: number, value: string) => {
        setFormData(prev => {
            const newOptions = [...prev.options];
            newOptions[index] = value;
            return { ...prev, options: newOptions };
        });
    };

    const addOption = () => {
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, ''],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createPoll(formData).unwrap();
            navigate('/explore');
        } catch (err) {
            console.error('Failed to create poll:', err);
        }
    };

    const categories = [
        'TECH', 'ENT', 'SPRT', 'POL', 'LIFE', 'EDU',
    ]; // Example categories; replace with dynamic data from useGetCategoriesQuery if needed

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
            <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/50">
                    <h2 className="text-3xl font-extrabold text-charcoal mb-6 text-center">Create a New Poll</h2>
                    <p className="text-charcoal/60 text-center mb-8">Share your question with the community</p>

                    {isError && (
                        <div className="bg-coral-red/10 border border-coral-red/20 rounded-lg p-4 mb-6 text-center">
                            <p className="text-coral-red font-medium">Error: {error ? (error as any).data?.detail || 'Failed to create poll' : 'Unknown error'}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Question */}
                        <div>
                            <label htmlFor="question" className="block text-sm font-medium text-charcoal mb-2">
                                Poll Question
                            </label>
                            <input
                                type="text"
                                id="question"
                                name="question"
                                value={formData.question}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-jordy-blue focus:border-jordy-blue transition-colors"
                                placeholder="Enter your poll question"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-charcoal mb-2">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-jordy-blue focus:border-jordy-blue transition-colors appearance-none bg-white"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <label htmlFor="expiry_date" className="block text-sm font-medium text-charcoal mb-2">
                                Expiry Date (Optional)
                            </label>
                            <input
                                type="date"
                                id="expiry_date"
                                name="expiry_date"
                                value={formData.expiry_date || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-jordy-blue focus:border-jordy-blue transition-colors"
                            />
                        </div>

                        {/* Options */}
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">
                                Poll Options
                            </label>
                            {formData.options.map((option, index) => (
                                <div key={index} className="flex items-center mb-4">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        required={index < 2} // First two options are required
                                        className="w-full px-4 py-2 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-jordy-blue focus:border-jordy-blue transition-colors"
                                        placeholder={`Option ${index + 1}`}
                                    />
                                    {index >= 2 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    options: prev.options.filter((_, i) => i !== index),
                                                }));
                                            }}
                                            className="ml-2 text-coral-red hover:text-coral-red/80 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addOption}
                                className="w-full py-2 bg-jordy-blue/10 text-jordy-blue rounded-lg hover:bg-jordy-blue/20 transition-colors"
                            >
                                Add Option
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-jordy-blue to-light-sky-blue text-white rounded-lg hover:from-jordy-blue/90 hover:to-light-sky-blue/90 focus:ring-2 focus:ring-jordy-blue/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating...' : 'Create Poll'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PollCreate;