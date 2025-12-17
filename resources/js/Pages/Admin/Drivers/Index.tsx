import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminHeader from '../../../Components/AdminHeader';

interface Driver {
    id: number;
    name: string;
    email: string;
    license_number: string;
    image: string | null;
    created_at: string;
}

interface Props {
    drivers: Driver[];
}

export default function DriversIndex({ drivers }: Props) {
    const [deleteModal, setDeleteModal] = useState<Driver | null>(null);

    function handleDelete(driver: Driver) {
        router.delete(route('admin.drivers.destroy', driver.id), {
            onSuccess: () => setDeleteModal(null),
        });
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader />
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
                    <Link
                        href={route('admin.drivers.create')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        + Register Driver
                    </Link>
                </div>

                {drivers.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500">No drivers registered yet.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {drivers.map((driver) => (
                                    <tr key={driver.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {driver.image ? (
                                                    <img
                                                        src={`/storage/${driver.image}`}
                                                        alt={driver.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <span className="text-gray-400">👤</span>
                                                    </div>
                                                )}
                                                <span className="ml-3 font-medium text-gray-900">{driver.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{driver.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{driver.license_number}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(driver.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm space-x-2">
                                            <Link
                                                href={route('admin.drivers.edit', driver.id)}
                                                className="text-indigo-600 hover:text-indigo-800"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => setDeleteModal(driver)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Driver</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{deleteModal.name}</strong>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteModal(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteModal)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
