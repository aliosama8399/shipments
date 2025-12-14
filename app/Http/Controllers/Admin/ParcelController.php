<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Parcel;
use App\Models\Shipment;
use App\Services\ParcelService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ParcelController extends Controller
{
    public function __construct(
        private ParcelService $parcelService
    ) {}

    public function index(Shipment $shipment): Response
    {
        return Inertia::render('Admin/Parcels/Index', [
            'shipment' => $shipment,
            'parcels' => $this->parcelService->getByShipment($shipment),
        ]);
    }

    public function create(Shipment $shipment): Response
    {
        return Inertia::render('Admin/Parcels/Create', [
            'shipment' => $shipment,
        ]);
    }

    public function store(Request $request, Shipment $shipment)
    {
        $validated = $request->validate([
            'weight' => 'required|numeric|min:0.01',
            'dimensions' => 'nullable|string|max:50',
            'fragile' => 'boolean',
            'barcode' => 'nullable|string|unique:parcels,barcode',
        ]);

        $this->parcelService->create($shipment, $validated);

        return redirect()->route('admin.shipments.show', $shipment)
            ->with('success', 'Parcel added successfully.');
    }

    public function edit(Parcel $parcel): Response
    {
        return Inertia::render('Admin/Parcels/Edit', [
            'parcel' => $parcel,
            'shipment' => $parcel->shipment,
        ]);
    }

    public function update(Request $request, Parcel $parcel)
    {
        $validated = $request->validate([
            'weight' => 'required|numeric|min:0.01',
            'dimensions' => 'nullable|string|max:50',
            'fragile' => 'boolean',
        ]);

        $this->parcelService->update($parcel, $validated);

        return redirect()->route('admin.shipments.show', $parcel->shipment)
            ->with('success', 'Parcel updated successfully.');
    }

    public function destroy(Parcel $parcel)
    {
        $shipment = $parcel->shipment;
        $this->parcelService->delete($parcel);

        return redirect()->route('admin.shipments.show', $shipment)
            ->with('success', 'Parcel removed successfully.');
    }
}
