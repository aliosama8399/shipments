import React from 'react';
import { Link, router } from '@inertiajs/react';

interface Driver {
    id: number;
    name: string;
}

interface Shipment {
    id: number;
    tracking_number: string;
    status: string;
    sender_name: string;
    receiver_name: string;
    driver?: Driver | null;
    created_at: string;
}

interface Props {
    shipments: Shipment[];
}

export default function ShipmentsIndex({ shipments }: Props) {
    const statusColors: Record<string, string> = {
        CREATED: 'bg-gray-100 text-gray-800',
        PICKED_UP: 'bg-blue-100 text-blue-800',
        IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
        OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
        DELIVERED: 'bg-green-100 text-green-800',
        FAILED: 'bg-red-100 text-red-800',
    };

    function handleDelete(shipment: Shipment) {
        if (confirm(`Delete shipment ${shipment.tracking_number}?`)) {
            router.delete(route('admin.shipments.destroy', shipment.id));
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Shipments</h1>
                        <p className="text-gray-600 mt-1">{shipments.length} total shipments</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href={route('admin.dashboard')}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900"
                        >
                            ← Dashboard
                        </Link>
                        <Link
                            href={route('admin.shipments.create')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            + Create Shipment
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiver</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {shipments.map((shipment) => (
                                <tr key={shipment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-mono font-medium text-indigo-600">
                                            {shipment.tracking_number}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {shipment.sender_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {shipment.receiver_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[shipment.status] || 'bg-gray-100'}`}>
                                            {shipment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {shipment.driver?.name || <span className="text-gray-400">Unassigned</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                        <Link href={route('admin.shipments.show', shipment.id)} className="text-indigo-600 hover:text-indigo-500">
                                            View
                                        </Link>
                                        <Link href={route('admin.shipments.edit', shipment.id)} className="text-gray-600 hover:text-gray-500">
                                            Edit
                                        </Link>
                                        <button onClick={() => handleDelete(shipment)} className="text-red-600 hover:text-red-500">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {shipments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <p className="mb-4">No shipments found.</p>
                                        <Link
                                            href={route('admin.shipments.create')}
                                            className="text-indigo-600 hover:text-indigo-500"
                                        >
                                            Create your first shipment →
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
