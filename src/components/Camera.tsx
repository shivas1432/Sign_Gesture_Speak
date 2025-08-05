import React, { useEffect, useRef } from 'react';
import { Camera as CameraIcon, CameraOff, RotateCcw } from 'lucide-react';

interface CameraProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  error: string | null;
  devices: MediaDeviceInfo[];
  selectedDevice: string;
  onStart: () => void;
  onStop: () => void;
  onSwitchCamera: (deviceId: string) => void;
}

export const Camera: React.FC<CameraProps> = ({
  videoRef,
  isActive,
  error,
  devices,
  selectedDevice,
  onStart,
  onStop,
  onSwitchCamera
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current && canvasRef.current && isActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const updateCanvas = () => {
        if (video.videoWidth && video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
      };

      video.addEventListener('loadedmetadata', updateCanvas);
      return () => video.removeEventListener('loadedmetadata', updateCanvas);
    }
  }, [isActive]);

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
          <div className="text-center p-6">
            <CameraOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            <button
              onClick={onStart}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!isActive && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center p-6">
            <CameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Camera Ready
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Click start to begin gesture recognition
            </p>
            <button
              onClick={onStart}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Start Camera
            </button>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${isActive ? 'block' : 'hidden'}`}
        playsInline
        muted
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {isActive && (
        <div className="absolute top-4 right-4 flex gap-2">
          {devices.length > 1 && (
            <select
              value={selectedDevice}
              onChange={(e) => onSwitchCamera(e.target.value)}
              className="px-3 py-1 bg-black/70 text-white rounded-lg text-sm backdrop-blur-sm"
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          )}
          
          <button
            onClick={onStop}
            className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors"
            title="Stop Camera"
          >
            <CameraOff className="w-4 h-4" />
          </button>
        </div>
      )}

      {isActive && (
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-green-500/80 text-white rounded-full text-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Live
          </div>
        </div>
      )}
    </div>
  );
};