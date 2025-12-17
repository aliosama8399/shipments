import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useForm, Link } from '@inertiajs/react';

export default function DriverLogin() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'face'>('email');

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { data, setData, post, errors, processing } = useForm({
    email: '',
    password: '',
    image: null as File | null,
  });

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setCameraError('Camera access denied. Please allow camera access to use face login.');
        } else if (err.name === 'NotFoundError') {
          setCameraError('No camera found. Please connect a camera to use face login.');
        } else {
          setCameraError('Could not access camera: ' + err.message);
        }
      } else {
        setCameraError('Could not access camera.');
      }
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror the image horizontally (since video is mirrored for UX)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    // Get data URL for preview
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);

    // Convert to Blob/File for form submission
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'face-capture.jpg', { type: 'image/jpeg' });
        setData('image', file);
      }
    }, 'image/jpeg', 0.9);

    // Stop camera after capture
    stopCamera();
  }, [setData, stopCamera]);

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setData('image', null);
    startCamera();
  }, [setData, startCamera]);

  // Start camera when switching to face login
  useEffect(() => {
    if (loginMethod === 'face' && !capturedImage) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [loginMethod, capturedImage, startCamera, stopCamera]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('driver.login.store'));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Driver Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose login method below
          </p>
        </div>

        {/* Login Method Tabs */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${loginMethod === 'email'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('face')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${loginMethod === 'face'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Face Recognition
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={submit}>
          {/* Email/Password Form */}
          {loginMethod === 'email' && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.email && <span className="text-red-600 text-sm mt-1 block">{errors.email}</span>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.password && <span className="text-red-600 text-sm mt-1 block">{errors.password}</span>}
              </div>
            </>
          )}

          {/* Face Recognition - Camera Capture */}
          {loginMethod === 'face' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📸 Capture Your Face
              </label>

              {/* Camera Error */}
              {cameraError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-600 text-sm">{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Camera View */}
              {!capturedImage && !cameraError && (
                <div className="relative">
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-[4/3]">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    {!cameraActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                          <p className="text-sm">Starting camera...</p>
                        </div>
                      </div>
                    )}
                    {/* Face guide overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-56 border-2 border-white/50 rounded-full"></div>
                    </div>
                  </div>

                  {cameraActive && (
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="mt-4 w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Capture Photo
                    </button>
                  )}
                </div>
              )}

              {/* Captured Image Preview */}
              {capturedImage && (
                <div className="relative">
                  <div className="bg-gray-900 rounded-lg overflow-hidden aspect-[4/3]">
                    <img
                      src={capturedImage}
                      alt="Captured face"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Captured
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={retakePhoto}
                    className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retake Photo
                  </button>
                </div>
              )}

              {errors.image && <span className="text-red-600 text-sm mt-2 block">{errors.image}</span>}

              <p className="text-xs text-gray-500 mt-3 text-center">
                Position your face in the circle and click capture
              </p>
            </div>
          )}

          {errors.login && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600 text-sm">{errors.login}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={processing || (loginMethod === 'face' && !capturedImage)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href={route('driver.register')} className="font-medium text-indigo-600 hover:text-indigo-500">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}