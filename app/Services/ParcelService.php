<?php

namespace App\Services;

use App\Models\Parcel;
use App\Models\Shipment;
use Illuminate\Support\Str;

class ParcelService
{
    /**
     * Get all parcels for a shipment
     */
    public function getByShipment(Shipment $shipment)
    {
        return $shipment->parcels;
    }

    /**
     * Find parcel by ID
     */
    public function find(int $id): ?Parcel
    {
        return Parcel::find($id);
    }

    /**
     * Create a new parcel for a shipment
     */
    public function create(Shipment $shipment, array $data): Parcel
    {
        return Parcel::create([
            'shipment_id' => $shipment->id,
            'weight' => $data['weight'],
            'dimensions' => $data['dimensions'] ?? null,
            'fragile' => $data['fragile'] ?? false,
            'barcode' => $data['barcode'] ?? $this->generateBarcode(),
        ]);
    }

    /**
     * Update a parcel
     */
    public function update(Parcel $parcel, array $data): Parcel
    {
        $parcel->update([
            'weight' => $data['weight'] ?? $parcel->weight,
            'dimensions' => $data['dimensions'] ?? $parcel->dimensions,
            'fragile' => $data['fragile'] ?? $parcel->fragile,
        ]);

        return $parcel->fresh();
    }

    /**
     * Delete a parcel
     */
    public function delete(Parcel $parcel): bool
    {
        return $parcel->delete();
    }

    /**
     * Generate unique barcode
     */
    private function generateBarcode(): string
    {
        do {
            $barcode = 'PKG' . strtoupper(Str::random(12));
        } while (Parcel::where('barcode', $barcode)->exists());

        return $barcode;
    }
}
