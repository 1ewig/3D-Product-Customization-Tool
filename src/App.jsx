import './App.css'
import { SceneCanvas } from './components/canvas/SceneCanvas'
import { Configurator } from './components/ui/Configurator'

function App() {
  return (
    <div className="app-layout">
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
