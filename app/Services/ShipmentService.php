<?php

namespace App\Services;

use App\Models\Shipment;
use App\Models\ShipmentStatusHistory;
use App\ShipmentStatus;
use Illuminate\Support\Str;

class ShipmentService
{
    public function __construct(
        private StatusTransitionService $statusTransitionService
    ) {}

    /**
     * Get all shipments
     */
    public function all()
    {
        return Shipment::with(['driver', 'parcels'])->latest()->get();
    }

    /**
     * Find shipment by ID
     */
    public function find(int $id): ?Shipment
    {
        return Shipment::with(['driver', 'parcels', 'statusHistories'])->find($id);
    }

    /**
     * Find shipment by tracking number
     */
    public function findByTrackingNumber(string $trackingNumber): ?Shipment
    {
        return Shipment::with(['driver', 'parcels', 'statusHistories'])
            ->where('tracking_number', $trackingNumber)
            ->first();
    }

    /**
     * Get shipments assigned to a specific driver
     */
    public function getByDriver(int $driverId)
    {
        return Shipment::with(['parcels', 'statusHistories'])
            ->where('assigned_driver_id', $driverId)
            ->latest()
            ->get();
    }

    /**
     * Create a new shipment
     */
    public function create(array $data, string $changedByType, int $changedById): Shipment
    {
        $shipment = Shipment::create([
            'tracking_number' => $this->generateTrackingNumber(),
            'sender_name' => $data['sender_name'],
            'sender_phone' => $data['sender_phone'],
            'sender_address' => $data['sender_address'],
            'receiver_name' => $data['receiver_name'],
            'receiver_phone' => $data['receiver_phone'],
            'receiver_address' => $data['receiver_address'],
            'status' => ShipmentStatus::CREATED->value,
            'assigned_driver_id' => $data['assigned_driver_id'] ?? null,
            'estimated_delivery_time' => $data['estimated_delivery_time'] ?? null,
        ]);

        // Create initial status history
        $this->createStatusHistory($shipment, ShipmentStatus::CREATED->value, $changedByType, $changedById, 'Shipment created');

        return $shipment;
    }

    /**
     * Update shipment details (admin only - not status)
     */
    public function update(Shipment $shipment, array $data): Shipment
    {
        $shipment->update([
            'sender_name' => $data['sender_name'] ?? $shipment->sender_name,
            'sender_phone' => $data['sender_phone'] ?? $shipment->sender_phone,
            'sender_address' => $data['sender_address'] ?? $shipment->sender_address,
            'receiver_name' => $data['receiver_name'] ?? $shipment->receiver_name,
            'receiver_phone' => $data['receiver_phone'] ?? $shipment->receiver_phone,
            'receiver_address' => $data['receiver_address'] ?? $shipment->receiver_address,
            'estimated_delivery_time' => $data['estimated_delivery_time'] ?? $shipment->estimated_delivery_time,
        ]);

        return $shipment->fresh();
    }

    /**
     * Assign driver to shipment
     */
    public function assignDriver(Shipment $shipment, ?int $driverId, string $changedByType, int $changedById): Shipment
    {
        $shipment->update(['assigned_driver_id' => $driverId]);
        
        $note = $driverId ? "Driver assigned (ID: $driverId)" : "Driver unassigned";
        $this->createStatusHistory($shipment, $shipment->status, $changedByType, $changedById, $note);

        return $shipment->fresh();
    }

    /**
     * Update shipment status
     */
    public function updateStatus(Shipment $shipment, string $newStatus, string $changedByType, int $changedById, ?string $notes = null): array
    {
        $currentStatus = $shipment->status;

        // Validate transition
        $validation = $this->statusTransitionService->validateTransition($currentStatus, $newStatus, $changedByType);
        
        if (!$validation['valid']) {
            return [
                'success' => false,
                'error' => $validation['error'],
            ];
        }

        $shipment->update(['status' => $newStatus]);
        $this->createStatusHistory($shipment, $newStatus, $changedByType, $changedById, $notes);

        return [
            'success' => true,
            'shipment' => $shipment->fresh(),
        ];
    }

    /**
     * Get shipment timeline (status history)
     */
    public function getTimeline(Shipment $shipment)
    {
        return $shipment->statusHistories()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Delete shipment
     */
    public function delete(Shipment $shipment): bool
    {
        return $shipment->delete();
    }

    /**
     * Generate unique tracking number
     */
    private function generateTrackingNumber(): string
    {
        do {
            $trackingNumber = 'SHP' . strtoupper(Str::random(10));
        } while (Shipment::where('tracking_number', $trackingNumber)->exists());

        return $trackingNumber;
    }

    /**
     * Create status history entry
     */
    private function createStatusHistory(Shipment $shipment, string $status, string $changedByType, int $changedById, ?string $notes = null): void
    {
        ShipmentStatusHistory::create([
            'shipment_id' => $shipment->id,
            'status' => $status,
            'changed_by_type' => $changedByType,
            'changed_by_id' => $changedById,
            'notes' => $notes,
        ]);
    }
}
