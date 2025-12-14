import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';

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
  const [deleteModal, setDeleteModal] = useState<Driver | null>(null);

  function handleDelete(driver: Driver) {
    router.delete(route('driver.destroy', driver.id), {
      onSuccess: () => setDeleteModal(null),
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Drivers</h1>
          <Link
            href={route('driver.register')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            + Register New Driver
          </Link>
        </div>

        {drivers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-lg mt-4">No drivers registered yet.</p>
            <Link
              href={route('driver.register')}
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
            >
              Register your first driver →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {drivers.map((driver) => (
              <div key={driver.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {driver.image ? (
                  <img
                    src={`/storage/${driver.image}`}
                    alt={driver.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
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

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={route('driver.show', driver.id)}
                      className="flex-1 text-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition"
                    >
                      View
                    </Link>
                    <Link
                      href={route('driver.edit', driver.id)}
                      className="flex-1 text-center px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteModal(driver)}
                      className="flex-1 px-3 py-2 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Driver</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteModal.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

