import './App.css'
import { SceneCanvas } from './components/canvas/SceneCanvas'
import { TextControls } from './components/ui/TextControls'

function App() {
  return (
    <div className="app-layout">
      <div className="canvas-container">
        <SceneCanvas />
      </div>
      <div className="ui-container glass-panel">
        <TextControls />
      </div>
    </div>
  )
}

export default App
