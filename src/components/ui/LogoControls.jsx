import { useCustomizationStore } from '../../store/useCustomizationStore'

export const LogoControls = () => {
  const {
    logoUrl,
    logoPosition,
    logoRotation,
    logoScale,
    setLogoUrl,
    setLogoPosition,
    setLogoRotation,
    setLogoScale
  } = useCustomizationStore()

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLogoUrl(url)
      // Reset the input value so the same file can be uploaded again if removed
      e.target.value = ''
    }
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
    <div style={{ borderTop: '1px solid #444', paddingTop: '16px', marginTop: '24px' }}>
      <h2 style={{ marginTop: 0, paddingBottom: '12px', color: 'white' }}>Logo / Image</h2>

      <div style={controlStyle}>
        <label style={labelStyle}>Upload Image</label>
        <input 
          type="file" 
          accept="image/png, image/jpeg" 
          onChange={handleImageUpload}
          style={{ width: '100%' }}
        />
        {logoUrl && (
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={logoUrl} 
              alt="Logo preview" 
              style={{ maxWidth: '80px', maxHeight: '80px', display: 'block' }} 
            />
            <button 
              onClick={() => setLogoUrl(null)}
              style={{ 
                background: '#ff4444', 
                color: 'white', 
                border: 'none', 
                padding: '4px 8px', 
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <label style={labelStyle}>X Position: {logoPosition.x}</label>
          <button style={resetButtonStyle} onClick={() => setLogoPosition({ ...logoPosition, x: 0 })}>Reset</button>
        </div>
        <input 
          type="range" 
          min="-1" 
          max="1" 
          step="0.01" 
          value={logoPosition.x} 
          onChange={(e) => setLogoPosition({ ...logoPosition, x: parseFloat(e.target.value) })} 
          style={{ width: '100%' }}
        />
      </div>

      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <label style={labelStyle}>Y Position: {logoPosition.y}</label>
          <button style={resetButtonStyle} onClick={() => setLogoPosition({ ...logoPosition, y: 0 })}>Reset</button>
        </div>
        <input 
          type="range" 
          min="-1" 
          max="1" 
          step="0.01" 
          value={logoPosition.y} 
          onChange={(e) => setLogoPosition({ ...logoPosition, y: parseFloat(e.target.value) })} 
          style={{ width: '100%' }}
        />
      </div>

      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <label style={labelStyle}>Rotation: {logoRotation}</label>
          <button style={resetButtonStyle} onClick={() => setLogoRotation(0)}>Reset</button>
        </div>
        <input 
          type="range" 
          min="-3.14" 
          max="3.14" 
          step="0.01" 
          value={logoRotation} 
          onChange={(e) => setLogoRotation(parseFloat(e.target.value))} 
          style={{ width: '100%' }}
        />
      </div>

      <div style={controlStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <label style={labelStyle}>Scale: {logoScale}</label>
          <button style={resetButtonStyle} onClick={() => setLogoScale(1)}>Reset</button>
        </div>
        <input 
          type="range" 
          min="0.1" 
          max="3" 
          step="0.1" 
          value={logoScale} 
          onChange={(e) => setLogoScale(parseFloat(e.target.value))} 
          style={{ width: '100%' }}
        />
      </div>
    </div>
  )
}
