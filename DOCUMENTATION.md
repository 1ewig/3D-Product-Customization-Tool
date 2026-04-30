# Technical Documentation & Project Journey

This document provides a deep dive into the architecture, design decisions, and technical implementation of the 3D Product Customization Tool.

---

## Project Architecture

The application follows a modern **MERN-adjacent** architecture, optimized for 3D performance and serverless scalability.

### 1. State Management Strategy (**Zustand**)
Instead of Redux, I chose **Zustand** for global state. 
- **Reasoning**: It offers a boilerplate-free API that is highly performant with React Three Fiber's render loop.
- **Persistence**: Used the `persist` middleware to ensure the user's work-in-progress survives browser refreshes via LocalStorage.

### 2. 3D Interaction Engine (**R3F + Drei**)
The 3D scene is built using **React Three Fiber (R3F)**.
- **Model Loading**: Utilized `useGLTF` with a dynamic state-driven path switcher. This allows users to swap between different mesh versions (Draft vs. High-Detail) without losing their customization overlays. All models are pre-loaded to ensure zero latency during switching.
- **Transformation**: Integrated `TransformControls` with a custom synchronization bridge. When a user manipulates a 3D gizmo, the changes are throttled and synced back to the Zustand store, ensuring a single source of truth.
- **Exporting**: Implemented a "Snapshot" feature that extracts the WebGL buffer using `preserveDrawingBuffer`, allowing users to download their designs as PNG files.

### 3. Server State & API (**TanStack Query**)
To handle the "Saved Library," I implemented **React Query**.
- **Caching**: Designs are cached client-side, reducing redundant network requests.
- **Optimistic Updates**: The UI remains responsive while designs are being saved or deleted in the background.

---

## Technical Implementation: Texture Mapping

A core challenge was applying dynamic text and logos to a complex 3D mesh accurately.

### The "Floating Mesh" Approach
While `Decal` components are standard, they often suffer from projection glitches on high-curvature meshes. I implemented a more stable **Custom Plane Overlay** system:
- **Canvas Textures**: Text is rendered to a hidden 2D HTML5 Canvas, then uploaded as a `THREE.CanvasTexture`.
- **Z-Buffer Optimization**: To prevent "Z-fighting" (flickering where the overlay meets the shirt), I utilized `polygonOffset` in the Three.js materials. This mathematically pushes the overlay forward in the depth buffer without physically moving its 3D position.

---

## Backend & Persistence

### Hybrid Storage System
Since the project is deployed on **Vercel**, which uses a read-only serverless filesystem, a standard `designs.json` file wouldn't work.
- **Local Dev**: Uses `fs` to write to a local JSON file.
- **Production**: Automatically detects the Vercel environment and switches to **Vercel KV (Redis)**.
- **Data Handling**: Large images are converted to **Base64** strings before being stored, ensuring the entire design configuration is self-contained and portable.

---

## The Journey: Technical Challenges Faced

### 1. The "Refresh" Problem
**Challenge**: Initially, uploaded logos used `URL.createObjectURL`, which invalidated on refresh.
**Solution**: I refactored the upload pipeline to use `FileReader` and Base64 encoding. This increased the JSON payload size slightly but guaranteed 100% data persistence.

### 2. Gizmo Conflict & Camera Management
**Challenge**: `OrbitControls` (camera movement) and `TransformControls` (object movement) often fight for mouse input.
**Solution**: Implemented event listeners on the Transform Gizmo. When a user starts dragging a logo, the camera rotation is programmatically disabled to prevent the scene from spinning while the user is trying to be precise.

### 3. Transform Gizmo Synchronization
**Challenge**: Manipulating a mesh in a 3D Canvas does not automatically update the application's React state.
**Solution**: Developed a synchronization bridge that "pulls" the latest translation, rotation, and scale data from the Three.js mesh and "pushes" it into the Zustand store using throttled callbacks, maintaining a unified state across the app.

### 4. Asynchronous Texture Loading
**Challenge**: Loading a saved design could result in "empty" overlays if the mesh rendered before the Base64 image texture was fully processed.
**Solution**: Implemented an async loading pattern with `THREE.TextureLoader` and React lifecycle hooks to ensure overlays only display once the texture is ready, preventing visual flickering during library navigation.

### 5. Interaction Raycasting & Filtering
**Challenge**: Standard pointer events on a 3D canvas can be ambiguous, potentially selecting the background shirt when the user intends to select an overlay.
**Solution**: Targeted specific mesh references for the `TransformControls` and used the `onPointerMissed` handler to manage clean de-selection, providing a polished, professional interaction model.

---

## Third-Party Libraries
- **Three.js**: The core 3D engine.
- **React-Three-Fiber**: React bridge for Three.js.
- **Zustand**: State management.
- **Express**: Backend API framework.
- **@vercel/kv**: Cloud Redis client.
- **React-Hot-Toast**: Elegant UI notifications.

---

**Asad Ali**  
*MERN Stack Developer*  
*React web developer using AI to accelerate the development process*
