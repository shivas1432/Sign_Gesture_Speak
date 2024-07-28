// Real-time Gesture Processing Pipeline
export const processGesture = (landmarks, previousGestures = []) => {
  if (!landmarks || landmarks.length === 0) {
    return { 
      gesture: "no_hands_detected", 
      confidence: 0,
      timestamp: Date.now()
    };
  }

  try {
    // Extract hand features
    const handFeatures = extractHandFeatures(landmarks);
    
    // Classify the gesture
    const classification = classifyGesture(handFeatures);
    
    // Apply temporal smoothing
    const smoothedGesture = applySmoothingFilter(classification, previousGestures);
    
    // Validate gesture confidence
    const validatedGesture = validateGesture(smoothedGesture);
    
    return {
      ...validatedGesture,
      timestamp: Date.now(),
      rawLandmarks: landmarks,
      handFeatures: handFeatures
    };
  } catch (error) {
    console.error('Gesture processing error:', error);
    return { 
      gesture: "processing_error", 
      confidence: 0,
      error: error.message,
      timestamp: Date.now()
    };
  }
};

const extractHandFeatures = (landmarks) => {
  // Key landmarks for gesture recognition
  const LANDMARK_INDICES = {
    WRIST: 0,
    THUMB_TIP: 4,
    INDEX_TIP: 8,
    MIDDLE_TIP: 12,
    RING_TIP: 16,
    PINKY_TIP: 20,
    INDEX_PIP: 6,
    MIDDLE_PIP: 10,
    RING_PIP: 14,
    PINKY_PIP: 18
  };

  const features = {
    fingerExtensions: calculateFingerExtensions(landmarks, LANDMARK_INDICES),
    handOrientation: calculateHandOrientation(landmarks),
    palmDirection: calculatePalmDirection(landmarks),
    fingerDistances: calculateFingerDistances(landmarks, LANDMARK_INDICES),
    handSize: calculateHandSize(landmarks),
    gestureSpeed: 0 // Would be calculated from previous frames
  };

  return features;
};

const calculateFingerExtensions = (landmarks, indices) => {
  const fingers = ['thumb', 'index', 'middle', 'ring', 'pinky'];
  const tips = [indices.THUMB_TIP, indices.INDEX_TIP, indices.MIDDLE_TIP, indices.RING_TIP, indices.PINKY_TIP];
  const pips = [indices.THUMB_TIP - 1, indices.INDEX_PIP, indices.MIDDLE_PIP, indices.RING_PIP, indices.PINKY_PIP];

  return fingers.map((finger, i) => {
    const tip = landmarks[tips[i]];
    const pip = landmarks[pips[i]];
    const wrist = landmarks[indices.WRIST];

    // Calculate if finger is extended based on relative positions
    const tipToWrist = Math.sqrt(
      Math.pow(tip.x - wrist.x, 2) + 
      Math.pow(tip.y - wrist.y, 2)
    );
    const pipToWrist = Math.sqrt(
      Math.pow(pip.x - wrist.x, 2) + 
      Math.pow(pip.y - wrist.y, 2)
    );

    return {
      finger: finger,
      extended: tipToWrist > pipToWrist * 1.2,
      confidence: Math.min(1.0, tipToWrist / pipToWrist)
    };
  });
};

const calculateHandOrientation = (landmarks) => {
  const wrist = landmarks[0];
  const middleFinger = landmarks[12];
  
  const angle = Math.atan2(
    middleFinger.y - wrist.y, 
    middleFinger.x - wrist.x
  ) * 180 / Math.PI;

  return {
    angle: angle,
    orientation: getOrientationLabel(angle)
  };
};

const getOrientationLabel = (angle) => {
  if (angle >= -45 && angle <= 45) return 'right';
  if (angle >= 45 && angle <= 135) return 'down';
  if (angle >= 135 || angle <= -135) return 'left';
  return 'up';
};

const calculatePalmDirection = (landmarks) => {
  // Use multiple landmarks to determine palm direction
  const palm = landmarks[9]; // Middle of palm
  const wrist = landmarks[0];
  const indexMcp = landmarks[5];
  const pinkyMcp = landmarks[17];

  // Calculate normal vector to palm plane
  const v1 = {
    x: indexMcp.x - wrist.x,
    y: indexMcp.y - wrist.y,
    z: indexMcp.z - wrist.z
  };
  
  const v2 = {
    x: pinkyMcp.x - wrist.x,
    y: pinkyMcp.y - wrist.y,
    z: pinkyMcp.z - wrist.z
  };

  // Cross product for normal vector
  const normal = {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x
  };

  return {
    facing: normal.z > 0 ? 'camera' : 'away',
    confidence: Math.abs(normal.z)
  };
};

const calculateFingerDistances = (landmarks, indices) => {
  const distances = {};
  const tips = [indices.THUMB_TIP, indices.INDEX_TIP, indices.MIDDLE_TIP, indices.RING_TIP, indices.PINKY_TIP];
  
  for (let i = 0; i < tips.length; i++) {
    for (let j = i + 1; j < tips.length; j++) {
      const p1 = landmarks[tips[i]];
      const p2 = landmarks[tips[j]];
      const distance = Math.sqrt(
        Math.pow(p1.x - p2.x, 2) + 
        Math.pow(p1.y - p2.y, 2) + 
        Math.pow(p1.z - p2.z, 2)
      );
      distances[`${i}_${j}`] = distance;
    }
  }
  
  return distances;
};

const calculateHandSize = (landmarks) => {
  const wrist = landmarks[0];
  const middleTip = landmarks[12];
  
  return Math.sqrt(
    Math.pow(middleTip.x - wrist.x, 2) + 
    Math.pow(middleTip.y - wrist.y, 2)
  );
};

const classifyGesture = (features) => {
  // Simple gesture classification based on finger extensions
  const extendedFingers = features.fingerExtensions
    .filter(f => f.extended)
    .map(f => f.finger);

  if (extendedFingers.length === 0) {
    return { gesture: 'fist', confidence: 0.9 };
  } else if (extendedFingers.length === 5) {
    return { gesture: 'open_hand', confidence: 0.9 };
  } else if (extendedFingers.length === 1 && extendedFingers.includes('index')) {
    return { gesture: 'pointing', confidence: 0.85 };
  } else if (extendedFingers.length === 2 && 
             extendedFingers.includes('index') && 
             extendedFingers.includes('middle')) {
    return { gesture: 'peace_sign', confidence: 0.8 };
  } else if (extendedFingers.includes('thumb')) {
    return { gesture: 'thumbs_up', confidence: 0.75 };
  }

  return { gesture: 'unknown', confidence: 0.3 };
};

const applySmoothingFilter = (currentGesture, previousGestures, windowSize = 5) => {
  if (previousGestures.length < 2) {
    return currentGesture;
  }

  // Simple majority voting in time window
  const recentGestures = previousGestures.slice(-windowSize);
  const gestureCounts = {};
  
  recentGestures.forEach(gesture => {
    gestureCounts[gesture.gesture] = (gestureCounts[gesture.gesture] || 0) + 1;
  });

  const mostCommon = Object.entries(gestureCounts)
    .sort(([,a], [,b]) => b - a)[0];

  if (mostCommon && mostCommon[1] >= windowSize * 0.6) {
    return {
      gesture: mostCommon[0],
      confidence: Math.min(0.95, currentGesture.confidence + 0.1),
      smoothed: true
    };
  }

  return currentGesture;
};

const validateGesture = (gesture) => {
  const CONFIDENCE_THRESHOLD = 0.6;
  
  if (gesture.confidence < CONFIDENCE_THRESHOLD) {
    return {
      ...gesture,
      gesture: 'uncertain',
      confidence: gesture.confidence,
      originalGesture: gesture.gesture
    };
  }

  return gesture;
};

export { extractHandFeatures, classifyGesture, applySmoothingFilter };
