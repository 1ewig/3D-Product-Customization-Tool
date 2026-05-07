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
- **Zustand**: Global state management with atomic subscriptions for high performance.
- **TanStack Query (React Query)**: Server state management and API synchronization.
- **Vanilla CSS**: Premium glassmorphism UI design.

### Backend
- **Node.js & Express**: API for saving and retrieving customization designs.
- **Vercel KV (Redis)**: Persistent cloud storage for production environments.
- **Local FS**: Fallback JSON-based storage for local development.

---

## ✨ Features
- **Custom Model Import**: Support for user-uploaded `.glb` models with automatic normalization and centering.
- **Dynamic Text Overlay**: Full control over text content, color, font size, and 3D transformation.
- **Logo/Image Upload**: Support for PNG/JPG uploads with automatic Base64 encoding for persistence.
- **Interactive Gizmos**: Real-time manipulation of overlays using 3D transform controls (Translate, Rotate, Scale).
- **Download Snapshot**: Export the current 3D design as a high-quality PNG image directly from the browser.
- **Saved Library**: Persistent "Design Library" to save, load, and manage your custom creations.
- **Vercel Optimized**: Fully configured for serverless deployment with persistent database storage.

---

## 📖 Technical Documentation

### 1. Advanced Decal Projection & Interaction
To ensure absolute placement accuracy across curved, multi-mesh 3D surfaces without seams clipping or high-frequency performance bottlenecks, I engineered a custom **Multi-Mesh Decal Projector with an Invisible Proxy Anchor**:
- **Dynamic Canvas Textures (Text)**: An off-screen HTML5 canvas renders the user's custom text dynamically, which is updated in-place as a `THREE.CanvasTexture` to avoid costly garbage collection and memory reallocation.
- **Invisible Proxy Anchor Pattern**: Instead of attaching `TransformControls` directly to the active decal geometry (which triggers expensive math and lag during drags), they attach to an invisible world-space proxy box. Gizmo transformations are synced back to the Zustand store, entirely decoupling interaction controls from WebGL geometry generation.
- **Multi-Mesh Portal Projector**: GLTF models are often split into discrete sub-meshes (collar, sleeves, chest, back). Standard decals disappear or clip if positioned on these seams. This system traverses the model's structure and uses React Three Fiber's `createPortal` to inject and project a Drei `<Decal>` onto *every* active sub-mesh simultaneously.
- **Local Space & Scale Normalization**: World-space coordinates are dynamically translated to each mesh's local coordinate system via `mesh.worldToLocal()`, and scales are programmatically normalized by dividing the global scale by each mesh's actual world scale (`mesh.getWorldScale()`).
- **Flickering (Z-fighting) Prevention**: Set a custom thickness depth (`0.6`) for the projection box and configured `depthTest={true}` and `depthWrite={false}` to guarantee the overlays sit perfectly flat on the mesh surface without flickering.

### 2. Technical Challenges & Solutions
- **Challenge: LocalStorage Write Congestion (Performance)**: 
  - *Problem*: Large designs with Base64 models caused 60fps jitter during slider updates because the store was writing the entire multi-megabyte state to LocalStorage on every frame.
  - *Solution*: Implemented a **Debounced Persistence Wrapper** for the Zustand storage engine, ensuring disk writes only occur after the user finishes their movement.
- **Challenge: Rendering Bottleneck with Texture Creation**:
  - *Problem*: Recreating the 2D Canvas and Texture on every text update was expensive and caused frame drops.
  - *Solution*: Optimized the system to **reuse the same Canvas and Texture object**, updating the content in-place and using the `needsUpdate` flag for high-speed rendering.
- **Challenge: Over-Subscription of Global State**:
  - *Problem*: Components destructing the entire store were re-rendering unnecessarily when unrelated properties changed.
  - *Solution*: Refactored all components to use **Atomic Selectors**, ensuring a component only re-renders if its specific piece of data changes.

### 3. State Management Strategy
I chose **Zustand** for its lightweight nature and built-in persistence middleware. This ensures that even if a user doesn't "Save to Server," their current work-in-progress is saved in their browser's LocalStorage.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/1ewig/3D-Product-Customization-Tool
cd 3D-Product-Customization-Tool
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Locally
The project uses a hybrid architecture. You need to run both the frontend and the backend API for the Library features to work locally.

**Terminal 1 (Backend API):**
Runs an Express server that handles design persistence. Locally, it saves data to a temporary JSON file.
```bash
npm run server
```

**Terminal 2 (Frontend):**
Runs the Vite development server with a proxy configured to communicate with the local backend.
```bash
npm run dev
```

The app will be available at `http://localhost:5173`. 
*Note: In local development, designs are saved to `/tmp/designs.json`.*

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
