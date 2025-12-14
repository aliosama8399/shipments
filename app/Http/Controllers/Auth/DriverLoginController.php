<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\DriverAuthService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriverLoginController extends Controller
{
    public function __construct(
        private DriverAuthService $authService
    ) {}

    public function create(): Response
    {
        return Inertia::render('Auth/DriverLogin');
    }

    public function store(Request $request)
    {
        $hasEmailPassword = $request->filled('email') && $request->filled('password');
        $hasImage = $request->hasFile('image');

        if (!$hasEmailPassword && !$hasImage) {
            return back()->withErrors([
                'login' => 'Please provide email/password or face image to login',
            ]);
        }

        // Email/Password login
        if ($hasEmailPassword) {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            $result = $this->authService->loginWithCredentials($request->email, $request->password);

            if (!$result['success']) {
                return back()->withErrors(['email' => $result['error']]);
            }

            return redirect()->route('driver.dashboard')->with('success', $result['message']);
        }

        // Face recognition login
        if ($hasImage) {
            $request->validate(['image' => 'required|image|max:5120']);

            $result = $this->authService->loginWithFace($request->file('image'));

            if (!$result['success']) {
                return back()->withErrors(['image' => $result['error']]);
            }

            $confidence = round(($result['confidence'] ?? 0) * 100, 2);
            return redirect()->route('driver.dashboard')->with(
                'success',
                $result['message'] . ' (Confidence: ' . $confidence . '%)'
            );
        }

        return back()->withErrors(['login' => 'Please provide credentials or face image']);
    }

    public function logout(Request $request)
    {
        $this->authService->logout();
        return redirect()->route('driver.login.create')->with('success', 'Logged out successfully');
    }
}
