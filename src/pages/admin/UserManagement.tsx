import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import {
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} from '../../api/adminApi'; 
import type { User, UserCreateData } from '../../types/AdminType';

const UserManagement = () => {
    // Hooks for fetching and mutating data
    const { data: users = [], error, isLoading } = useGetUsersQuery();
    const [createUser] = useCreateUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    // State for modals and form data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserCreateData>({
        username: '',
        email: '',
        password: '',
        roles: 'user',
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    // Effect to reset form when modal closes
    useEffect(() => {
        if (!isModalOpen) {
            setFormData({
                username: '',
                email: '',
                password: '',
                roles: 'user',
            });
            setCurrentUser(null);
            setIsEditing(false);
        }
    }, [isModalOpen]);

    const handleAddUser = () => {
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setIsEditing(true);
        setCurrentUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            roles: user.roles,
            password: '', // Do not pre-fill password for security
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setUserToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (userToDelete !== null) {
            await deleteUser(userToDelete);
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentUser) {
                await updateUser({ id: currentUser.id, data: { ...formData, password: formData.password || undefined } }).unwrap();
            } else {
                await createUser(formData).unwrap();
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to save the user:', err);
        }
    };

    if (isLoading) {
        return <div className="text-dark-text text-center py-10">Loading users...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">Error fetching users.</div>;
    }

    return (
        <div className="p-8 bg-charcoal rounded-3xl shadow-xl border border-light-gray/10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Users Overview</h2>
                <button
                    onClick={handleAddUser}
                    className="flex items-center px-6 py-3 bg-amber text-white rounded-full font-semibold shadow-lg hover:bg-amber/80 transition-colors"
                >
                    <FaPlus className="mr-2" /> Add New User
                </button>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-light-gray/10">
                <table className="min-w-full divide-y divide-light-gray/10">
                    <thead className="bg-dark-bg/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider">
                                Username
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-dark-text uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-charcoal divide-y divide-light-gray/10">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-dark-bg/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                    {user.username}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text capitalize">
                                    {user.roles}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-forest-green/20 text-forest-green' : 'bg-coral-red/20 text-coral-red'}`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleEditUser(user)}
                                        className="text-amber hover:text-amber/80 transition-colors"
                                    >
                                        <FaEdit className="inline-block" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(user.id)}
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

            {/* Add/Edit User Modal */}
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
                                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-charcoal/95 backdrop-blur-lg border border-light-gray/20 p-6 text-left align-middle shadow-2xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-white mb-4">
                                        {isEditing ? 'Edit User' : 'Add New User'}
                                    </Dialog.Title>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="username" className="block text-sm font-medium text-dark-text/70 mb-1">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 bg-dark-bg/50 border border-light-gray/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-dark-text/70 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 bg-dark-bg/50 border border-light-gray/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber transition-colors"
                                            />
                                        </div>
                                        {!isEditing && (
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-dark-text/70 mb-1">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 bg-dark-bg/50 border border-light-gray/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber transition-colors"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <label htmlFor="roles" className="block text-sm font-medium text-dark-text/70 mb-1">
                                                Role
                                            </label>
                                            <select
                                                id="roles"
                                                name="roles"
                                                value={formData.roles}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-dark-bg/50 border border-light-gray/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber transition-colors"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
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
                                                className="flex items-center px-6 py-3 bg-amber text-white rounded-full font-semibold shadow-lg hover:bg-amber/80 transition-colors"
                                            >
                                                <FaSave className="mr-2" /> {isEditing ? 'Save Changes' : 'Create User'}
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
                                        Delete User
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-dark-text/70">
                                            Are you sure you want to delete this user? This action cannot be undone.
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

export default UserManagement;
