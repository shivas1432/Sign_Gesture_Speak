import React, { useEffect, useRef } from 'react';
import { DetectedHand } from '../types';
import { drawHand } from '../utils/handLandmarks';

interface GestureOverlayProps {
  detectedHands: DetectedHand[];
  videoElement: HTMLVideoElement | null;
  className?: string;
}

export const GestureOverlay: React.FC<GestureOverlayProps> = ({
  detectedHands,
  videoElement,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || !videoElement) return;

    const updateCanvas = () => {
      if (videoElement.videoWidth && videoElement.videoHeight) {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw hands
        detectedHands.forEach(hand => {
          drawHand(ctx, hand.landmarks, canvas.width, canvas.height, hand.score);
        });
      }
      
      animationRef.current = requestAnimationFrame(updateCanvas);
    };

    updateCanvas();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [detectedHands, videoElement]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
};