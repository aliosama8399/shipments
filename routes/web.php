<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\DriverRegisterController;
use App\Http\Controllers\Auth\DriverLoginController;
use App\Http\Controllers\DriverDashboardController;
use App\Http\Controllers\DriverShipmentController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ShipmentController as AdminShipmentController;
use App\Http\Controllers\Admin\ParcelController as AdminParcelController;

// Driver guest routes (public)
Route::get('/driver/login', [DriverLoginController::class, 'create'])->name('driver.login.create');
Route::post('/driver/login', [DriverLoginController::class, 'store'])->name('driver.login.store');
Route::get('/driver/register', [DriverRegisterController::class, 'create'])->name('driver.register');
Route::post('/driver/register', [DriverRegisterController::class, 'store'])->name('driver.register.store');

// Driver authenticated routes
Route::middleware('auth.driver')->group(function () {
    Route::get('/driver/dashboard', [DriverDashboardController::class, 'index'])->name('driver.dashboard');
    Route::get('/driver/logout', [DriverLoginController::class, 'logout'])->name('driver.logout');
    Route::get('/driver/{driver}/edit', [DriverDashboardController::class, 'edit'])->name('driver.edit');
    Route::put('/driver/{driver}', [DriverDashboardController::class, 'update'])->name('driver.update');
    Route::delete('/driver/{driver}', [DriverDashboardController::class, 'destroy'])->name('driver.destroy');
    
    // Driver shipment management
    Route::get('/driver/shipments', [DriverShipmentController::class, 'index'])->name('driver.shipments.index');
    Route::get('/driver/shipments/{shipment}', [DriverShipmentController::class, 'show'])->name('driver.shipments.show');
    Route::patch('/driver/shipments/{shipment}/status', [DriverShipmentController::class, 'updateStatus'])->name('driver.shipments.updateStatus');
});

// Public driver list
Route::get('/drivers', [DriverDashboardController::class, 'index'])->name('drivers.index');
Route::get('/drivers/{driver}', [DriverDashboardController::class, 'show'])->name('driver.show');

// Admin routes (requires admin middleware)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Shipment management
    Route::resource('shipments', AdminShipmentController::class);
    Route::post('/shipments/{shipment}/assign', [AdminShipmentController::class, 'assignDriver'])->name('shipments.assign');
    Route::get('/shipments/{shipment}/timeline', [AdminShipmentController::class, 'timeline'])->name('shipments.timeline');
    
    // Parcel management (nested under shipments)
    Route::get('/shipments/{shipment}/parcels', [AdminParcelController::class, 'index'])->name('shipments.parcels.index');
    Route::get('/shipments/{shipment}/parcels/create', [AdminParcelController::class, 'create'])->name('shipments.parcels.create');
    Route::post('/shipments/{shipment}/parcels', [AdminParcelController::class, 'store'])->name('shipments.parcels.store');
    Route::get('/parcels/{parcel}/edit', [AdminParcelController::class, 'edit'])->name('parcels.edit');
    Route::put('/parcels/{parcel}', [AdminParcelController::class, 'update'])->name('parcels.update');
    Route::delete('/parcels/{parcel}', [AdminParcelController::class, 'destroy'])->name('parcels.destroy');
});

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__.'/auth.php';
