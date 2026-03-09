import { useState, useMemo, useEffect, useRef } from 'react'
import { useTools } from './hooks/useTools'
import { ToolCard } from './components/ToolCard'
import { ToolEditor } from './components/ToolEditor'
import { TagFilter } from './components/TagFilter'
import { StatusFilter, type ToolStatusFilter } from './components/StatusFilter'
import { EmptyState } from './components/EmptyState'
import { ConfirmDialog } from './components/ConfirmDialog'
import type { ToolConfig, ToolEntry } from './types'
import './styles.css'

function App() {
  const { tools, loading, launchTool, createTool, updateTool, deleteTool } = useTools()
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingTool, setEditingTool] = useState<ToolEntry | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<ToolStatusFilter>('all')
  const hasAutoStarted = useRef(false)

  // Auto-start logic
  useEffect(() => {
    if (!loading && tools.length > 0 && !hasAutoStarted.current) {
      hasAutoStarted.current = true
      const toAutoStart = tools.filter(t => t.config.autoStart && t.status === 'stopped')
      
      if (toAutoStart.length > 0) {
        console.log(`[Frontend] Initializing auto-start for ${toAutoStart.length} tools`)
        toAutoStart.forEach(tool => {
          launchTool(tool.config.id).catch(err => {
            console.error(`Failed to auto-start ${tool.config.id}:`, err)
          })
        })
      }
    }
  }, [loading, tools, launchTool])

  // Collect unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    for (const tool of tools) {
      if (tool.config.tags) {
        for (const tag of tool.config.tags) {
          tagSet.add(tag)
        }
      }
    }
    return Array.from(tagSet).sort()
  }, [tools])

  // Filter tools by selected tag and status
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesTag = !selectedTag || (tool.config.tags && tool.config.tags.includes(selectedTag))
      const matchesStatus = selectedStatus === 'all' || tool.status === selectedStatus
      return matchesTag && matchesStatus
    })
  }, [tools, selectedTag, selectedStatus])

  const handleAddClick = () => {
    setEditingTool(null)
    setEditorOpen(true)
  }

  const handleEditClick = (tool: ToolEntry) => {
    setEditingTool(tool)
    setEditorOpen(true)
  }

  const handleDeleteClick = (toolId: string) => {
    setDeleteConfirm(toolId)
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirm) {
      await deleteTool(deleteConfirm)
      setDeleteConfirm(null)
    }
  }

  const handleSave = async (config: ToolConfig, originalId?: string) => {
    if (originalId) {
      await updateTool(originalId, config)
    } else {
      await createTool(config)
    }
    setEditorOpen(false)
    setEditingTool(null)
  }

  if (loading) {
    return (
      <div className="app">
        <div className="app__loading">Loading tools...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-left">
          <h1 className="app__title">ToolBox Portal</h1>
          <span className="app__count">{tools.length} tools</span>
        </div>
        <button className="btn btn--primary" onClick={handleAddClick}>
          + Add Tool
        </button>
      </header>

      {tools.length > 0 && (
        <div className="filters-panel">
          <StatusFilter selectedStatus={selectedStatus} onSelectStatus={setSelectedStatus} />
          {allTags.length > 0 && (
            <TagFilter tags={allTags} selectedTag={selectedTag} onSelectTag={setSelectedTag} />
          )}
        </div>
      )}

      {tools.length === 0 ? (
        <EmptyState onAdd={handleAddClick} />
      ) : filteredTools.length === 0 ? (
        <div className="empty-filter-state">
          <h2 className="empty-filter-state__title">No tools match this filter</h2>
          <p className="empty-filter-state__description">
            Try switching status or tag filters to see your tools again.
          </p>
          <div className="empty-filter-state__actions">
            <button className="btn btn--edit" onClick={() => setSelectedStatus('all')}>
              Show all statuses
            </button>
            {selectedTag && (
              <button className="btn btn--edit" onClick={() => setSelectedTag(null)}>
                Clear tag filter
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="tool-grid">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.config.id}
              tool={tool}
              onLaunch={launchTool}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {editorOpen && (
        <ToolEditor
          tool={editingTool}
          onSave={handleSave}
          onCancel={() => {
            setEditorOpen(false)
            setEditingTool(null)
          }}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${deleteConfirm}"? This will remove the tool configuration file.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  )
}

export default App
