<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Shipment;
use App\Services\ShipmentService;
use App\Services\StatusTransitionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShipmentController extends Controller
{
    public function __construct(
        private ShipmentService $shipmentService,
        private StatusTransitionService $statusTransitionService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Shipments/Index', [
            'shipments' => $this->shipmentService->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Shipments/Create', [
            'drivers' => Driver::all(),
            'statuses' => $this->statusTransitionService->getAllStatuses(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sender_name' => 'required|string|max:255',
            'sender_phone' => 'required|string|max:50',
            'sender_address' => 'required|string|max:2000',
            'receiver_name' => 'required|string|max:255',
            'receiver_phone' => 'required|string|max:50',
            'receiver_address' => 'required|string|max:2000',
            'assigned_driver_id' => 'nullable|exists:drivers,id',
            'estimated_delivery_time' => 'nullable|date',
        ]);

        $shipment = $this->shipmentService->create(
            $validated,
            'admin',
            auth()->id()
        );

        return redirect()->route('admin.shipments.show', $shipment)
            ->with('success', 'Shipment created successfully. Tracking: ' . $shipment->tracking_number);
    }

    public function show(Shipment $shipment): Response
    {
        return Inertia::render('Admin/Shipments/Show', [
            'shipment' => $shipment->load(['driver', 'parcels', 'statusHistories']),
            'timeline' => $this->shipmentService->getTimeline($shipment),
            'drivers' => Driver::all(),
            'allowedStatuses' => $this->statusTransitionService->getAllowedTransitions($shipment->status, 'admin'),
        ]);
    }

    public function edit(Shipment $shipment): Response
    {
        return Inertia::render('Admin/Shipments/Edit', [
            'shipment' => $shipment,
            'drivers' => Driver::all(),
        ]);
    }

    public function update(Request $request, Shipment $shipment)
    {
        $validated = $request->validate([
            'sender_name' => 'required|string|max:255',
            'sender_phone' => 'required|string|max:50',
            'sender_address' => 'required|string|max:2000',
            'receiver_name' => 'required|string|max:255',
            'receiver_phone' => 'required|string|max:50',
            'receiver_address' => 'required|string|max:2000',
            'estimated_delivery_time' => 'nullable|date',
        ]);

        $this->shipmentService->update($shipment, $validated);

        return redirect()->route('admin.shipments.show', $shipment)
            ->with('success', 'Shipment updated successfully.');
    }

    public function destroy(Shipment $shipment)
    {
        $this->shipmentService->delete($shipment);

        return redirect()->route('admin.shipments.index')
            ->with('success', 'Shipment deleted successfully.');
    }

    public function assignDriver(Request $request, Shipment $shipment)
    {
        $validated = $request->validate([
            'driver_id' => 'nullable|exists:drivers,id',
        ]);

        $this->shipmentService->assignDriver(
            $shipment,
            $validated['driver_id'],
            'admin',
            auth()->id()
        );

        return redirect()->route('admin.shipments.show', $shipment)
            ->with('success', 'Driver assignment updated.');
    }

    public function timeline(Shipment $shipment): Response
    {
        return Inertia::render('Admin/Shipments/Timeline', [
            'shipment' => $shipment,
            'timeline' => $this->shipmentService->getTimeline($shipment),
        ]);
    }
}
