import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Copy, Trash2, Download, Settings } from 'lucide-react';
import { GestureResult, VoiceSettings } from '../types';
import { TextToSpeechEngine } from '../utils/textToSpeech';

interface ResultsPanelProps {
  currentGesture: GestureResult | null;
  recognizedText: string;
  voiceSettings: VoiceSettings;
  onVoiceSettingsChange: (settings: VoiceSettings) => void;
  onClearText: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  currentGesture,
  recognizedText,
  voiceSettings,
  onVoiceSettingsChange,
  onClearText
}) => {
  const [tts] = useState(() => new TextToSpeechEngine());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    setVoices(tts.getVoices());
  }, [tts]);

  const handleSpeak = () => {
    if (isSpeaking) {
      tts.stop();
      setIsSpeaking(false);
    } else if (recognizedText.trim()) {
      tts.speak(recognizedText, voiceSettings);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), recognizedText.length * 100);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recognizedText);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([recognizedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sign-language-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const gestureDisplayNames: Record<string, string> = {
    'A': 'Letter A',
    'L': 'Letter L',
    'V': 'Peace Sign / Letter V',
    'THUMBS_UP': 'Thumbs Up',
    'OPEN_PALM': 'Open Palm / Hello'
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recognition Results
        </h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Current Gesture Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Current Gesture
          </span>
          {currentGesture && (
            <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
              {Math.round(currentGesture.confidence * 100)}% confident
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white min-h-[3rem] flex items-center">
          {currentGesture ? (
            <span className="animate-pulse">
              {gestureDisplayNames[currentGesture.gesture] || currentGesture.gesture}
            </span>
          ) : (
            <span className="text-gray-400">Show a gesture to the camera</span>
          )}
        </div>
      </div>

      {/* Voice Settings Panel */}
      {showSettings && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white">Voice Settings</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Voice
            </label>
            <select
              value={voiceSettings.voice?.name || ''}
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value);
                onVoiceSettingsChange({ ...voiceSettings, voice });
              }}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="">Default Voice</option>
              {voices.map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Speed: {voiceSettings.rate.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.rate}
              onChange={(e) => onVoiceSettingsChange({ ...voiceSettings, rate: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pitch: {voiceSettings.pitch.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={voiceSettings.pitch}
              onChange={(e) => onVoiceSettingsChange({ ...voiceSettings, pitch: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Recognized Text Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recognized Text
          </label>
          <div className="flex gap-1">
            <button
              onClick={handleSpeak}
              disabled={!recognizedText.trim()}
              className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={isSpeaking ? "Stop Speaking" : "Speak Text"}
            >
              {isSpeaking ? (
                <VolumeX className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              )}
            </button>
            <button
              onClick={handleCopy}
              disabled={!recognizedText.trim()}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Copy Text"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              disabled={!recognizedText.trim()}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Download Text"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClearText}
              disabled={!recognizedText.trim()}
              className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Clear Text"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
        <textarea
          value={recognizedText}
          readOnly
          className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none min-h-[200px]"
          placeholder="Recognized gestures will appear here..."
        />
      </div>
    </div>
  );
};