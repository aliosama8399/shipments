import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DriverHeader from '../../Components/DriverHeader';

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
    notes: string | null;
    created_at: string;
}

interface Driver {
    id: number;
    name: string;
}

interface Shipment {
    id: number;
    tracking_number: string;
    status: string;
    receiver_name: string;
    receiver_phone: string;
    receiver_address: string;
    sender_name: string;
    sender_address: string;
    parcels: Parcel[];
    status_histories: StatusHistory[];
}

interface Props {
    shipment: Shipment;
    timeline: StatusHistory[];
    allowedStatuses: string[];
    currentDriver?: Driver | null;
}

export default function ShipmentDetail({ shipment, timeline, allowedStatuses, currentDriver }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        status: '',
        notes: '',
    });

    const statusFlow = ['CREATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statusFlow.indexOf(shipment.status);

    const statusLabels: Record<string, string> = {
        PICKED_UP: 'Mark as Picked Up',
        IN_TRANSIT: 'Start Transit',
        OUT_FOR_DELIVERY: 'Out for Delivery',
        DELIVERED: 'Mark as Delivered',
        FAILED: 'Mark as Failed',
    };

    function handleStatusUpdate(newStatus: string) {
        setData('status', newStatus);
        patch(route('driver.shipments.updateStatus', shipment.id), {
            data: { status: newStatus, notes: data.notes },
        });
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DriverHeader driverName={currentDriver?.name} driverId={currentDriver?.id} />
            <div className="max-w-2xl mx-auto py-8 px-4">
                <Link href={route('driver.shipments.index')} className="text-gray-500 hover:text-gray-700 text-sm">
                    ← Back to My Shipments
                </Link>

                <div className="mt-4 bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="font-mono text-lg text-indigo-600">{shipment.tracking_number}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{shipment.receiver_name}</p>
                        </div>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 font-medium rounded-full">
                            {shipment.status.replace(/_/g, ' ')}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            {statusFlow.map((status, index) => (
                                <div
                                    key={status}
                                    className={`text-xs font-medium ${index <= currentIndex ? 'text-indigo-600' : 'text-gray-400'}`}
                                >
                                    {status.replace(/_/g, ' ')}
                                </div>
                            ))}
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-2 bg-indigo-600 rounded-full transition-all"
                                style={{ width: `${((currentIndex + 1) / statusFlow.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="space-y-4 mb-8">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Deliver To</h3>
                            <p className="font-semibold text-gray-900">{shipment.receiver_name}</p>
                            <p className="text-gray-600">{shipment.receiver_phone}</p>
                            <p className="text-gray-600 text-sm mt-1">{shipment.receiver_address}</p>
                        </div>

                        {/* Parcels */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                                Parcels ({shipment.parcels.length})
                            </h3>
                            <div className="space-y-2">
                                {shipment.parcels.map((parcel) => (
                                    <div key={parcel.id} className="flex justify-between text-sm">
                                        <span className="font-mono text-gray-600">{parcel.barcode}</span>
                                        <span>
                                            {parcel.weight}kg
                                            {parcel.fragile && <span className="text-orange-600 ml-2">⚠️ Fragile</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Status Update Actions */}
                    {allowedStatuses.length > 0 && (
                        <div className="border-t pt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Update Status</h3>
                            <div className="mb-4">
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Add notes (optional)..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    rows={2}
                                />
                            </div>
                            {errors.status && <p className="text-red-500 text-sm mb-2">{errors.status}</p>}
                            <div className="flex flex-wrap gap-2">
                                {allowedStatuses.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(status)}
                                        disabled={processing}
                                        className={`px-4 py-2 rounded-lg font-medium transition ${status === 'FAILED'
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            } disabled:opacity-50`}
                                    >
                                        {statusLabels[status] || status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="border-t pt-6 mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">History</h3>
                        <div className="space-y-3">
                            {timeline.map((entry) => (
                                <div key={entry.id} className="flex gap-3 text-sm">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full mt-1.5" />
                                    <div>
                                        <span className="font-medium text-gray-900">{entry.status}</span>
                                        {entry.notes && <p className="text-gray-500">{entry.notes}</p>}
                                        <p className="text-gray-400 text-xs">{new Date(entry.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
