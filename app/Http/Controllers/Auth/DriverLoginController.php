<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class DriverLoginController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/DriverLogin');
    }

    public function store(Request $request)
    {
        // Validate that either (email + password) OR image is provided
        $hasEmailPassword = $request->filled('email') && $request->filled('password');
        $hasImage = $request->hasFile('image');

        if (!$hasEmailPassword && !$hasImage) {
            return back()->withErrors([
                'login' => 'Please provide email/password or face image to login',
            ]);
        }

        if ($hasEmailPassword) {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);
        }

        if ($hasImage) {
            $request->validate([
                'image' => 'required|image|max:5120',
            ]);
        }

        // Email/Password login
        if ($hasEmailPassword) {
            $driver = Driver::where('email', $request->email)->first();

            if (!$driver || !Hash::check($request->password, $driver->password)) {
                return back()->withErrors([
                    'email' => 'Invalid email or password',
                ]);
            }

            session()->put('driver_id', $driver->id);
            session()->put('driver_name', $driver->name);

            return redirect()->route('driver.dashboard')->with('success', 'Welcome back, ' . $driver->name);
        }

        // Face recognition login
        if ($hasImage) {
            try {
                $imagePath = $request->file('image')->getRealPath();
                $client = new \GuzzleHttp\Client();

                $response = $client->post('http://localhost:5000/recognize_face', [
                    'multipart' => [
                        [
                            'name' => 'image',
                            'contents' => fopen($imagePath, 'r'),
                        ],
                    ],
                ]);

                $data = json_decode($response->getBody(), true);

                if ($data['success'] ?? false) {
                    $driver_id = $data['driver_id'];
                    $driver = Driver::find($driver_id);

                    if (!$driver) {
                        return back()->withErrors([
                            'image' => 'Driver not found',
                        ]);
                    }

                    session()->put('driver_id', $driver->id);
                    session()->put('driver_name', $driver->name);

                    return redirect()->route('driver.dashboard')->with(
                        'success',
                        'Face recognized! Welcome, ' . $driver->name . ' (Confidence: ' . round($data['confidence'] * 100, 2) . '%)'
                    );
                }

                return back()->withErrors([
                    'image' => $data['error'] ?? 'Face not recognized',
                ]);
            } catch (\Exception $e) {
                return back()->withErrors([
                    'image' => 'Face recognition service unavailable: ' . $e->getMessage(),
                ]);
            }
        }

        return back()->withErrors([
            'login' => 'Please provide credentials or face image',
        ]);
    }

    public function logout(Request $request)
    {
        session()->forget(['driver_id', 'driver_name']);
        return redirect()->route('driver.login.create')->with('success', 'Logged out successfully');
    }
}
