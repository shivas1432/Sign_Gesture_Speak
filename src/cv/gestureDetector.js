// Computer Vision Gesture Detection Engine
class GestureDetector {
  constructor() {
    this.model = null;
    this.isLoaded = false;
    this.confidenceThreshold = 0.8;
    this.maxHands = 2;
  }

  async loadModel() {
    try {
      // Load MediaPipe Hand Tracking model
      const { Hands } = await import('@mediapipe/hands');
      const { Camera } = await import('@mediapipe/camera_utils');
      
      this.hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      this.hands.setOptions({
        maxNumHands: this.maxHands,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.hands.onResults((results) => this.processResults(results));
      this.isLoaded = true;
      
      console.log('✅ Gesture detection model loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load gesture detection model:', error);
    }
  }

  async detectHands(videoElement) {
    if (!this.isLoaded) {
      await this.loadModel();
    }

    try {
      await this.hands.send({ image: videoElement });
    } catch (error) {
      console.error('Hand detection failed:', error);
      return [];
    }
  }

  processResults(results) {
    if (!results.multiHandLandmarks) {
      return { gesture: 'none', confidence: 0, hands: [] };
    }

    const detectedHands = results.multiHandLandmarks.map((landmarks, index) => {
      const handedness = results.multiHandedness[index];
      return {
        landmarks: landmarks,
        handedness: handedness.label,
        confidence: handedness.score
      };
    });

    return detectedHands;
  }

  extractFingerPositions(landmarks) {
    // Extract key finger positions for gesture classification
    const fingerTips = [4, 8, 12, 16, 20]; // Thumb, Index, Middle, Ring, Pinky tips
    const fingerMcps = [2, 5, 9, 13, 17]; // Metacarpals
    
    return {
      tips: fingerTips.map(i => landmarks[i]),
      mcps: fingerMcps.map(i => landmarks[i]),
      wrist: landmarks[0],
      palm: landmarks[9]
    };
  }

  classifyGesture(fingerPositions) {
    // Basic gesture classification logic
    const { tips, mcps, wrist } = fingerPositions;
    
    // Check if fingers are extended
    const extendedFingers = tips.map((tip, i) => {
      return tip.y < mcps[i].y; // Simple up/down check
    });

    // Basic gesture patterns
    if (extendedFingers.every(extended => extended)) {
      return { gesture: 'open_hand', confidence: 0.9 };
    } else if (extendedFingers.every(extended => !extended)) {
      return { gesture: 'fist', confidence: 0.85 };
    } else if (extendedFingers[1] && !extendedFingers[2] && !extendedFingers[3] && !extendedFingers[4]) {
      return { gesture: 'pointing', confidence: 0.8 };
    } else if (extendedFingers[1] && extendedFingers[2] && !extendedFingers[3] && !extendedFingers[4]) {
      return { gesture: 'peace_sign', confidence: 0.8 };
    }

    return { gesture: 'unknown', confidence: 0.3 };
  }
}

module.exports = GestureDetector;
