<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\DriverRegisterRequest;
use App\Services\DriverService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DriverRegisterController extends Controller
{
    public function __construct(
        private DriverService $driverService
    ) {}

    // ===== Driver Self-Registration =====

    /**
     * Show driver self-registration form (public)
     */
    public function createSelf(): Response
    {
        return Inertia::render('Auth/DriverRegister');
    }

    /**
     * Store new driver (self-registration)
     */
    public function storeSelf(DriverRegisterRequest $request): RedirectResponse
    {
        $this->driverService->create(
            $request->validated(),
            $request->hasFile('image') ? $request->file('image') : null
        );

        return redirect()->route('driver.login.create')->with('success', 'Registration successful! Please log in.');
    }

    // ===== Admin Management =====

    /**
     * Show driver registration form (admin only)
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Drivers/Create');
    }

    /**
     * Store new driver (admin only)
     */
    public function store(DriverRegisterRequest $request): RedirectResponse
    {
        $this->driverService->create(
            $request->validated(),
            $request->hasFile('image') ? $request->file('image') : null
        );

        return redirect()->route('admin.drivers.index')->with('success', 'Driver registered successfully.');
    }
}
