<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\DriverRegisterController;
use App\Http\Controllers\Auth\DriverLoginController;
use App\Http\Controllers\DriverDashboardController;

Route::middleware('guest')->group(function () {
    Route::get('/driver/login', [DriverLoginController::class, 'create'])->name('driver.login.create');
    Route::post('/driver/login', [DriverLoginController::class, 'store'])->name('driver.login.store');
    Route::get('/driver/register', [DriverRegisterController::class, 'create'])->name('driver.register');
    Route::post('/driver/register', [DriverRegisterController::class, 'store'])->name('driver.register.store');
});

Route::middleware('auth.driver')->group(function () {
    Route::get('/driver/dashboard', [DriverDashboardController::class, 'index'])->name('driver.dashboard');
    Route::get('/driver/logout', [DriverLoginController::class, 'logout'])->name('driver.logout');
});

// Public driver dashboard
Route::get('/drivers', [DriverDashboardController::class, 'index'])->name('drivers.index');
Route::get('/drivers/{driver}', [DriverDashboardController::class, 'show'])->name('driver.show');

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__.'/auth.php';
