<?php

namespace App\Services;

use App\Models\Driver;
use Illuminate\Support\Facades\Hash;
use GuzzleHttp\Client;
use Illuminate\Http\UploadedFile;

class DriverAuthService
{
    /**
     * Authenticate driver with email and password
     */
    public function loginWithCredentials(string $email, string $password): array
    {
        $driver = Driver::where('email', $email)->first();

        if (!$driver || !Hash::check($password, $driver->password)) {
            return [
                'success' => false,
                'error' => 'Invalid email or password',
            ];
        }

        $this->setDriverSession($driver);

        return [
            'success' => true,
            'driver' => $driver,
            'message' => 'Welcome back, ' . $driver->name,
        ];
    }

    /**
     * Authenticate driver with face recognition
     */
    public function loginWithFace(UploadedFile $image): array
    {
        try {
            $imagePath = $image->getRealPath();
            $client = new Client();

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
                $driver = Driver::find($data['driver_id']);

                if (!$driver) {
                    return [
                        'success' => false,
                        'error' => 'Driver not found',
                    ];
                }

                $this->setDriverSession($driver);

                return [
                    'success' => true,
                    'driver' => $driver,
                    'confidence' => $data['confidence'] ?? 0,
                    'message' => 'Face recognized! Welcome, ' . $driver->name,
                ];
            }

            return [
                'success' => false,
                'error' => $data['error'] ?? 'Face not recognized',
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => 'Face recognition service unavailable: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Logout driver
     */
    public function logout(): void
    {
        session()->forget(['driver_id', 'driver_name']);
    }

    /**
     * Get currently logged in driver
     */
    public function getCurrentDriver(): ?Driver
    {
        if (!session()->has('driver_id')) {
            return null;
        }
        return Driver::find(session('driver_id'));
    }

    /**
     * Check if driver is logged in
     */
    public function isLoggedIn(): bool
    {
        return session()->has('driver_id');
    }

    /**
     * Set driver session
     */
    private function setDriverSession(Driver $driver): void
    {
        session()->put('driver_id', $driver->id);
        session()->put('driver_name', $driver->name);
    }
}
