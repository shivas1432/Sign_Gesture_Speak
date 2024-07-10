import { HandLandmark } from '../types';

export const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // Index
  [0, 9], [9, 10], [10, 11], [11, 12], // Middle
  [0, 13], [13, 14], [14, 15], [15, 16], // Ring
  [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [5, 9], [9, 13], [13, 17] // Palm
];

export const drawHand = (
  ctx: CanvasRenderingContext2D,
  landmarks: HandLandmark[],
  width: number,
  height: number,
  confidence: number
) => {
  if (!landmarks || landmarks.length === 0) return;

  // Draw connections
  ctx.strokeStyle = `rgba(59, 130, 246, ${confidence})`;
  ctx.lineWidth = 2;
  ctx.beginPath();

  HAND_CONNECTIONS.forEach(([start, end]) => {
    const startPoint = landmarks[start];
    const endPoint = landmarks[end];
    
    if (startPoint && endPoint) {
      ctx.moveTo(startPoint.x * width, startPoint.y * height);
      ctx.lineTo(endPoint.x * width, endPoint.y * height);
    }
  });
  ctx.stroke();

  // Draw landmarks
  landmarks.forEach((landmark, index) => {
    const x = landmark.x * width;
    const y = landmark.y * height;
    
    ctx.beginPath();
    ctx.arc(x, y, index === 0 ? 6 : 4, 0, 2 * Math.PI);
    ctx.fillStyle = index === 0 ? '#ef4444' : `rgba(139, 92, 246, ${confidence})`;
    ctx.fill();
  });
};

export const calculateHandBoundingBox = (landmarks: HandLandmark[]) => {
  if (!landmarks || landmarks.length === 0) return null;

  const xs = landmarks.map(l => l.x);
  const ys = landmarks.map(l => l.y);
  
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys)
  };
};