import * as THREE from 'three';

/**
 * Generates a CanvasTexture containing the rendered text centered.
 * 
 * @param {string} text - The text string to render
 * @param {number} fontSize - Font size in pixels
 * @param {string} color - Hex color string
 * @param {HTMLCanvasElement} [existingCanvas] - Optional canvas to reuse
 * @returns {THREE.CanvasTexture}
 */
export const createTextTexture = (text, fontSize, color, existingCanvas = null) => {
  const canvas = existingCanvas || document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Standard high-res canvas (4:1 aspect ratio)
  canvas.width = 1024;
  canvas.height = 256;

  // Clear background (transparent)
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Set text rendering properties
  context.font = `bold ${(fontSize || 48) * 2}px "Inter", "Roboto", "Arial", sans-serif`;
  context.fillStyle = color;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Soft professional drop shadow for high contrast on active patterns
  context.shadowColor = 'rgba(0,0,0,0.25)';
  context.shadowBlur = 4;
  context.shadowOffsetX = 2;
  context.shadowOffsetY = 2;

  context.fillText(text || '', canvas.width / 2, canvas.height / 2);

  if (existingCanvas) {
    return null; // Update texture in-place
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBAFormat;
  texture.needsUpdate = true;
  
  return texture;
};
