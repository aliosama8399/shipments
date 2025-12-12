import React from 'react';
import { Link } from '@inertiajs/react';

interface Driver {
  id: number;
  name: string;
  email: string;
  license_number: string;
  image: string | null;
  address: string | null;
  created_at: string;
}

interface Props {
  drivers: Driver[];
}

export default function DriverDashboard({ drivers }: Props) {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Drivers</h1>
          <Link
            href={route('driver.register')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Register New Driver
          </Link>
        </div>

        {drivers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No drivers registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {drivers.map((driver) => (
              <div key={driver.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {driver.image && (
                  <img
                    src={`/storage/${driver.image}`}
                    alt={driver.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900">{driver.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{driver.email}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>License:</strong> {driver.license_number}
                  </p>
                  {driver.address && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Address:</strong> {driver.address}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-4">
                    Registered: {new Date(driver.created_at).toLocaleDateString()}
                  </p>
                  <Link
                    href={route('driver.show', driver.id)}
                    className="mt-4 inline-block px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
