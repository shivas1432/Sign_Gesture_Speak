import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Camera } from './components/Camera';
import { GestureOverlay } from './components/GestureOverlay';
import { ResultsPanel } from './components/ResultsPanel';
import { Controls } from './components/Controls';
import { HelpModal } from './components/HelpModal';
import { useCamera } from './hooks/useCamera';
import { useGestureRecognition } from './hooks/useGestureRecognition';
import { AppSettings, GestureResult } from './types';

function App() {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    sensitivity: 0.7,
    minConfidence: 0.7,
    voiceSettings: {
      rate: 1,
      pitch: 1,
      volume: 1
    }
  });

  const [recognizedText, setRecognizedText] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const {
    videoRef,
    isActive: cameraActive,
    error: cameraError,
    devices,
    selectedDevice,
    startCamera,
    stopCamera,
    switchCamera
  } = useCamera();

  const {
    detectedHands,
    currentGesture,
    isProcessing
  } = useGestureRecognition(videoRef.current, cameraActive);

  // Apply theme
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Handle gesture recognition results
  useEffect(() => {
    if (currentGesture && currentGesture.confidence >= settings.minConfidence) {
      const gestureText = getGestureText(currentGesture);
      setRecognizedText(prev => {
        const words = prev.trim().split(/\s+/);
        const lastWord = words[words.length - 1];
        
        // Avoid duplicating the same gesture
        if (lastWord !== gestureText) {
          return prev + (prev ? ' ' : '') + gestureText;
        }
        return prev;
      });
    }
  }, [currentGesture, settings.minConfidence]);

  const getGestureText = (gesture: GestureResult): string => {
    const textMap: Record<string, string> = {
      'A': 'A',
      'L': 'L',
      'V': 'V',
      'THUMBS_UP': '👍',
      'OPEN_PALM': 'Hello'
    };
    return textMap[gesture.gesture] || gesture.gesture;
  };

  const handleToggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleReset = () => {
    setRecognizedText('');
    stopCamera();
  };

  const handleClearText = () => {
    setRecognizedText('');
  };

  const handleSensitivityChange = (value: number) => {
    setSettings(prev => ({
      ...prev,
      sensitivity: value,
      minConfidence: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header
        settings={settings}
        onSettingsChange={setSettings}
        onShowHelp={() => setShowHelp(true)}
      />

      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Camera Section */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Camera
                videoRef={videoRef}
                isActive={cameraActive}
                error={cameraError}
                devices={devices}
                selectedDevice={selectedDevice}
                onStart={startCamera}
                onStop={stopCamera}
                onSwitchCamera={switchCamera}
              />
              {cameraActive && (
                <GestureOverlay
                  detectedHands={detectedHands}
                  videoElement={videoRef.current}
                />
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <ResultsPanel
              currentGesture={currentGesture}
              recognizedText={recognizedText}
              voiceSettings={settings.voiceSettings}
              onVoiceSettingsChange={(voiceSettings) =>
                setSettings(prev => ({ ...prev, voiceSettings }))
              }
              onClearText={handleClearText}
            />
          </div>
        </div>

        {/* Controls */}
        <Controls
          isActive={cameraActive}
          isProcessing={isProcessing}
          onToggle={handleToggleCamera}
          onReset={handleReset}
          sensitivity={settings.sensitivity}
          onSensitivityChange={handleSensitivityChange}
        />
      </main>

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* Loading overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-900 dark:text-white">
                Initializing gesture recognition...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;