import * as THREE from 'three';

/**
 * Generates a CanvasTexture containing the rendered text and optional player number.
 * 
 * @param {string} text - The player/team name to render
 * @param {string} number - The player number to render
 * @param {number} fontSize - Font size in pixels
 * @param {string} color - Hex color string
 * @param {HTMLCanvasElement} [existingCanvas] - Optional canvas to reuse
 * @returns {THREE.CanvasTexture}
 */
export const createTextTexture = (text, number, fontSize, color, existingCanvas = null) => {
  const canvas = existingCanvas || document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Standard high-res canvas (4:1 aspect ratio)
  canvas.width = 1024;
  canvas.height = 256;

  // Clear background (transparent)
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Set shared font properties
  context.fillStyle = color;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Soft drop shadow for crisp visibility on colored shirts
  context.shadowColor = 'rgba(0,0,0,0.25)';
  context.shadowBlur = 4;
  context.shadowOffsetX = 2;
  context.shadowOffsetY = 2;

  const fontStack = '"Inter", "Roboto", "Arial", sans-serif';

  // Render text depending on active inputs
  if (text && number) {
    // Dual Render: Player Name at top, Player Number below (Jersey Layout!)
    const nameDrawSize = Math.floor((fontSize || 48) * 1.3);
    context.font = `bold ${nameDrawSize}px ${fontStack}`;
    context.fillText(text.toUpperCase(), canvas.width / 2, 75);

    const numberDrawSize = Math.floor((fontSize || 48) * 2.5);
    context.font = `900 ${numberDrawSize}px ${fontStack}`; // Ultra-bold
    context.fillText(number, canvas.width / 2, 180);
  } else if (text) {
    // Single Render: Name only (centered)
    const textDrawSize = Math.floor((fontSize || 48) * 2);
    context.font = `bold ${textDrawSize}px ${fontStack}`;
    context.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
  } else if (number) {
    // Single Render: Number only (centered, slightly scaled up)
    const numberDrawSize = Math.floor((fontSize || 48) * 2.8);
    context.font = `900 ${numberDrawSize}px ${fontStack}`;
    context.fillText(number, canvas.width / 2, canvas.height / 2);
  }

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
