<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use App\Services\DriverAuthService;
use App\Services\ShipmentService;
use App\Services\StatusTransitionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriverShipmentController extends Controller
{
    public function __construct(
        private ShipmentService $shipmentService,
        private StatusTransitionService $statusTransitionService,
        private DriverAuthService $authService
    ) {}

    public function index(): Response
    {
        $driver = $this->authService->getCurrentDriver();
        
        if (!$driver) {
            return redirect()->route('driver.login.create');
        }

        return Inertia::render('Driver/Shipments', [
            'shipments' => $this->shipmentService->getByDriver($driver->id),
        ]);
    }

    public function show(Shipment $shipment): Response
    {
        $driver = $this->authService->getCurrentDriver();
        
        // Ensure driver can only view their assigned shipments
        if ($shipment->assigned_driver_id !== $driver?->id) {
            abort(403, 'You can only view shipments assigned to you.');
        }

        return Inertia::render('Driver/ShipmentDetail', [
            'shipment' => $shipment->load(['parcels', 'statusHistories']),
            'timeline' => $this->shipmentService->getTimeline($shipment),
            'allowedStatuses' => $this->statusTransitionService->getAllowedTransitions($shipment->status, 'driver'),
        ]);
    }

    public function updateStatus(Request $request, Shipment $shipment)
    {
        $driver = $this->authService->getCurrentDriver();
        
        // Ensure driver can only update their assigned shipments
        if ($shipment->assigned_driver_id !== $driver?->id) {
            abort(403, 'You can only update shipments assigned to you.');
        }

        $validated = $request->validate([
            'status' => 'required|string',
            'notes' => 'nullable|string|max:500',
        ]);

        $result = $this->shipmentService->updateStatus(
            $shipment,
            $validated['status'],
            'driver',
            $driver->id,
            $validated['notes'] ?? null
        );

        if (!$result['success']) {
            return back()->withErrors(['status' => $result['error']]);
        }

        return redirect()->route('driver.shipments.show', $shipment)
            ->with('success', 'Status updated to ' . $validated['status']);
    }
}
