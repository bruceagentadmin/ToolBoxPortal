import { useState } from 'react'
import type { ToolEntry } from '../types'
import { StatusIndicator } from './StatusIndicator'
import { ToolIcon } from './ToolIcon'

interface ToolCardProps {
  tool: ToolEntry
  onLaunch: (toolId: string) => Promise<{ success: boolean; error?: string }>
  onEdit: (tool: ToolEntry) => void
  onDelete: (toolId: string) => void
}

export function ToolCard({ tool, onLaunch, onEdit, onDelete }: ToolCardProps) {
  const [launching, setLaunching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLaunch = async () => {
    setError(null)
    setLaunching(true)
    try {
      const result = await onLaunch(tool.config.id)
      if (!result.success) {
        setError(result.error ?? 'Launch failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Launch failed')
    } finally {
      setLaunching(false)
    }
  }

  const isRunning = tool.status === 'running'

  return (
    <div 
      className={`tool-card ${isRunning ? 'tool-card--running' : ''}`}
      style={tool.config.tabColor ? { borderLeft: `4px solid ${tool.config.tabColor}` } : {}}
    >
      <div className="tool-card__header">
        <div 
          className="status-indicator" 
          style={tool.config.tabColor ? { color: tool.config.tabColor, marginRight: '-4px' } : {}}
        >
          <StatusIndicator status={tool.status} />
        </div>
        <ToolIcon
          iconKey={tool.config.icon}
          name={tool.config.name}
          command={tool.config.command}
          tags={tool.config.tags}
        />
        <h3 className="tool-card__name">
          {tool.config.name}
          {tool.config.autoStart && (
            <span 
              title="Auto-starts on app launch" 
              style={{ 
                fontSize: '0.7rem', 
                background: 'rgba(79, 140, 255, 0.2)', 
                color: '#4f8cff',
                padding: '2px 6px',
                borderRadius: '4px',
                marginLeft: '8px',
                verticalAlign: 'middle',
                fontWeight: 'normal'
              }}
            >
              Auto
            </span>
          )}
        </h3>
        <span className="tool-card__id">{tool.config.id}</span>
      </div>

      <p className="tool-card__description">{tool.config.description}</p>

      {tool.config.tags && tool.config.tags.length > 0 && (
        <div className="tool-card__tags">
          {tool.config.tags.map((tag) => (
            <span key={tag} className="tool-card__tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="tool-card__meta">
        <span className="tool-card__command" title={`${tool.config.command} ${tool.config.args?.join(' ') ?? ''}`}>
          {tool.config.command}
        </span>
        <span className="tool-card__cwd" title={tool.config.cwd}>
          {tool.config.cwd}
        </span>
      </div>

      {error && <div className="tool-card__error">{error}</div>}

      <div className="tool-card__actions">
        <button
          className={`btn btn--launch ${isRunning ? 'btn--disabled' : ''}`}
          onClick={handleLaunch}
          disabled={isRunning || launching}
        >
          {launching ? 'Starting...' : isRunning ? 'Running' : 'Launch'}
        </button>
        <button className="btn btn--edit" onClick={() => onEdit(tool)}>
          Edit
        </button>
        <button className="btn btn--delete" onClick={() => onDelete(tool.config.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}
