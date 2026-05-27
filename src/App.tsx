import './App.css'
import FloorPlanDesigner from './components/FloorPlanDesigner'

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>3D Floor Plan Designer</h1>
        <p>Use the left panel to build walls, load materials, and shape your floor plan.</p>
      </header>
      <FloorPlanDesigner />
    </div>
  )
}

export default App
