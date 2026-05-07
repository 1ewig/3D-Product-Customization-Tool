import * as THREE from 'three';

/**
 * Generates a CanvasTexture containing the rendered text.
 * @param {string} text - The text to render
 * @param {number} fontSize - Font size in pixels
 * @param {string} color - Hex color string
 * @param {HTMLCanvasElement} [existingCanvas] - Optional canvas to reuse
 * @returns {THREE.CanvasTexture}
 */
export const createTextTexture = (text, fontSize, color, existingCanvas = null) => {
  const canvas = existingCanvas || document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // High-res canvas for crisp text
  canvas.width = 1024;
  canvas.height = 512;

  // Clear background (transparent)
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Set font styles - Using a more professional font stack
  context.font = `bold ${fontSize * 2}px "Inter", "Roboto", "Arial", sans-serif`;
  context.fillStyle = color;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Draw text centered with slight shadow for better visibility
  context.shadowColor = 'rgba(0,0,0,0.2)';
  context.shadowBlur = 4;
  context.shadowOffsetX = 2;
  context.shadowOffsetY = 2;
  
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  if (existingCanvas) {
    return null; // When updating, we don't need to return a new texture
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBAFormat;
  texture.needsUpdate = true;
  
  return texture;
};

