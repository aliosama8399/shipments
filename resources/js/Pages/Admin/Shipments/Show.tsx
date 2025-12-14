import React from 'react';
import { Link, router } from '@inertiajs/react';

interface Driver {
    id: number;
    name: string;
}

interface Parcel {
    id: number;
    weight: number;
    dimensions: string | null;
    fragile: boolean;
    barcode: string;
}

interface StatusHistory {
    id: number;
    status: string;
    changed_by_type: string;
    notes: string | null;
    created_at: string;
}

interface Shipment {
    id: number;
    tracking_number: string;
    status: string;
    sender_name: string;
    sender_phone: string;
    sender_address: string;
    receiver_name: string;
    receiver_phone: string;
    receiver_address: string;
    estimated_delivery_time: string | null;
    driver?: Driver | null;
    parcels: Parcel[];
    status_histories: StatusHistory[];
}

interface Props {
    shipment: Shipment;
    timeline: StatusHistory[];
    drivers: Driver[];
    allowedStatuses: string[];
}

export default function ShowShipment({ shipment, timeline, drivers }: Props) {
    const [selectedDriverId, setSelectedDriverId] = React.useState(shipment.driver?.id?.toString() || '');

    const statusColors: Record<string, string> = {
        CREATED: 'bg-gray-100 text-gray-800 border-gray-300',
        PICKED_UP: 'bg-blue-100 text-blue-800 border-blue-300',
        IN_TRANSIT: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800 border-purple-300',
        DELIVERED: 'bg-green-100 text-green-800 border-green-300',
        FAILED: 'bg-red-100 text-red-800 border-red-300',
    };

    function handleAssignDriver() {
        router.post(route('admin.shipments.assign', shipment.id), {
            driver_id: selectedDriverId || null,
        });
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href={route('admin.shipments.index')} className="text-gray-500 hover:text-gray-700 text-sm">
                            ← Back to Shipments
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 mt-2">{shipment.tracking_number}</h1>
                        <span className={`mt-2 inline-block px-3 py-1 text-sm font-medium rounded-full border ${statusColors[shipment.status]}`}>
                            {shipment.status}
                        </span>
                    </div>
                    <Link
                        href={route('admin.shipments.edit', shipment.id)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                        Edit Shipment
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Sender & Receiver */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Sender</h3>
                                    <p className="text-lg font-semibold text-gray-900">{shipment.sender_name}</p>
                                    <p className="text-gray-600">{shipment.sender_phone}</p>
                                    <p className="text-gray-600 text-sm mt-2">{shipment.sender_address}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Receiver</h3>
                                    <p className="text-lg font-semibold text-gray-900">{shipment.receiver_name}</p>
                                    <p className="text-gray-600">{shipment.receiver_phone}</p>
                                    <p className="text-gray-600 text-sm mt-2">{shipment.receiver_address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Parcels */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Parcels ({shipment.parcels.length})</h3>
                                <Link
                                    href={route('admin.shipments.parcels.create', shipment.id)}
                                    className="text-indigo-600 hover:text-indigo-500 text-sm"
                                >
                                    + Add Parcel
                                </Link>
                            </div>
                            {shipment.parcels.length > 0 ? (
                                <div className="space-y-3">
                                    {shipment.parcels.map((parcel) => (
                                        <div key={parcel.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <span className="font-mono text-sm text-gray-600">{parcel.barcode}</span>
                                                <div className="text-sm text-gray-500">
                                                    {parcel.weight} kg {parcel.dimensions && `• ${parcel.dimensions}`}
                                                    {parcel.fragile && <span className="text-orange-600 ml-2">⚠ Fragile</span>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link href={route('admin.parcels.edit', parcel.id)} className="text-gray-500 hover:text-gray-700 text-sm">
                                                    Edit
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No parcels added yet.</p>
                            )}
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                            <div className="space-y-4">
                                {timeline.map((entry, index) => (
                                    <div key={entry.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                                            {index < timeline.length - 1 && <div className="w-0.5 h-full bg-gray-200" />}
                                        </div>
                                        <div className="pb-4">
                                            <p className="font-medium text-gray-900">{entry.status}</p>
                                            {entry.notes && <p className="text-gray-600 text-sm">{entry.notes}</p>}
                                            <p className="text-gray-400 text-xs mt-1">
                                                {new Date(entry.created_at).toLocaleString()} by {entry.changed_by_type}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Driver Assignment */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Assignment</h3>
                            <select
                                value={selectedDriverId}
                                onChange={(e) => setSelectedDriverId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-3"
                            >
                                <option value="">-- Unassigned --</option>
                                {drivers.map((driver) => (
                                    <option key={driver.id} value={driver.id}>{driver.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleAssignDriver}
                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                Update Assignment
                            </button>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Info</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-500">Estimated Delivery:</span>
                                    <p className="font-medium">
                                        {shipment.estimated_delivery_time
                                            ? new Date(shipment.estimated_delivery_time).toLocaleString()
                                            : 'Not set'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Current Driver:</span>
                                    <p className="font-medium">{shipment.driver?.name || 'Unassigned'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
