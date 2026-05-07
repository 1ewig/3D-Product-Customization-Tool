import './App.css'
import { SceneCanvas } from './components/canvas/SceneCanvas'
import { InputPanel, HandlesPanel } from './components/ui'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="app-layout">
      <Toaster 
        position="bottom-center" 
        toastOptions={{
          className: 'premium-toast',
        }} 
      />
      
      {/* Box 1: Left Container (Inputs, Colors, Product Select, Saved Designs) */}
      <div className="left-panel-container">
        <InputPanel />
      </div>

      {/* Box 2: Center Container (3D Model Preview Showcase) */}
      <div className="canvas-container">
        <SceneCanvas />
      </div>

      {/* Box 3: Right Container (Overlay Layers Selector & Transform Sliders) */}
      <div className="right-panel-container">
        <HandlesPanel />
      </div>
    </div>
  )
}

export default App
