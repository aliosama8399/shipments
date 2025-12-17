import React from 'react';
import { Link } from '@inertiajs/react';
import DriverHeader from '../../Components/DriverHeader';

interface Driver {
    id: number;
    name: string;
}

interface Props {
    currentDriver: Driver;
}

export default function DriverDashboard({ currentDriver }: Props) {
    return (
        <div className="min-h-screen bg-gray-100">
            <DriverHeader driverName={currentDriver?.name} driverId={currentDriver?.id} />
            <div className="max-w-4xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Welcome, {currentDriver.name}!
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* My Shipments Card */}
                    <Link
                        href={route('driver.shipments.index')}
                        className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📦</span>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-lg font-semibold text-gray-900">My Shipments</h2>
                                <p className="text-gray-500 text-sm">View and update your assigned deliveries</p>
                            </div>
                        </div>
                    </Link>

                    {/* Edit Profile Card */}
                    <Link
                        href={route('driver.profile.edit')}
                        className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">👤</span>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
                                <p className="text-gray-500 text-sm">Update your name, email, and photo</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
