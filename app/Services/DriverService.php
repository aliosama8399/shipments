<?php

namespace App\Services;

use App\Models\Driver;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class DriverService
{
    /**
     * Get all drivers
     */
    public function all()
    {
        return Driver::all();
    }

    /**
     * Find driver by ID
     */
    public function find(int $id): ?Driver
    {
        return Driver::find($id);
    }

    /**
     * Create a new driver
     */
    public function create(array $data, ?UploadedFile $image = null): Driver
    {
        $driverData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'license_number' => $data['license_number'],
            'address' => $data['address'] ?? null,
            'image' => null,
        ];

        if ($image) {
            $driverData['image'] = $image->store('drivers', 'public');
        }

        return Driver::create($driverData);
    }

    /**
     * Update an existing driver
     */
    public function update(Driver $driver, array $data, ?UploadedFile $image = null): Driver
    {
        $updateData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'license_number' => $data['license_number'],
            'address' => $data['address'] ?? null,
        ];

        // Handle image upload
        if ($image) {
            // Delete old image if exists
            if ($driver->image && Storage::disk('public')->exists($driver->image)) {
                Storage::disk('public')->delete($driver->image);
            }
            $updateData['image'] = $image->store('drivers', 'public');
        }

        // Handle password update
        if (!empty($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        $driver->update($updateData);
        return $driver->fresh();
    }

    /**
     * Delete a driver
     */
    public function delete(Driver $driver): bool
    {
        // Delete driver image if exists
        if ($driver->image && Storage::disk('public')->exists($driver->image)) {
            Storage::disk('public')->delete($driver->image);
        }

        return $driver->delete();
    }
}
