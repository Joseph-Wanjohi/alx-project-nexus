import React, { useState, useEffect } from 'react';
import {
    useGetAdminPollsQuery,
    useCreateAdminPollMutation,
    useUpdateAdminPollMutation,
    useDeleteAdminPollMutation,
} from '../../api/adminApi'; // Assuming adminApi.ts is in the same directory
import { useGetCategoriesQuery } from '../../api/pollsApi'; // Assuming pollsApi.ts is also available
import type { AdminPoll, AdminPollCreateData } from '../../types/AdminType'; // Use the types we just created
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FaTrash, FaEdit, FaPlus, FaTimes, FaSave } from 'react-icons/fa';

// This component is a full-featured management page for polls.
const PollManagement = () => {
    // Hooks for fetching and mutating data
    const { data: polls = [], error, isLoading } = useGetAdminPollsQuery();
    const [createPoll] = useCreateAdminPollMutation();
    const [updatePoll] = useUpdateAdminPollMutation();
    const [deletePoll] = useDeleteAdminPollMutation();
    const { data: categories = [] } = useGetCategoriesQuery();

    // State for modal and form data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPoll, setCurrentPoll] = useState<AdminPoll | null>(null);
    const [formData, setFormData] = useState<AdminPollCreateData>({
        question: '',
        category: '',
        expiry_date: '',
        creator: 1, // Assuming admin user has ID 1 for now
        options: [{ text: '' }, { text: '' }],
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pollToDelete, setPollToDelete] = useState<number | null>(null);

    // Effect to reset form data when modal closes
    useEffect(() => {
        if (!isModalOpen) {
            setFormData({
                question: '',
                category: '',
                expiry_date: '',
                creator: 1,
                options: [{ text: '' }, { text: '' }],
            });
            setCurrentPoll(null);
            setIsEditing(false);
        }
    }, [isModalOpen]);

    // Handlers for opening modals
    const handleAddPoll = () => {
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEditPoll = (poll: AdminPoll) => {
        setIsEditing(true);
        setCurrentPoll(poll);
        setFormData({
            ...poll,
            options: poll.options.map(opt => ({ text: opt.text })),
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setPollToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (pollToDelete !== null) {
            await deletePoll(pollToDelete);
            setShowDeleteModal(false);
            setPollToDelete(null);
        }
    };
    
    // Handler for form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handler for option changes
    const handleOptionChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newOptions = [...formData.options];
        newOptions[index].text = e.target.value;
        setFormData({ ...formData, options: newOptions });
    };

    // Handler to add a new option field
    const addOption = () => {
        if (formData.options.length < 5) { // Limit to 5 options for now
            setFormData({ ...formData, options: [...formData.options, { text: '' }] });
        }
    };

    // Handler to remove an option field
    const removeOption = (index: number) => {
        if (formData.options.length > 2) {
            const newOptions = formData.options.filter((_, i) => i !== index);
            setFormData({ ...formData, options: newOptions });
        }
    };

    // Handler for form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentPoll) {
                await updatePoll({ id: currentPoll.id, data: formData }).unwrap();
            } else {
                await createPoll(formData).unwrap();
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to save the poll:', err);
        }
    };

    if (isLoading) {
        return <div className="text-dark-text text-center py-10">Loading polls...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">Error fetching polls.</div>;
    }

    return (
        <div className="p-8 bg-charcoal rounded-3xl shadow-xl border border-light-gray/10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Polls Overview</h2>
                <button
                    onClick={handleAddPoll}
                    className="flex items-center px-6 py-3 bg-jordy-blue text-white rounded-full font-semibold shadow-lg hover:bg-jordy-blue/80 transition-colors"
                >
                    <FaPlus className="mr-2" /> Add New Poll
                </button>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-light-gray/10">
                <table className="min-w-full divide-y divide-light-gray/10">
                    <thead className="bg-dark-bg/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider">
                                Question
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider">
                                Creator ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider">
                                Expiry Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-dark-text uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-charcoal divide-y divide-light-gray/10">
                        {polls.map((poll) => (
                            <tr key={poll.id} className="hover:bg-dark-bg/30 transition-colors">
                                <td className="px-6 py-4 whitespace-normal text-sm font-medium text-white">
                                    {poll.question}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                                    {poll.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                                    {poll.creator}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                                    {new Date(poll.expiry_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleEditPoll(poll)}
                                        className="text-jordy-blue hover:text-jordy-blue/80 transition-colors"
                                    >
                                        <FaEdit className="inline-block" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(poll.id)}
                                        className="text-coral-red hover:text-coral-red/80 transition-colors"
                                    >
                                        <FaTrash className="inline-block" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Poll Modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-70" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-charcoal/95 backdrop-blur-lg border border-light-gray/20 p-6 text-left align-middle shadow-2xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-white mb-4">
                                        {isEditing ? 'Edit Poll' : 'Add New Poll'}
                                    </Dialog.Title>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="question" className="block text-sm font-medium text-dark-text/70 mb-1">
                                                Question
                                            </label>
                                            <input
                                                type="text"
                                                id="question"
                                                name="question"
                                                value={formData.question}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 bg-dark-bg/50 border border-light-gray/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-jordy-blue transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-dark-text/70 mb-1">
                                                Category
                                            </label>
                                            <select
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 bg-dark-bg/50 border border-light-gray/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-jordy-blue transition-colors"
                                            >
                                                <option value="" disabled>Select a category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="expiry_date" className="block text-sm font-medium text-dark-text/70 mb-1">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="datetime-local"
                                                id="expiry_date"
                                                name="expiry_date"
                                                value={formData.expiry_date}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 bg-dark-bg/50 border border-light-gray/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-jordy-blue transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-dark-text/70 mb-1">
                                                Options
                                            </label>
                                            <div className="space-y-2">
                                                {formData.options.map((option, index) => (
                                                    <div key={index} className="flex items-center">
                                                        <input
                                                            type="text"
                                                            value={option.text}
                                                            onChange={(e) => handleOptionChange(index, e)}
                                                            placeholder={`Option ${index + 1}`}
                                                            required
                                                            className="flex-1 px-4 py-2 bg-dark-bg/50 border border-light-gray/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-jordy-blue transition-colors"
                                                        />
                                                        {formData.options.length > 2 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOption(index)}
                                                                className="ml-2 p-2 text-coral-red hover:text-coral-red/80 transition-colors"
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {formData.options.length < 5 && (
                                                <button
                                                    type="button"
                                                    onClick={addOption}
                                                    className="mt-2 flex items-center text-sm font-medium text-jordy-blue hover:text-jordy-blue/80 transition-colors"
                                                >
                                                    <FaPlus className="mr-1" /> Add Option
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex justify-end space-x-4 mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="px-6 py-3 bg-light-gray/20 text-dark-text rounded-full font-semibold hover:bg-light-gray/30 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex items-center px-6 py-3 bg-jordy-blue text-white rounded-full font-semibold shadow-lg hover:bg-jordy-blue/80 transition-colors"
                                            >
                                                <FaSave className="mr-2" /> {isEditing ? 'Save Changes' : 'Create Poll'}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            
            {/* Delete Confirmation Modal */}
            <Transition appear show={showDeleteModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteModal(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-70" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-charcoal/95 backdrop-blur-lg border border-light-gray/20 p-6 text-left align-middle shadow-2xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-white">
                                        Delete Poll
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-dark-text/70">
                                            Are you sure you want to delete this poll? This action cannot be undone.
                                        </p>
                                    </div>

                                    <div className="mt-4 flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-full border border-transparent bg-light-gray/20 px-4 py-2 text-sm font-medium text-dark-text/70 hover:bg-light-gray/30 focus:outline-none"
                                            onClick={() => setShowDeleteModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-full border border-transparent bg-coral-red px-4 py-2 text-sm font-medium text-white hover:bg-coral-red/80 focus:outline-none"
                                            onClick={confirmDelete}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default PollManagement;
