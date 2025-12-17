import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DriverHeader from '../../Components/DriverHeader';

interface Driver {
    id: number;
    name: string;
    email: string;
    address: string | null;
    image: string | null;
}

interface Props {
    driver: Driver;
    currentDriver: Driver;
}

export default function ProfileEdit({ driver, currentDriver }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: driver.name,
        email: driver.email,
        address: driver.address || '',
        image: null as File | null,
        password: '',
        password_confirmation: '',
        _method: 'PUT',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('driver.profile.update'));
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DriverHeader driverName={currentDriver?.name} driverId={currentDriver?.id} />
            <div className="max-w-xl mx-auto py-8 px-4">
                <Link href={route('driver.dashboard')} className="text-gray-500 hover:text-gray-700 text-sm">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-8">Edit Profile</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                    {/* Profile Image */}
                    <div className="flex items-center gap-4">
                        {driver.image ? (
                            <img
                                src={`/storage/${driver.image}`}
                                alt={driver.name}
                                className="w-20 h-20 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-2xl text-gray-400">👤</span>
                            </div>
                        )}
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                className="text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            rows={2}
                        />
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Change Password (optional)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="New password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Link href={route('driver.dashboard')} className="px-4 py-2 text-gray-600 hover:text-gray-900">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
