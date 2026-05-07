# Technical Documentation & Project Journey

This document provides a deep dive into the architecture, design decisions, and technical implementation of the 3D Product Customization Tool.

---

## Project Architecture

The application follows a modern **MERN-adjacent** architecture, optimized for 3D performance and serverless scalability.

### 1. State Management Strategy (**Zustand**)
Instead of Redux, I chose **Zustand** for global state. 
- **Reasoning**: It offers a boilerplate-free API that is highly performant with React Three Fiber's render loop.
- **Atomic Subscriptions**: To maintain 60fps, I utilized selective selectors (e.g., `state => state.textContent`) across all components. This ensures that updates to the text position don't trigger re-renders in unrelated UI elements or the logo mesh.
- **Debounced Persistence**: Because the state can contain large Base64 strings, I implemented a custom debounced storage wrapper. This prevents synchronous `localStorage.setItem` calls from blocking the main thread during high-frequency slider updates.

### 2. 3D Interaction Engine (**R3F + Drei**)
The 3D scene is built using **React Three Fiber (R3F)**.
- **Model Loading**: Utilized `useGLTF` with a dynamic state-driven path. This allows users to import their own `.glb` models. The models are automatically normalized in scale and centered at the origin to ensure a consistent experience regardless of the source file's original orientation.
- **Transformation**: Integrated `TransformControls` with a custom synchronization bridge. When a user manipulates a 3D gizmo, the changes are throttled and synced back to the Zustand store, ensuring a single source of truth.
- **Exporting**: Implemented a "Snapshot" feature that extracts the WebGL buffer using `preserveDrawingBuffer`, allowing users to download their designs as PNG files.

### 3. Server State & API (**TanStack Query**)
To handle the "Saved Library," I implemented **React Query**.
- **Caching**: Designs are cached client-side, reducing redundant network requests.
- **Optimistic Updates**: The UI remains responsive while designs are being saved or deleted in the background.

---

## Technical Implementation: Multi-Mesh Decal Projection

A core challenge was applying dynamic text and logos to a complex, multi-mesh 3D clothing model accurately without distortion, seams clipping, or high-frequency performance bottlenecks.

### The Multi-Mesh Decal Projector & Invisible Proxy Anchor System
Instead of simple plane overlays or fragile single-mesh decals, I implemented a robust, professional-grade **Decal Projection with Invisible Proxy Anchor and Portals** system:

1. **Invisible Proxy Anchor Pattern**:
   * Direct manipulation of Drei's `<Decal>` geometry during gizmo dragging often triggers massive render cycles and geometry recalculation lag. 
   * To solve this, I created an invisible, non-rendering 3D proxy box in world space at the exact target coordinates. 
   * `TransformControls` attaches exclusively to this proxy anchor. As the user translates, rotates, or scales the gizmo, the coordinates are tracked and saved in the Zustand store, cleanly decoupling interaction math from WebGL geometry generation.

2. **Multi-Mesh Portal Projection**:
   * A single GLTF model (like a soccer jersey) is typically split into multiple independent sub-meshes (collar, left sleeve, right sleeve, front body, back body). Standard decals will clip or disappear if they overlap the border of these sub-meshes.
   * My solution traverses the scene to compile all active, visible meshes, ignoring helpers and wireframes.
   * Using React Three Fiber's `createPortal`, the app dynamically injects and projects a custom `<Decal>` component as a child of **each sub-mesh simultaneously**. This creates a seamless, undivided projection across stitches and mesh seams.

3. **Coordinate & Scale Normalization**:
   * Because each sub-mesh may have its own local coordinate system and scaling factors, the global world-space coordinates are mathematically normalized:
     * **Position Translation**: The global position is converted into each mesh's local space via `mesh.worldToLocal()`. The Z coordinate is locked to 0 to prevent the projection box from drifting away from the mesh core.
     * **Scale Normalization**: The global scale factor is divided by each sub-mesh's actual world scale (`mesh.getWorldScale()`), preventing stretched or shrunk decals on non-uniformly scaled sub-meshes.
     * **Projection Depth**: The decal projection box depth is set to `0.6` to ensure it cleanly slices through the outer shells of curved surface coordinates.

4. **Flickering & Z-Buffer Optimization**:
   * To prevent "Z-fighting" (flickering where the decal meets the model's base material), the decals are configured with `depthTest={true}` and `depthWrite={false}`. This guarantees that the decals are rendered cleanly on top of the base mesh material without flickering, even on low-precision rendering loops.

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

### 3. State Over-Subscription & Render Lag
**Challenge**: Initial implementation used store destructuring, causing the entire UI to re-render on every slider pixel movement.
**Solution**: Refactored the entire application to use atomic selectors and memoized components (`React.memo`), reducing the render overhead by ~80% during active manipulation.

### 4. LocalStorage Performance (The "Jitter" Problem)
**Challenge**: Large designs (4MB+) caused jitter because `persist` middleware wrote to disk on every frame.
**Solution**: Built a debounced storage proxy that throttles disk writes, decoupling the UI's visual update (60fps) from the persistence layer.

### 5. Texture Regeneration
**Challenge**: Creating new `THREE.CanvasTexture` objects on every character typed was CPU-intensive.
**Solution**: Implemented a "Reuse and Update" strategy for the text canvas, mutating the existing texture buffer instead of reallocating memory.

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
