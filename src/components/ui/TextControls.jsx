import { useCustomizationStore } from '../../store/useCustomizationStore'
import { LogoControls } from './LogoControls'

export const TextControls = () => {
  const {
    textContent,
    textColor,
    fontSize,
    textPosition,
    textRotation,
    textScale,
    setTextContent,
    setTextColor,
    setFontSize,
    setTextPosition,
    setTextRotation,
    setTextScale
  } = useCustomizationStore()

  const panelStyle = {
    position: 'fixed',
    right: 0,
    top: 0,
    height: '100vh',
    width: '280px',
    background: '#1a1a1a',
    color: 'white',
    padding: '16px',
    overflowY: 'auto',
    boxSizing: 'border-box'
  }

  const controlStyle = {
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column'
  }

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 'bold'
  }

  const resetButtonStyle = {
    background: '#444',
    color: '#ccc',
    border: 'none',
    borderRadius: '3px',
    fontSize: '10px',
    padding: '2px 6px',
    cursor: 'pointer',
    marginLeft: 'auto'
  }

  return (
    <div style={panelStyle}>
      <h2 style={{ marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '12px' }}>Text Overlay</h2>

      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <label style={labelStyle}>Text Input</label>
          <button style={resetButtonStyle} onClick={() => setTextContent('')}>Reset</button>
        </div>
        <input 
          type="text" 
          value={textContent} 
          onChange={(e) => setTextContent(e.target.value)}
          style={{ padding: '8px', boxSizing: 'border-box', width: '100%' }}
        />
      </div>

      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <label style={labelStyle}>Color</label>
          <button style={resetButtonStyle} onClick={() => setTextColor('#ffffff')}>Reset</button>
        </div>
        <input 
          type="color" 
          value={textColor} 
          onChange={(e) => setTextColor(e.target.value)} 
          style={{ width: '100%', height: '40px', cursor: 'pointer', padding: 0, border: 'none' }}
        />
      </div>

      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <label style={labelStyle}>Font Size: {fontSize}</label>
          <button style={resetButtonStyle} onClick={() => setFontSize(48)}>Reset</button>
        </div>
        <input 
          type="number" 
          min="12" 
          max="120" 
          value={fontSize} 
          onChange={(e) => setFontSize(Number(e.target.value))}
          style={{ padding: '8px', boxSizing: 'border-box', width: '100%' }}
        />
      </div>

      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <label style={labelStyle}>X Position: {textPosition.x}</label>
          <button style={resetButtonStyle} onClick={() => setTextPosition({ ...textPosition, x: 0 })}>Reset</button>
        </div>
        <input 
          type="range" 
          min="-1" 
          max="1" 
          step="0.01" 
          value={textPosition.x} 
          onChange={(e) => setTextPosition({ ...textPosition, x: parseFloat(e.target.value) })} 
          style={{ width: '100%' }}
        />
      </div>

      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <label style={labelStyle}>Y Position: {textPosition.y}</label>
          <button style={resetButtonStyle} onClick={() => setTextPosition({ ...textPosition, y: 0 })}>Reset</button>
        </div>
        <input 
          type="range" 
          min="-1" 
          max="1" 
          step="0.01" 
          value={textPosition.y} 
          onChange={(e) => setTextPosition({ ...textPosition, y: parseFloat(e.target.value) })} 
          style={{ width: '100%' }}
        />
      </div>

      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <label style={labelStyle}>Rotation: {textRotation}</label>
          <button style={resetButtonStyle} onClick={() => setTextRotation(0)}>Reset</button>
        </div>
        <input 
          type="range" 
          min="-3.14" 
          max="3.14" 
          step="0.01" 
          value={textRotation} 
          onChange={(e) => setTextRotation(parseFloat(e.target.value))} 
          style={{ width: '100%' }}
        />
      </div>

      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <label style={labelStyle}>Scale: {textScale}</label>
          <button style={resetButtonStyle} onClick={() => setTextScale(1)}>Reset</button>
        </div>
        <input 
          type="range" 
          min="0.1" 
          max="3" 
          step="0.1" 
          value={textScale} 
          onChange={(e) => setTextScale(parseFloat(e.target.value))} 
          style={{ width: '100%' }}
        />
      </div>
      <LogoControls />
    </div>
  )
}
