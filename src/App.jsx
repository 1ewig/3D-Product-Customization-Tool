import './App.css'
import { SceneCanvas } from './components/canvas/SceneCanvas'
import { TextControls } from './components/ui/TextControls'

function App() {
  return (
    <div className="app-container" style={{ display: 'flex' }}>
      <div style={{ width: 'calc(100vw - 280px)', height: '100vh', position: 'relative' }}>
        <SceneCanvas />
      </div>
      <TextControls />
    </div>
  )
}

export default App
