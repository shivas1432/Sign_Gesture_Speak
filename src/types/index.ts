export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface DetectedHand {
  landmarks: HandLandmark[];
  handedness: string;
  score: number;
}

export interface GestureResult {
  gesture: string;
  confidence: number;
  timestamp: number;
}

export interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  sensitivity: number;
  minConfidence: number;
  voiceSettings: VoiceSettings;
}