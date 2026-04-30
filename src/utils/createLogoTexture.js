import * as THREE from 'three';

export const createLogoTexture = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Handle potential CORS issues
    img.src = imageUrl;

    img.onload = () => {
      // Clear background
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw image to fill the canvas
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      resolve(texture);
    };

    img.onerror = (error) => {
      reject(new Error(`Failed to load logo image: ${error}`));
    };
  });
};
