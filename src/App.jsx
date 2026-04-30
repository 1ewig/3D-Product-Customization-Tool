import './App.css'
import { SceneCanvas } from './components/canvas/SceneCanvas'
import { Configurator, LibrarySidebar } from './components/ui'

function App() {
  return (
    <div className="app-layout">
      <LibrarySidebar />
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
