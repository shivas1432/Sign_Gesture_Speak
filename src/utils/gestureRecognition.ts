import { HandLandmark, GestureResult } from '../types';

// Simplified gesture recognition based on hand landmark patterns
export class GestureRecognizer {
  private gestureDatabase: Map<string, (landmarks: HandLandmark[]) => number> = new Map();

  constructor() {
    this.initializeGestures();
  }

  private initializeGestures() {
    // Letter A - Closed fist with thumb on side
    this.gestureDatabase.set('A', (landmarks) => {
      if (!landmarks || landmarks.length < 21) return 0;
      
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      const middleTip = landmarks[12];
      const wrist = landmarks[0];
      
      // Check if fingers are closed and thumb is positioned correctly
      const fingersDown = this.areFingersClosed(landmarks);
      const thumbPosition = this.getThumbPosition(landmarks);
      
      return fingersDown && thumbPosition === 'side' ? 0.85 : 0.1;
    });

    // Letter L - Index up, thumb out
    this.gestureDatabase.set('L', (landmarks) => {
      if (!landmarks || landmarks.length < 21) return 0;
      
      const isIndexUp = this.isFingerExtended(landmarks, 'index');
      const isThumbOut = this.isFingerExtended(landmarks, 'thumb');
      const othersClosed = !this.isFingerExtended(landmarks, 'middle') && 
                          !this.isFingerExtended(landmarks, 'ring') && 
                          !this.isFingerExtended(landmarks, 'pinky');
      
      return isIndexUp && isThumbOut && othersClosed ? 0.9 : 0.1;
    });

    // Peace Sign - Index and middle up
    this.gestureDatabase.set('V', (landmarks) => {
      if (!landmarks || landmarks.length < 21) return 0;
      
      const isIndexUp = this.isFingerExtended(landmarks, 'index');
      const isMiddleUp = this.isFingerExtended(landmarks, 'middle');
      const othersClosed = !this.isFingerExtended(landmarks, 'ring') && 
                          !this.isFingerExtended(landmarks, 'pinky');
      
      return isIndexUp && isMiddleUp && othersClosed ? 0.88 : 0.1;
    });

    // Thumbs up
    this.gestureDatabase.set('THUMBS_UP', (landmarks) => {
      if (!landmarks || landmarks.length < 21) return 0;
      
      const isThumbUp = this.isFingerExtended(landmarks, 'thumb');
      const othersClosed = !this.isFingerExtended(landmarks, 'index') && 
                          !this.isFingerExtended(landmarks, 'middle') && 
                          !this.isFingerExtended(landmarks, 'ring') && 
                          !this.isFingerExtended(landmarks, 'pinky');
      
      return isThumbUp && othersClosed ? 0.92 : 0.1;
    });

    // Open palm - all fingers extended
    this.gestureDatabase.set('OPEN_PALM', (landmarks) => {
      if (!landmarks || landmarks.length < 21) return 0;
      
      const allExtended = this.isFingerExtended(landmarks, 'thumb') &&
                         this.isFingerExtended(landmarks, 'index') &&
                         this.isFingerExtended(landmarks, 'middle') &&
                         this.isFingerExtended(landmarks, 'ring') &&
                         this.isFingerExtended(landmarks, 'pinky');
      
      return allExtended ? 0.87 : 0.1;
    });
  }

  recognizeGesture(landmarks: HandLandmark[]): GestureResult | null {
    if (!landmarks || landmarks.length < 21) return null;

    let bestGesture = '';
    let bestConfidence = 0;

    for (const [gesture, recognizer] of this.gestureDatabase) {
      const confidence = recognizer(landmarks);
      if (confidence > bestConfidence && confidence > 0.7) {
        bestGesture = gesture;
        bestConfidence = confidence;
      }
    }

    if (bestGesture) {
      return {
        gesture: bestGesture,
        confidence: bestConfidence,
        timestamp: Date.now()
      };
    }

    return null;
  }

  private isFingerExtended(landmarks: HandLandmark[], finger: string): boolean {
    const fingerIndices = {
      thumb: [1, 2, 3, 4],
      index: [5, 6, 7, 8],
      middle: [9, 10, 11, 12],
      ring: [13, 14, 15, 16],
      pinky: [17, 18, 19, 20]
    };

    const indices = fingerIndices[finger as keyof typeof fingerIndices];
    if (!indices) return false;

    const tip = landmarks[indices[3]];
    const pip = landmarks[indices[2]];
    const mcp = landmarks[indices[1]];

    // Simple extension check based on y-coordinates
    return tip.y < pip.y && pip.y < mcp.y;
  }

  private areFingersClosed(landmarks: HandLandmark[]): boolean {
    return !this.isFingerExtended(landmarks, 'index') &&
           !this.isFingerExtended(landmarks, 'middle') &&
           !this.isFingerExtended(landmarks, 'ring') &&
           !this.isFingerExtended(landmarks, 'pinky');
  }

  private getThumbPosition(landmarks: HandLandmark[]): 'side' | 'front' | 'back' {
    const thumbTip = landmarks[4];
    const indexMcp = landmarks[5];
    
    // Simplified thumb position detection
    return Math.abs(thumbTip.x - indexMcp.x) > 0.1 ? 'side' : 'front';
  }
}