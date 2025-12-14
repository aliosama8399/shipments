import React from 'react';
import { useForm, Link, router } from '@inertiajs/react';

interface Parcel {
    id: number;
    weight: number;
    dimensions: string | null;
    fragile: boolean;
    barcode: string;
}

interface Shipment {
    id: number;
    tracking_number: string;
}

interface Props {
    parcel: Parcel;
    shipment: Shipment;
}

export default function EditParcel({ parcel, shipment }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        weight: parcel.weight.toString(),
        dimensions: parcel.dimensions || '',
        fragile: parcel.fragile,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('admin.parcels.update', parcel.id));
    }

    function handleDelete() {
        if (confirm('Delete this parcel?')) {
            router.delete(route('admin.parcels.destroy', parcel.id));
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href={route('admin.shipments.show', shipment.id)} className="text-gray-500 hover:text-gray-700 text-sm">
                        ← Back to {shipment.tracking_number}
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit Parcel</h1>
                    <p className="text-gray-500 font-mono">{parcel.barcode}</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={data.weight}
                            onChange={(e) => setData('weight', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (LxWxH)</label>
                        <input
                            type="text"
                            value={data.dimensions}
                            onChange={(e) => setData('dimensions', e.target.value)}
                            placeholder="e.g., 30x20x15"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="fragile"
                            checked={data.fragile}
                            onChange={(e) => setData('fragile', e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="fragile" className="ml-2 text-sm text-gray-700">
                            ⚠️ Fragile - Handle with care
                        </label>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-4 py-2 text-red-600 hover:text-red-700"
                        >
                            Delete Parcel
                        </button>
                        <div className="flex gap-4">
                            <Link href={route('admin.shipments.show', shipment.id)} className="px-4 py-2 text-gray-600 hover:text-gray-900">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
