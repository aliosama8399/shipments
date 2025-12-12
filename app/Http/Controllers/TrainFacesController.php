<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class TrainFacesController extends Controller
{
    /**
     * Train a single driver's face
     */
    public function trainDriver(Driver $driver, Request $request)
    {
        if (!$driver->image) {
            return response()->json(['success' => false, 'error' => 'Driver has no profile image'], 400);
        }

        try {
            $imagePath = storage_path('app/public/' . $driver->image);
            
            if (!file_exists($imagePath)) {
                return response()->json(['success' => false, 'error' => 'Image file not found'], 404);
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
                return response()->json([
                    'success' => true,
                    'message' => 'Face trained successfully',
                    'driver' => $driver->name
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => $data['error'] ?? 'Training failed'
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Service error: ' . $e->getMessage()
            ], 503);
        }
    }
    
    /**
     * Train all driver faces from database/storage
     */
    public function trainAll(Request $request)
    {
        try {
            $client = new Client();
            
            // Call Flask /train-all endpoint
            $response = $client->post('http://localhost:5000/train-all');
            $data = json_decode($response->getBody(), true);
            
            if ($data['success'] ?? false) {
                return response()->json([
                    'success' => true,
                    'message' => $data['message'],
                    'total_trained' => $data['total_trained_faces'],
                    'driver_ids' => $data['driver_ids']
                ]);
            }
            
            return response()->json([
                'success' => false,
                'error' => $data['error'] ?? 'Training failed'
            ], 400);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Flask service unavailable: ' . $e->getMessage()
            ], 503);
        }
    }
    
    /**
     * Get training status
     */
    public function status(Request $request)
    {
        try {
            $client = new Client();
            $response = $client->get('http://localhost:5000/status');
            $data = json_decode($response->getBody(), true);
            
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Service unavailable: ' . $e->getMessage()
            ], 503);
        }
    }
    
    /**
     * Reset all trained faces
     */
    public function reset(Request $request)
    {
        try {
            $client = new Client();
            $response = $client->post('http://localhost:5000/reset');
            $data = json_decode($response->getBody(), true);
            
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Service unavailable: ' . $e->getMessage()
            ], 503);
        }
    }
}
