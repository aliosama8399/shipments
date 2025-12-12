<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TrainFacesController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Face training endpoints
Route::match(['get', 'post'], '/train-all-faces', [TrainFacesController::class, 'trainAll'])->name('api.train.all');
Route::post('/train-driver/{driver}', [TrainFacesController::class, 'trainDriver'])->name('api.train.driver');
Route::get('/train-status', [TrainFacesController::class, 'status'])->name('api.train.status');
Route::post('/train-reset', [TrainFacesController::class, 'reset'])->name('api.train.reset');
