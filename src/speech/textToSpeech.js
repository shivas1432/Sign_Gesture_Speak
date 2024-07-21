// Text-to-Speech Engine for Sign Language Translation
class TextToSpeech {
  constructor() {
    this.voices = [];
    this.selectedVoice = null;
    this.isSupported = 'speechSynthesis' in window;
    this.queue = [];
    this.speaking = false;
    
    if (this.isSupported) {
      this.loadVoices();
    }
  }

  loadVoices() {
    this.voices = speechSynthesis.getVoices();
    
    // Prefer UK English voices
    this.selectedVoice = this.voices.find(voice => 
      voice.lang.startsWith('en-GB') || voice.name.includes('British')
    ) || this.voices.find(voice => 
      voice.lang.startsWith('en')
    ) || this.voices[0];

    // Handle voice loading on some browsers
    if (this.voices.length === 0) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        this.loadVoices();
      });
    }
  }

  speak(text, options = {}) {
    if (!this.isSupported) {
      console.warn('Speech synthesis not supported');
      return Promise.reject('Speech synthesis not supported');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure speech parameters
      utterance.voice = options.voice || this.selectedVoice;
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      utterance.lang = options.lang || 'en-GB';

      // Event handlers
      utterance.onstart = () => {
        this.speaking = true;
        console.log(`🔊 Speaking: "${text}"`);
      };

      utterance.onend = () => {
        this.speaking = false;
        resolve();
        this.processQueue();
      };

      utterance.onerror = (event) => {
        this.speaking = false;
        console.error('Speech synthesis error:', event.error);
        reject(event.error);
        this.processQueue();
      };

      // Add to queue or speak immediately
      if (this.speaking) {
        this.queue.push(utterance);
      } else {
        speechSynthesis.speak(utterance);
      }
    });
  }

  processQueue() {
    if (this.queue.length > 0 && !this.speaking) {
      const nextUtterance = this.queue.shift();
      speechSynthesis.speak(nextUtterance);
    }
  }

  stop() {
    speechSynthesis.cancel();
    this.queue = [];
    this.speaking = false;
  }

  pause() {
    speechSynthesis.pause();
  }

  resume() {
    speechSynthesis.resume();
  }

  getAvailableVoices() {
    return this.voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      gender: this.detectGender(voice.name),
      isDefault: voice.default
    }));
  }

  setVoice(voiceName) {
    const voice = this.voices.find(v => v.name === voiceName);
    if (voice) {
      this.selectedVoice = voice;
      return true;
    }
    return false;
  }

  detectGender(voiceName) {
    const femaleIndicators = ['female', 'woman', 'karen', 'samantha', 'susan', 'victoria'];
    const maleIndicators = ['male', 'man', 'daniel', 'alex', 'tom', 'david'];
    
    const lowerName = voiceName.toLowerCase();
    
    if (femaleIndicators.some(indicator => lowerName.includes(indicator))) {
      return 'female';
    } else if (maleIndicators.some(indicator => lowerName.includes(indicator))) {
      return 'male';
    }
    
    return 'unknown';
  }
}

module.exports = TextToSpeech;
