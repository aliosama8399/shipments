<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Parcel extends Model
{
    protected $fillable = [
        'shipment_id',
        'weight',
        'dimensions',
        'fragile',
        'barcode',
    ];

    protected $casts = [
        'weight' => 'decimal:2',
        'fragile' => 'boolean',
    ];

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
    }
}
