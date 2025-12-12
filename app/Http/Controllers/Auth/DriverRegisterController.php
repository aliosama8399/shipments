<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\DriverRegisterRequest;
use App\Models\Driver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DriverRegisterController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/DriverRegister');

    }

        // Handle registration
    public function store(DriverRegisterRequest $request): RedirectResponse
    {
        // Store image if present
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('drivers', 'public');
        }

        // Create driver profile (independent entity)
        Driver::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'license_number' => $request->license_number,
            'image' => $imagePath,
            'address' => $request->address,
        ]);

        return redirect()->route('login')->with('success', 'Driver registered successfully. Please log in.');
    }
}
