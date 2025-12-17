import React from 'react';
import { Link } from '@inertiajs/react';
import AdminHeader from '../../Components/AdminHeader';

interface Stats {
    totalShipments: number;
    activeShipments: number;
    deliveredToday: number;
    totalDrivers: number;
}

interface Shipment {
    id: number;
    tracking_number: string;
    status: string;
    receiver_name: string;
    driver?: { name: string } | null;
    created_at: string;
}

interface Props {
    stats: Stats;
    recentShipments: Shipment[];
}

export default function Dashboard({ stats, recentShipments }: Props) {
    const statCards = [
        { label: 'Total Shipments', value: stats.totalShipments, color: 'bg-blue-500' },
        { label: 'Active Shipments', value: stats.activeShipments, color: 'bg-green-500' },
        { label: 'Delivered Today', value: stats.deliveredToday, color: 'bg-purple-500' },
        { label: 'Total Drivers', value: stats.totalDrivers, color: 'bg-orange-500' },
    ];

    const statusColors: Record<string, string> = {
        CREATED: 'bg-gray-100 text-gray-800',
        PICKED_UP: 'bg-blue-100 text-blue-800',
        IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
        OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
        DELIVERED: 'bg-green-100 text-green-800',
        FAILED: 'bg-red-100 text-red-800',
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <Link
                        href={route('admin.shipments.create')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        + Create Shipment
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat) => (
                        <div key={stat.label} className="bg-white rounded-lg shadow p-6">
                            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                                <span className="text-white text-xl font-bold">{stat.value}</span>
                            </div>
                            <p className="text-gray-600 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Shipments */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Shipments</h2>
                        <Link
                            href={route('admin.shipments.index')}
                            className="text-indigo-600 hover:text-indigo-500 text-sm"
                        >
                            View All →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiver</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentShipments.map((shipment) => (
                                    <tr key={shipment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {shipment.tracking_number}
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
                                            {shipment.driver?.name || '—'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Link
                                                href={route('admin.shipments.show', shipment.id)}
                                                className="text-indigo-600 hover:text-indigo-500"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {recentShipments.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No shipments yet. Create your first shipment!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
