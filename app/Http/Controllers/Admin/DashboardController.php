<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Shipment;
use App\ShipmentStatus;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'totalShipments' => Shipment::count(),
            'activeShipments' => Shipment::whereNotIn('status', [
                ShipmentStatus::DELIVERED->value,
                ShipmentStatus::FAILED->value,
            ])->count(),
            'deliveredToday' => Shipment::where('status', ShipmentStatus::DELIVERED->value)
                ->whereDate('updated_at', today())
                ->count(),
            'totalDrivers' => Driver::count(),
        ];

        $recentShipments = Shipment::with('driver')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentShipments' => $recentShipments,
        ]);
    }
}
