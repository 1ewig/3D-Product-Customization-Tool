import * as THREE from 'three';

export const createTextTexture = (text, fontSize, color) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 512;

  // Clear background (transparent)
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Set font styles
  context.font = `${fontSize}px Arial`;
  context.fillStyle = color;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Draw text centered
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  
  return texture;
};
