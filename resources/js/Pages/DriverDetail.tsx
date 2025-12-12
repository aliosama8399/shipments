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
  driver: Driver;
}

export default function DriverDetail({ driver }: Props) {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href={route('drivers.index')}
          className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block"
        >
          ← Back to Drivers
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {driver.image && (
            <img
              src={`/storage/${driver.image}`}
              alt={driver.name}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8">
            <h1 className="text-4xl font-extrabold text-gray-900">{driver.name}</h1>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium text-gray-900">{driver.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">License Number</p>
                <p className="text-lg font-medium text-gray-900">{driver.license_number}</p>
              </div>

              {driver.address && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-lg font-medium text-gray-900">{driver.address}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">Registered</p>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(driver.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
