// Accessibility Configuration for Sign Language App
export const ACCESSIBILITY_CONFIG = {
  // Visual accessibility features
  visual: {
    highContrastMode: {
      enabled: false,
      backgroundColors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        accent: '#FFFF00'
      },
      textColors: {
        primary: '#FFFFFF',
        secondary: '#000000',
        highlight: '#FFFF00'
      }
    },
    
    largeTextDisplay: {
      enabled: false,
      sizeMultiplier: 1.5,
      minimumSize: '18px',
      maximumSize: '36px'
    },
    
    gestureVisualization: {
      showHandLandmarks: true,
      showGestureTrail: true,
      highlightActiveFingers: true,
      landmarkSize: 4,
      trailOpacity: 0.7
    }
  },

  // Audio accessibility features
  audio: {
    voiceFeedback: {
      enabled: true,
      announceGestures: true,
      announceTranslations: true,
      voiceRate: 1.0,
      voicePitch: 1.0,
      preferredVoice: 'en-GB'
    },
    
    soundCues: {
      gestureDetected: true,
      translationReady: true,
      errorAlerts: true,
      volume: 0.7
    }
  },

  // Motor accessibility features
  motor: {
    gestureTimeout: 3000, // ms to hold gesture for recognition
    confidenceThreshold: 0.6,
    allowPartialGestures: true,
    gestureRepeatDelay: 1000,
    
    alternativeInputs: {
      keyboardShortcuts: true,
      voiceCommands: false,
      eyeTracking: false
    }
  },

  // Cognitive accessibility features
  cognitive: {
    gestureHints: {
      enabled: true,
      showVisualGuides: true,
      showTextInstructions: true,
      hintDisplayTime: 5000
    },
    
    simplifiedInterface: {
      enabled: false,
      hideAdvancedOptions: true,
      largerButtons: true,
      reducedAnimations: true
    },
    
    learningMode: {
      enabled: false,
      showGestureBreakdown: true,
      practiceMode: true,
      progressTracking: true
    }
  },

  // Customization options
  customization: {
    colorSchemes: [
      { name: 'default', primary: '#007bff', secondary: '#6c757d' },
      { name: 'high_contrast', primary: '#000000', secondary: '#FFFFFF' },
      { name: 'dark_mode', primary: '#1a1a1a', secondary: '#f8f9fa' },
      { name: 'colorblind_friendly', primary: '#0077be', secondary: '#f15a24' }
    ],
    
    gestureCustomization: {
      allowCustomGestures: true,
      customGestureTimeout: 5000,
      maxCustomGestures: 10
    }
  },

  // Performance considerations for accessibility
  performance: {
    reduceAnimations: false,
    lowerVideoQuality: false,
    skipFrameProcessing: 1, // Process every nth frame
    maxProcessingTime: 150 // ms
  }
};

export const applyAccessibilitySettings = (config) => {
  // Apply high contrast mode
  if (config.visual.highContrastMode.enabled) {
    document.documentElement.style.setProperty('--bg-primary', config.visual.highContrastMode.backgroundColors.primary);
    document.documentElement.style.setProperty('--text-primary', config.visual.highContrastMode.textColors.primary);
  }

  // Apply large text settings
  if (config.visual.largeTextDisplay.enabled) {
    const multiplier = config.visual.largeTextDisplay.sizeMultiplier;
    document.documentElement.style.setProperty('--text-scale', multiplier);
  }

  // Configure voice feedback
  if (config.audio.voiceFeedback.enabled) {
    // Voice feedback configuration would be applied here
  }

  return config;
};

export const getAccessibilityAnnouncement = (gesture, translation) => {
  const announcement = [];
  
  if (gesture && gesture !== 'unknown') {
    announcement.push(`Gesture detected: ${gesture.replace('_', ' ')}`);
  }
  
  if (translation) {
    announcement.push(`Translation: ${translation}`);
  }
  
  return announcement.join('. ');
};
