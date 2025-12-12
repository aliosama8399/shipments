<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class FaceTrainingController extends Controller
{
    public function index()
    {
        $drivers = Driver::all();
        return view('face-training', ['drivers' => $drivers]);
    }

    public function train(Driver $driver, Request $request)
    {
        if (!$driver->image) {
            return back()->withErrors(['image' => 'Driver has no profile image']);
        }

        try {
            $imagePath = storage_path('app/public/' . $driver->image);
            
            if (!file_exists($imagePath)) {
                return back()->withErrors(['image' => 'Image file not found']);
            }

            $client = new Client();
            $response = $client->post('http://localhost:5000/train_face', [
                'multipart' => [
                    [
                        'name' => 'image',
                        'contents' => fopen($imagePath, 'r'),
                    ],
                    [
                        'name' => 'driver_id',
                        'contents' => (string)$driver->id,
                    ],
                    [
                        'name' => 'name',
                        'contents' => $driver->name,
                    ],
                ],
            ]);

            $data = json_decode($response->getBody(), true);

            if ($data['success'] ?? false) {
                return back()->with('success', 'Face trained successfully: ' . $data['message']);
            }

            return back()->withErrors(['image' => $data['error'] ?? 'Training failed']);

        } catch (\Exception $e) {
            return back()->withErrors(['image' => 'Error: ' . $e->getMessage()]);
        }
    }

    public function status()
    {
        try {
            $client = new Client();
            $response = $client->get('http://localhost:5000/status');
            $data = json_decode($response->getBody(), true);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Service unavailable'], 503);
        }
    }
}
