import React from 'react';
import { useForm, Link } from '@inertiajs/react';

interface Driver {
    id: number;
    name: string;
}

interface Props {
    drivers: Driver[];
    statuses: string[];
}

export default function CreateShipment({ drivers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        sender_name: '',
        sender_phone: '',
        sender_address: '',
        receiver_name: '',
        receiver_phone: '',
        receiver_address: '',
        assigned_driver_id: '',
        estimated_delivery_time: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('admin.shipments.store'));
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create Shipment</h1>
                    <Link href={route('admin.shipments.index')} className="text-gray-600 hover:text-gray-900">
                        ← Back to List
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-8">
                    {/* Sender Info */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Sender Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={data.sender_name}
                                    onChange={(e) => setData('sender_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                                {errors.sender_name && <p className="text-red-500 text-sm mt-1">{errors.sender_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                <input
                                    type="tel"
                                    value={data.sender_phone}
                                    onChange={(e) => setData('sender_phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                                {errors.sender_phone && <p className="text-red-500 text-sm mt-1">{errors.sender_phone}</p>}
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                            <textarea
                                value={data.sender_address}
                                onChange={(e) => setData('sender_address', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                rows={2}
                                required
                            />
                            {errors.sender_address && <p className="text-red-500 text-sm mt-1">{errors.sender_address}</p>}
                        </div>
                    </div>

                    {/* Receiver Info */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Receiver Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={data.receiver_name}
                                    onChange={(e) => setData('receiver_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                                {errors.receiver_name && <p className="text-red-500 text-sm mt-1">{errors.receiver_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                <input
                                    type="tel"
                                    value={data.receiver_phone}
                                    onChange={(e) => setData('receiver_phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                                {errors.receiver_phone && <p className="text-red-500 text-sm mt-1">{errors.receiver_phone}</p>}
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                            <textarea
                                value={data.receiver_address}
                                onChange={(e) => setData('receiver_address', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                rows={2}
                                required
                            />
                            {errors.receiver_address && <p className="text-red-500 text-sm mt-1">{errors.receiver_address}</p>}
                        </div>
                    </div>

                    {/* Assignment */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Assignment</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Driver</label>
                                <select
                                    value={data.assigned_driver_id}
                                    onChange={(e) => setData('assigned_driver_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">-- Select Driver --</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.id} value={driver.id}>{driver.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
                                <input
                                    type="datetime-local"
                                    value={data.estimated_delivery_time}
                                    onChange={(e) => setData('estimated_delivery_time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Link href={route('admin.shipments.index')} className="px-4 py-2 text-gray-600 hover:text-gray-900">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                        >
                            {processing ? 'Creating...' : 'Create Shipment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
