import React from 'react';
import { X, Hand, Camera, Mic, Settings } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const gestures = [
    { name: 'Letter A', description: 'Closed fist with thumb on the side', gesture: '✊' },
    { name: 'Letter L', description: 'Index finger up, thumb out (L shape)', gesture: '👌' },
    { name: 'Peace Sign', description: 'Index and middle fingers up', gesture: '✌️' },
    { name: 'Thumbs Up', description: 'Thumb extended upward', gesture: '👍' },
    { name: 'Open Palm', description: 'All fingers extended (Hello)', gesture: '✋' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              How to Use SignSpeak
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Getting Started
                </h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>Click "Start Camera" to enable your webcam</li>
                <li>Allow camera permissions when prompted</li>
                <li>Position your hand in front of the camera</li>
                <li>Make gestures slowly and clearly</li>
                <li>Watch the recognition results in real-time</li>
              </ol>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Hand className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Supported Gestures
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gestures.map((gesture, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{gesture.gesture}</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {gesture.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {gesture.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Mic className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Voice Features
                </h3>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>Click the speaker icon to hear recognized text</li>
                <li>Adjust voice speed and pitch in settings</li>
                <li>Choose different voice languages if available</li>
                <li>Copy or download your recognized text</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tips for Best Results
                </h3>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>Ensure good lighting on your hands</li>
                <li>Keep your hand clearly visible to the camera</li>
                <li>Make gestures slowly and deliberately</li>
                <li>Adjust sensitivity if recognition is too strict/loose</li>
                <li>Try different camera angles for better detection</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              <strong>Note:</strong> This is a demonstration app with basic gesture recognition. 
              For production use, more advanced machine learning models would be integrated 
              for comprehensive ASL vocabulary support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};