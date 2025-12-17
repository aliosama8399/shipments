import React from 'react';
import { Link } from '@inertiajs/react';
import DriverHeader from '../../Components/DriverHeader';

interface Parcel {
    id: number;
    weight: number;
    fragile: boolean;
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
    parcels: Parcel[];
}

interface Props {
    shipments: Shipment[];
    currentDriver?: Driver | null;
}

export default function DriverShipments({ shipments, currentDriver }: Props) {
    const statusColors: Record<string, string> = {
        CREATED: 'bg-gray-100 text-gray-800',
        PICKED_UP: 'bg-blue-100 text-blue-800',
        IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
        OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
        DELIVERED: 'bg-green-100 text-green-800',
        FAILED: 'bg-red-100 text-red-800',
    };

    const activeShipments = shipments.filter(s => !['DELIVERED', 'FAILED'].includes(s.status));
    const completedShipments = shipments.filter(s => ['DELIVERED', 'FAILED'].includes(s.status));

    return (
        <div className="min-h-screen bg-gray-100">
            <DriverHeader driverName={currentDriver?.name} driverId={currentDriver?.id} />
            <div className="max-w-3xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Shipments</h1>

                {/* Active Shipments */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Active Deliveries ({activeShipments.length})
                    </h2>
                    <div className="space-y-4">
                        {activeShipments.map((shipment) => (
                            <Link
                                key={shipment.id}
                                href={route('driver.shipments.show', shipment.id)}
                                className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-mono text-sm text-indigo-600">{shipment.tracking_number}</p>
                                        <p className="font-semibold text-gray-900 mt-1">{shipment.receiver_name}</p>
                                        <p className="text-sm text-gray-500">{shipment.receiver_address}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {shipment.parcels.length} parcel(s) • {shipment.receiver_phone}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[shipment.status]}`}>
                                        {shipment.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            </Link>
                        ))}
                        {activeShipments.length === 0 && (
                            <p className="text-center text-gray-500 py-8 bg-white rounded-lg">
                                No active shipments assigned to you.
                            </p>
                        )}
                    </div>
                </div>

                {/* Completed Shipments */}
                {completedShipments.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Completed ({completedShipments.length})
                        </h2>
                        <div className="space-y-2">
                            {completedShipments.slice(0, 5).map((shipment) => (
                                <Link
                                    key={shipment.id}
                                    href={route('driver.shipments.show', shipment.id)}
                                    className="block bg-white rounded-lg shadow-sm p-3 hover:shadow transition"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-mono text-sm text-gray-600">{shipment.tracking_number}</p>
                                            <p className="text-sm text-gray-500">{shipment.receiver_name}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[shipment.status]}`}>
                                            {shipment.status}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
