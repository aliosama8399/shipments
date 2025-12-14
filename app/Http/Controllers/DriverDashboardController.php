<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Services\DriverService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriverDashboardController extends Controller
{
    public function __construct(
        private DriverService $driverService
    ) {}

    public function index(): Response
    {
        if (!session()->has('driver_id')) {
            return redirect()->route('driver.login.create');
        }

        return Inertia::render('DriverDashboard', [
            'drivers' => $this->driverService->all(),
            'currentDriver' => $this->driverService->find(session('driver_id')),
        ]);
    }

    public function show(Driver $driver): Response
    {
        return Inertia::render('DriverDetail', [
            'driver' => $driver,
        ]);
    }

    public function edit(Driver $driver): Response
    {
        return Inertia::render('DriverEdit', [
            'driver' => $driver,
        ]);
    }

    public function update(Request $request, Driver $driver)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:drivers,email,' . $driver->id,
            'license_number' => 'required|string|max:255|unique:drivers,license_number,' . $driver->id,
            'address' => 'nullable|string|max:2000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $this->driverService->update(
            $driver,
            $validated,
            $request->hasFile('image') ? $request->file('image') : null
        );

        return redirect()->route('drivers.index')->with('success', 'Driver updated successfully.');
    }

    public function destroy(Driver $driver)
    {
        $this->driverService->delete($driver);
        return redirect()->route('drivers.index')->with('success', 'Driver deleted successfully.');
    }
}
