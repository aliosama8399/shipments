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

    public function create(): Response
    {
        return Inertia::render('Auth/DriverRegister');
    }

    public function store(DriverRegisterRequest $request): RedirectResponse
    {
        $this->driverService->create(
            $request->validated(),
            $request->hasFile('image') ? $request->file('image') : null
        );

        return redirect()->route('driver.login.create')->with('success', 'Driver registered successfully. Please log in.');
    }
}
