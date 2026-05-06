import { memo } from 'react'
import { useLibraryActions } from '../../hooks'

export const LibrarySidebar = memo(() => {
  const {
    designs,
    isLoading,
    handleLoadDesign,
    handleDeleteDesign,
    refreshLibrary
  } = useLibraryActions()

  return (
    <div className="library-content-area">
      <div className="section-header">
        <span>Saved Library</span>
        <button className="btn-reset" onClick={refreshLibrary}>
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="text-muted-sm">Loading library...</div>
      ) : designs?.length > 0 ? (
        <div className="library-grid">
          {designs.map((design) => (
            <div key={design.id} className="library-item">
              <button
                onClick={() => handleLoadDesign(design.id)}
                className="premium-input library-btn"
              >
                <div className="library-btn-title">Design #{design.id.slice(-4)}</div>
                <div className="library-btn-meta">
                  {new Date(design.createdAt).toLocaleDateString()}
                </div>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDesign(design.id);
                }}
                className="toolbar-btn btn-delete-item"
                title="Delete Design"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-sm italic">
          No designs saved yet.
        </div>
      )}
    </div>
  )
})

