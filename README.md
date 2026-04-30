# 👕 3D Product Customization Tool

A high-performance, web-based 3D customization module for clothing models. This project allows users to apply dynamic text and logo overlays onto a 3D jersey model with real-time control over positioning, scaling, and orientation.

Built as a technical assessment for the **MERN Stack Developer (Three.js)** position.

---

## 🚀 Live Demo
https://3-d-product-customization-tool.vercel.app/

## 🛠️ Tech Stack

### Frontend
- **React.js**: UI and Component architecture.
- **Three.js / React Three Fiber**: 3D rendering engine and scene management.
- **React Three Drei**: Helper components for 3D interactions (OrbitControls, TransformControls, useGLTF).
- **Zustand**: Global state management with LocalStorage persistence.
- **TanStack Query (React Query)**: Server state management and API synchronization.
- **Vanilla CSS**: Premium glassmorphism UI design.

### Backend
- **Node.js & Express**: API for saving and retrieving customization designs.
- **Vercel KV (Redis)**: Persistent cloud storage for production environments.
- **Local FS**: Fallback JSON-based storage for local development.

---

## ✨ Features
- **3D Clothing Model**: Loading and rendering of GLB clothing models.
- **Dynamic Text Overlay**: Full control over text content, color, font size, and 3D transformation.
- **Logo/Image Upload**: Support for PNG/JPG uploads with automatic Base64 encoding for persistence.
- **Interactive Gizmos**: Real-time manipulation of overlays using 3D transform controls (Translate, Rotate, Scale).
- **Saved Library**: Persistent "Design Library" to save, load, and manage your custom creations.
- **Vercel Optimized**: Fully configured for serverless deployment with persistent database storage.

---

## 📖 Technical Documentation

### 1. Approach to Texture Mapping
To ensure "placement accuracy without distortion" as required by the assessment, I implemented a **Dynamic Canvas Texture** approach:
- **Text**: A 2D off-screen canvas renders the user's text and is converted into a `THREE.CanvasTexture`.
- **Logo**: Uploaded images are mapped as `THREE.Texture` with transparency support.
- **Placement**: Instead of standard decals, I utilized **Floating Plane Meshes** with a calculated **Polygon Offset**. This prevents Z-fighting and ensures the overlays remain visible and sharp against the complex geometry of the clothing model while allowing for pixel-perfect interactive manipulation.

### 2. Challenges & Solutions
- **Challenge: Image Persistence on Page Refresh**: 
  - *Problem*: Using temporary Blob URLs caused images to disappear after a page refresh.
  - *Solution*: Implemented a `FileReader` logic to convert uploaded files into **Base64 strings**. This allows the actual image data to be stored in the design JSON, making it fully persistent across sessions and database reloads.
- **Challenge: Ephemeral Filesystem on Vercel**: 
  - *Problem*: Standard Node.js `fs` operations reset on Vercel serverless functions.
  - *Solution*: Integrated **Vercel KV (Redis)**. I built a hybrid storage utility that detects the environment and switches from the local filesystem to a cloud Redis store automatically when deployed.
- **Challenge: Decal Component Instability**:
  - *Problem*: Initial attempts to use the `@react-three/drei` Decal component resulted in visual glitches (texture flickering) and conflicts with the camera's Raycaster during interactive transformation.
  - *Solution*: Pivoted to a custom **Mesh Overlay** system using `polygonOffset`. This provided superior stability, guaranteed no Z-fighting, and allowed for more reliable coordinate tracking during real-time dragging.

### 3. State Management Strategy
I chose **Zustand** for its lightweight nature and built-in persistence middleware. This ensures that even if a user doesn't "Save to Server," their current work-in-progress is saved in their browser's LocalStorage.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone [your-repo-link]
cd 3D-Product-Customization-Tool
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Locally
You will need two terminals open:

**Terminal 1 (Backend API):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📦 Deployment on Vercel
This project is pre-configured for Vercel. 
1. Push your code to GitHub.
2. Connect the repo to Vercel.
3. In the Vercel Dashboard, add a **KV (Redis)** database via the Storage tab.
4. Redeploy to sync environment variables.

---

**Candidate**: Asad Ali  
**Position**: MERN Stack Developer (Three.js Implementation)
