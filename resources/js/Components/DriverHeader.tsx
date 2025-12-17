import React from 'react';
import { Link, router } from '@inertiajs/react';

interface Props {
    driverName?: string;
    driverId?: number;
}

export default function DriverHeader({ driverName, driverId }: Props) {
    function handleLogout() {
        router.get(route('driver.logout'));
    }

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-6">
                        <Link href={route('driver.dashboard')} className="text-xl font-bold text-indigo-600">
                            Shipments
                        </Link>
                        <nav className="hidden md:flex gap-4">
                            <Link
                                href={route('driver.dashboard')}
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={route('driver.shipments.index')}
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                            >
                                My Shipments
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        {driverName && (
                            <span className="text-sm text-gray-600">
                                Hello, <strong>{driverName}</strong>
                            </span>
                        )}
                        {driverId && (
                            <Link
                                href={route('driver.profile.edit')}
                                className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                                Edit Profile
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
