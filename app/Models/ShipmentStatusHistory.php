<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShipmentStatusHistory extends Model
{
    const UPDATED_AT = null; // Only track created_at

    protected $fillable = [
        'shipment_id',
        'status',
        'changed_by_type',
        'changed_by_id',
        'notes',
    ];

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
    }
}
