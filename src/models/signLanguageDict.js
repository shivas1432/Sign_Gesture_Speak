// Sign Language Dictionary and Mappings
export const SIGN_LANGUAGE_DICTIONARY = {
  // Basic greetings and common phrases
  greetings: {
    "hello": { 
      gesture: "wave_hand", 
      confidence: 0.9,
      description: "Open hand wave motion",
      category: "greeting"
    },
    "goodbye": { 
      gesture: "wave_goodbye", 
      confidence: 0.85,
      description: "Wave hand with fingers moving",
      category: "greeting"
    },
    "good_morning": { 
      gesture: "good_morning_sequence", 
      confidence: 0.8,
      description: "Good followed by morning gesture",
      category: "greeting"
    }
  },

  // Politeness
  courtesy: {
    "please": { 
      gesture: "circular_chest_motion", 
      confidence: 0.8,
      description: "Circular motion over chest with flat hand",
      category: "courtesy"
    },
    "thank_you": { 
      gesture: "flat_hand_to_chin", 
      confidence: 0.85,
      description: "Flat hand moves from chin outward",
      category: "courtesy"
    },
    "sorry": { 
      gesture: "fist_circle_chest", 
      confidence: 0.8,
      description: "Fist making circular motion on chest",
      category: "courtesy"
    }
  },

  // Basic responses
  responses: {
    "yes": { 
      gesture: "fist_nod", 
      confidence: 0.9,
      description: "Fist moving up and down",
      category: "response"
    },
    "no": { 
      gesture: "index_finger_wave", 
      confidence: 0.85,
      description: "Index finger waving side to side",
      category: "response"
    }
  },

  // Numbers 0-10
  numbers: {
    "zero": { gesture: "closed_fist", confidence: 0.95, category: "number" },
    "one": { gesture: "index_finger_up", confidence: 0.95, category: "number" },
    "two": { gesture: "peace_sign", confidence: 0.9, category: "number" },
    "three": { gesture: "three_fingers", confidence: 0.9, category: "number" },
    "four": { gesture: "four_fingers", confidence: 0.85, category: "number" },
    "five": { gesture: "open_hand", confidence: 0.9, category: "number" }
  },

  // Family
  family: {
    "mother": { gesture: "thumb_to_chin", confidence: 0.8, category: "family" },
    "father": { gesture: "thumb_to_forehead", confidence: 0.8, category: "family" },
    "family": { gesture: "f_hands_circle", confidence: 0.75, category: "family" }
  }
};

export const getSignTranslation = (gestureType) => {
  for (const category of Object.values(SIGN_LANGUAGE_DICTIONARY)) {
    for (const [word, data] of Object.entries(category)) {
      if (data.gesture === gestureType) {
        return {
          word: word,
          ...data
        };
      }
    }
  }
  return null;
};

export const getAllWords = () => {
  const allWords = [];
  for (const category of Object.values(SIGN_LANGUAGE_DICTIONARY)) {
    allWords.push(...Object.keys(category));
  }
  return allWords;
};

export const getWordsByCategory = (categoryName) => {
  return SIGN_LANGUAGE_DICTIONARY[categoryName] || {};
};
