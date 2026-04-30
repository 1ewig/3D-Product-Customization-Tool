import './App.css'
import { SceneCanvas } from './components/canvas/SceneCanvas'
import { Configurator } from './components/ui'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="app-layout">
      <Toaster position="bottom-center" toastOptions={{
        style: {
          background: 'var(--bg-dark)',
          color: 'var(--text-main)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
        },
      }} />
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
