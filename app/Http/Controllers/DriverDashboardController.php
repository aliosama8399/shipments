<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Services\DriverService;
use App\Services\DriverAuthService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriverDashboardController extends Controller
{
    public function __construct(
        private DriverService $driverService,
        private DriverAuthService $authService
    ) {}

    /**
     * Driver dashboard - shows only their shipments summary
     */
    public function index(): Response
    {
        $driver = $this->authService->getCurrentDriver();
        
        if (!$driver) {
            return redirect()->route('driver.login.create');
        }

        return Inertia::render('Driver/Dashboard', [
            'currentDriver' => $driver,
        ]);
    }

    /**
     * Driver edits their own profile
     */
    public function editProfile(): Response
    {
        $driver = $this->authService->getCurrentDriver();
        
        if (!$driver) {
            return redirect()->route('driver.login.create');
        }

        return Inertia::render('Driver/ProfileEdit', [
            'driver' => $driver,
            'currentDriver' => $driver,
        ]);
    }

    /**
     * Driver updates their own profile
     */
    public function updateProfile(Request $request)
    {
        $driver = $this->authService->getCurrentDriver();
        
        if (!$driver) {
            return redirect()->route('driver.login.create');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:drivers,email,' . $driver->id,
            'address' => 'nullable|string|max:2000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $this->driverService->update(
            $driver,
            $validated,
            $request->hasFile('image') ? $request->file('image') : null
        );

        return redirect()->route('driver.dashboard')->with('success', 'Profile updated successfully.');
    }

    // ===== Admin Methods =====

    /**
     * Admin views all drivers
     */
    public function adminIndex(): Response
    {
        return Inertia::render('Admin/Drivers/Index', [
            'drivers' => $this->driverService->all(),
        ]);
    }

    /**
     * Admin views driver details
     */
    public function show(Driver $driver): Response
    {
        return Inertia::render('Admin/Drivers/Show', [
            'driver' => $driver,
        ]);
    }

    /**
     * Admin edits driver
     */
    public function edit(Driver $driver): Response
    {
        return Inertia::render('Admin/Drivers/Edit', [
            'driver' => $driver,
        ]);
    }

    /**
     * Admin updates driver
     */
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

        return redirect()->route('admin.drivers.index')->with('success', 'Driver updated successfully.');
    }

    /**
     * Admin deletes driver
     */
    public function destroy(Driver $driver)
    {
        $this->driverService->delete($driver);
        return redirect()->route('admin.drivers.index')->with('success', 'Driver deleted successfully.');
    }
}

