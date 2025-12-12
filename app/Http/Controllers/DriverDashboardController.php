<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use Inertia\Inertia;
use Inertia\Response;

class DriverDashboardController extends Controller
{
    public function index(): Response
    {
        if (!session()->has('driver_id')) {
            return redirect()->route('driver.login.create');
        }

        $drivers = Driver::all();
        $currentDriver = Driver::find(session('driver_id'));
        
        return Inertia::render('DriverDashboard', [
            'drivers' => $drivers,
            'currentDriver' => $currentDriver,
        ]);
    }

    public function show(Driver $driver): Response
    {
        return Inertia::render('DriverDetail', [
            'driver' => $driver,
        ]);
    }
}
