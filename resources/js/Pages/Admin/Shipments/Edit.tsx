import React from 'react';
import { useForm, Link } from '@inertiajs/react';

interface Driver {
    id: number;
    name: string;
}

interface Shipment {
    id: number;
    tracking_number: string;
    sender_name: string;
    sender_phone: string;
    sender_address: string;
    receiver_name: string;
    receiver_phone: string;
    receiver_address: string;
    estimated_delivery_time: string | null;
}

interface Props {
    shipment: Shipment;
    drivers: Driver[];
}

export default function EditShipment({ shipment, drivers }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        sender_name: shipment.sender_name,
        sender_phone: shipment.sender_phone,
        sender_address: shipment.sender_address,
        receiver_name: shipment.receiver_name,
        receiver_phone: shipment.receiver_phone,
        receiver_address: shipment.receiver_address,
        estimated_delivery_time: shipment.estimated_delivery_time || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('admin.shipments.update', shipment.id));
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href={route('admin.shipments.show', shipment.id)} className="text-gray-500 hover:text-gray-700 text-sm">
                            ← Back to Shipment
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit {shipment.tracking_number}</h1>
                    </div>
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                rows={2}
                                required
                            />
                            {errors.receiver_address && <p className="text-red-500 text-sm mt-1">{errors.receiver_address}</p>}
                        </div>
                    </div>

                    {/* Delivery Time */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Delivery</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Time</label>
                            <input
                                type="datetime-local"
                                value={data.estimated_delivery_time}
                                onChange={(e) => setData('estimated_delivery_time', e.target.value)}
                                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Link href={route('admin.shipments.show', shipment.id)} className="px-4 py-2 text-gray-600 hover:text-gray-900">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
