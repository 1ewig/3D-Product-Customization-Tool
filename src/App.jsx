import './App.css'
import { SceneCanvas } from './components/canvas/SceneCanvas'
import { Configurator } from './components/ui'
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
      <div className="canvas-container">
        <SceneCanvas />
      </div>
      <div className="ui-container">
        <Configurator />
      </div>
    </div>
  )
}

export default App
