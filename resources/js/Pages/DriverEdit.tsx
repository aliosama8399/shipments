import React, { useState } from 'react';
import { useForm, Link, router } from '@inertiajs/react';

interface Driver {
    id: number;
    name: string;
    email: string;
    license_number: string;
    image: string | null;
    address: string | null;
}

interface Props {
    driver: Driver;
}

export default function DriverEdit({ driver }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(
        driver.image ? `/storage/${driver.image}` : null
    );

    const { data, setData, post, errors, processing } = useForm({
        _method: 'PUT',
        name: driver.name,
        email: driver.email,
        license_number: driver.license_number,
        address: driver.address || '',
        image: null as File | null,
        password: '',
        password_confirmation: '',
    });

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setData('image', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('driver.update', driver.id));
    }

    function handleDelete() {
        router.delete(route('driver.destroy', driver.id));
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Edit Driver</h1>
                        <Link
                            href={route('drivers.index')}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Drivers
                        </Link>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Profile Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Image
                            </label>
                            <div className="flex items-center gap-6">
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Profile preview"
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                    />
                                )}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Leave empty to keep current image
                                    </p>
                                </div>
                            </div>
                            {errors.image && <span className="text-red-600 text-sm mt-1 block">{errors.image}</span>}
                        </div>

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.name && <span className="text-red-600 text-sm mt-1 block">{errors.name}</span>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.email && <span className="text-red-600 text-sm mt-1 block">{errors.email}</span>}
                        </div>

                        {/* License Number */}
                        <div>
                            <label htmlFor="license_number" className="block text-sm font-medium text-gray-700">
                                License Number
                            </label>
                            <input
                                id="license_number"
                                type="text"
                                value={data.license_number}
                                onChange={(e) => setData('license_number', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.license_number && <span className="text-red-600 text-sm mt-1 block">{errors.license_number}</span>}
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <textarea
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.address && <span className="text-red-600 text-sm mt-1 block">{errors.address}</span>}
                        </div>

                        {/* Password Section */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password (Optional)</h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Leave empty to keep current password"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.password && <span className="text-red-600 text-sm mt-1 block">{errors.password}</span>}
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                        Confirm New Password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                            >
                                Delete Driver
                            </button>

                            <div className="flex gap-3">
                                <Link
                                    href={route('drivers.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Driver</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{driver.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
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
