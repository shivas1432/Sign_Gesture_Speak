// Computer Vision Model Configuration
export const CV_MODEL_CONFIG = {
  handTracking: {
    provider: 'mediapipe',
    modelPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/',
    options: {
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5
    }
  },
  
  gestureClassification: {
    confidenceThreshold: 0.8,
    frameBufferSize: 10,
    smoothingWindow: 5
  },
  
  camera: {
    width: 640,
    height: 480,
    fps: 30,
    facingMode: 'user'
  },
  
  performance: {
    enableGPU: true,
    maxProcessingTime: 100, // milliseconds
    skipFrames: 2 // process every 3rd frame for performance
  }
};
