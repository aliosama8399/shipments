<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\DriverRegisterController;
use App\Http\Controllers\Auth\DriverLoginController;
use App\Http\Controllers\DriverDashboardController;
use App\Http\Controllers\DriverShipmentController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ShipmentController as AdminShipmentController;
use App\Http\Controllers\Admin\ParcelController as AdminParcelController;

// Home redirects to admin login
Route::get('/', function () {
    return redirect()->route('login');
});

// Driver login and self-registration (public)
Route::get('/driver/login', [DriverLoginController::class, 'create'])->name('driver.login.create');
Route::post('/driver/login', [DriverLoginController::class, 'store'])->name('driver.login.store');
Route::get('/driver/register', [DriverRegisterController::class, 'createSelf'])->name('driver.register');
Route::post('/driver/register', [DriverRegisterController::class, 'storeSelf'])->name('driver.register.store');

// Driver authenticated routes
Route::middleware('auth.driver')->group(function () {
    Route::get('/driver/dashboard', [DriverDashboardController::class, 'index'])->name('driver.dashboard');
    Route::get('/driver/logout', [DriverLoginController::class, 'logout'])->name('driver.logout');
    
    // Driver can only edit their own profile
    Route::get('/driver/profile/edit', [DriverDashboardController::class, 'editProfile'])->name('driver.profile.edit');
    Route::put('/driver/profile', [DriverDashboardController::class, 'updateProfile'])->name('driver.profile.update');
    
    // Driver shipment management
    Route::get('/driver/shipments', [DriverShipmentController::class, 'index'])->name('driver.shipments.index');
    Route::get('/driver/shipments/{shipment}', [DriverShipmentController::class, 'show'])->name('driver.shipments.show');
    Route::patch('/driver/shipments/{shipment}/status', [DriverShipmentController::class, 'updateStatus'])->name('driver.shipments.updateStatus');
});

// Admin routes (requires admin middleware)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Driver management (admin only)
    Route::get('/drivers', [DriverDashboardController::class, 'adminIndex'])->name('drivers.index');
    Route::get('/drivers/create', [DriverRegisterController::class, 'create'])->name('drivers.create');
    Route::post('/drivers', [DriverRegisterController::class, 'store'])->name('drivers.store');
    Route::get('/drivers/{driver}', [DriverDashboardController::class, 'show'])->name('drivers.show');
    Route::get('/drivers/{driver}/edit', [DriverDashboardController::class, 'edit'])->name('drivers.edit');
    Route::put('/drivers/{driver}', [DriverDashboardController::class, 'update'])->name('drivers.update');
    Route::delete('/drivers/{driver}', [DriverDashboardController::class, 'destroy'])->name('drivers.destroy');
    
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

require __DIR__.'/auth.php';

