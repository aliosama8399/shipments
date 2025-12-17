import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';

interface PageProps {
    auth?: {
        user?: {
            name: string;
            email: string;
        } | null;
    };
    [key: string]: unknown;
}

export default function AdminHeader() {
    const { auth } = usePage<PageProps>().props;

    function handleLogout() {
        router.post(route('logout'));
    }

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-6">
                        <Link href={route('admin.dashboard')} className="text-xl font-bold text-indigo-600">
                            Admin Panel
                        </Link>
                        <nav className="hidden md:flex gap-4">
                            <Link
                                href={route('admin.dashboard')}
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={route('admin.shipments.index')}
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                            >
                                Shipments
                            </Link>
                            <Link
                                href={route('admin.drivers.index')}
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                            >
                                Drivers
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        {auth?.user && (
                            <span className="text-sm text-gray-600">
                                {auth.user.name}
                            </span>
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
