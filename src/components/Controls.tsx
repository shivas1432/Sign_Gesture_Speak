import React from 'react';
import { Play, Pause, RotateCcw, Zap, ZapOff } from 'lucide-react';

interface ControlsProps {
  isActive: boolean;
  isProcessing: boolean;
  onToggle: () => void;
  onReset: () => void;
  sensitivity: number;
  onSensitivityChange: (value: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isActive,
  isProcessing,
  onToggle,
  onReset,
  sensitivity,
  onSensitivityChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Controls</h3>
        {isProcessing && (
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="text-sm">Processing...</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={onToggle}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
            isActive
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5" />
              Stop Recognition
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start Recognition
            </>
          )}
        </button>

        <button
          onClick={onReset}
          className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Detection Sensitivity: {Math.round(sensitivity * 100)}%
          </label>
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.05"
            value={sensitivity}
            onChange={(e) => onSensitivityChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Less Sensitive</span>
            <span>More Sensitive</span>
          </div>
        </div>
      </div>
    </div>
  );
};