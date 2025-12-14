<?php

namespace App\Services;

use App\ShipmentStatus;

class StatusTransitionService
{
    /**
     * Define valid status transitions and who can make them
     */
    private array $validTransitions = [
        'CREATED' => [
            'PICKED_UP' => ['driver'],
        ],
        'PICKED_UP' => [
            'IN_TRANSIT' => ['driver'],
        ],
        'IN_TRANSIT' => [
            'OUT_FOR_DELIVERY' => ['driver'],
            'FAILED' => ['driver'],
        ],
        'OUT_FOR_DELIVERY' => [
            'DELIVERED' => ['driver'],
            'FAILED' => ['driver'],
        ],
        'DELIVERED' => [],
        'FAILED' => [],
    ];

    /**
     * Validate if a status transition is allowed
     */
    public function validateTransition(string $currentStatus, string $newStatus, string $changedByType): array
    {
        // Check if new status is valid
        if (!$this->isValidStatus($newStatus)) {
            return [
                'valid' => false,
                'error' => "Invalid status: $newStatus",
            ];
        }

        // Check if transition is allowed from current status
        if (!isset($this->validTransitions[$currentStatus][$newStatus])) {
            return [
                'valid' => false,
                'error' => "Cannot transition from $currentStatus to $newStatus",
            ];
        }

        // Check if actor type is allowed to make this transition
        $allowedActors = $this->validTransitions[$currentStatus][$newStatus];
        if (!in_array($changedByType, $allowedActors)) {
            return [
                'valid' => false,
                'error' => ucfirst($changedByType) . " cannot change status from $currentStatus to $newStatus",
            ];
        }

        return [
            'valid' => true,
        ];
    }

    /**
     * Get allowed next statuses for a given status and actor type
     */
    public function getAllowedTransitions(string $currentStatus, string $actorType): array
    {
        if (!isset($this->validTransitions[$currentStatus])) {
            return [];
        }

        $allowed = [];
        foreach ($this->validTransitions[$currentStatus] as $status => $actors) {
            if (in_array($actorType, $actors)) {
                $allowed[] = $status;
            }
        }

        return $allowed;
    }

    /**
     * Check if a status value is valid
     */
    public function isValidStatus(string $status): bool
    {
        return in_array($status, array_column(ShipmentStatus::cases(), 'value'));
    }

    /**
     * Get all possible statuses
     */
    public function getAllStatuses(): array
    {
        return array_column(ShipmentStatus::cases(), 'value');
    }
}
