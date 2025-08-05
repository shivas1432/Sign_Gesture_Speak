import { useEffect, useRef, useState, useCallback } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { DetectedHand, GestureResult } from '../types';
import { GestureRecognizer } from '../utils/gestureRecognition';

export const useGestureRecognition = (
  videoElement: HTMLVideoElement | null,
  isActive: boolean
) => {
  const [detectedHands, setDetectedHands] = useState<DetectedHand[]>([]);
  const [currentGesture, setCurrentGesture] = useState<GestureResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const recognizerRef = useRef<GestureRecognizer | null>(null);
  const lastGestureTime = useRef<number>(0);

  useEffect(() => {
    recognizerRef.current = new GestureRecognizer();
  }, []);

  const onResults = useCallback((results: any) => {
    setDetectedHands([]);
    setCurrentGesture(null);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const hands: DetectedHand[] = results.multiHandLandmarks.map((landmarks: any, index: number) => ({
        landmarks: landmarks,
        handedness: results.multiHandedness[index]?.label || 'Unknown',
        score: results.multiHandedness[index]?.score || 0
      }));

      setDetectedHands(hands);

      // Recognize gesture for the first detected hand
      if (hands.length > 0 && recognizerRef.current) {
        const now = Date.now();
        if (now - lastGestureTime.current > 500) { // Throttle recognition
          const gesture = recognizerRef.current.recognizeGesture(hands[0].landmarks);
          if (gesture) {
            setCurrentGesture(gesture);
            lastGestureTime.current = now;
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!videoElement || !isActive) {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      return;
    }

    const initializeHands = async () => {
      try {
        setIsProcessing(true);

        handsRef.current = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        handsRef.current.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.5
        });

        handsRef.current.onResults(onResults);

        cameraRef.current = new Camera(videoElement, {
          onFrame: async () => {
            if (handsRef.current) {
              await handsRef.current.send({ image: videoElement });
            }
          },
          width: 1280,
          height: 720
        });

        await cameraRef.current.start();
        setIsProcessing(false);
      } catch (error) {
        console.error('Failed to initialize hand detection:', error);
        setIsProcessing(false);
      }
    };

    initializeHands();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, [videoElement, isActive, onResults]);

  return {
    detectedHands,
    currentGesture,
    isProcessing
  };
};