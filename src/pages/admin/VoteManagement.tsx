import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaTrash, FaTimes } from 'react-icons/fa';
import {
    useGetVotesQuery,
    useDeleteVoteMutation
} from '../../api/adminApi'; 
// import { Vote } from '../types/AdminType';

const VoteManagement = () => {
    // Hooks for fetching and mutating data
    const { data: votes = [], error, isLoading } = useGetVotesQuery();
    const [deleteVote] = useDeleteVoteMutation();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [voteToDelete, setVoteToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setVoteToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (voteToDelete !== null) {
            await deleteVote(voteToDelete);
            setShowDeleteModal(false);
            setVoteToDelete(null);
        }
    };

    if (isLoading) {
        return <div className="text-dark-text text-center py-10">Loading votes...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">Error fetching votes.</div>;
    }

    return (
        <div className="p-8 bg-charcoal rounded-3xl shadow-xl border border-light-gray/10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Votes Overview</h2>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-light-gray/10">
                <table className="min-w-full divide-y divide-light-gray/10">
                    <thead className="bg-dark-bg/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider">
                                User
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider">
                                Poll Question
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider">
                                Voted Option
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider">
                                Timestamp
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-dark-text uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-charcoal divide-y divide-light-gray/10">
                        {votes.map((vote) => (
                            <tr key={vote.id} className="hover:bg-dark-bg/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                    {vote.user || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-normal text-sm text-dark-text">
                                    {vote.poll || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-normal text-sm text-dark-text">
                                    {vote.option || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                                    {vote.created_at ? new Date(vote.created_at).toLocaleString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleDeleteClick(vote.id)}
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
                                        Delete Vote
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-dark-text/70">
                                            Are you sure you want to delete this vote? This action cannot be undone.
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

export default VoteManagement;
