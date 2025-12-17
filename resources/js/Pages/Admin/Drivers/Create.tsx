import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminHeader from '../../../Components/AdminHeader';

export default function DriverCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        license_number: '',
        address: '',
        image: null as File | null,
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('admin.drivers.store'));
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader />
            <div className="max-w-xl mx-auto py-8 px-4">
                <Link href={route('admin.drivers.index')} className="text-gray-500 hover:text-gray-700 text-sm">
                    ← Back to Drivers
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-8">Register New Driver</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                        <input
                            type="text"
                            value={data.license_number}
                            onChange={(e) => setData('license_number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        {errors.license_number && <p className="text-red-500 text-sm mt-1">{errors.license_number}</p>}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('image', e.target.files?.[0] || null)}
                            className="text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Used for face recognition login</p>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Password *</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Link href={route('admin.drivers.index')} className="px-4 py-2 text-gray-600">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? 'Registering...' : 'Register Driver'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
