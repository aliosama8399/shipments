<?php

namespace App;

enum ShipmentStatus: string
{
    case CREATED = 'CREATED';
    case PICKED_UP = 'PICKED_UP';
    case IN_TRANSIT = 'IN_TRANSIT';
    case OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY';
    case DELIVERED = 'DELIVERED';
    case FAILED = 'FAILED';
}
