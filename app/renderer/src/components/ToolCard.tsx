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
        <div className="tool-card__header-main">
          <ToolIcon
            iconKey={tool.config.icon}
            name={tool.config.name}
            command={tool.config.command}
            tags={tool.config.tags}
          />
          <div className="tool-card__title-block">
            <div className="tool-card__title-row">
              <h3 className="tool-card__name">{tool.config.name}</h3>
              {tool.config.autoStart && (
                <span className="tool-card__badge" title="Auto-starts on app launch">
                  Auto
                </span>
              )}
            </div>
            <span className="tool-card__id">{tool.config.id}</span>
          </div>
        </div>

        <StatusIndicator
          status={tool.status}
          onClick={isRunning ? undefined : handleLaunch}
          disabled={isRunning || launching}
          busy={launching}
        />
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
        <span className="tool-card__meta-label">Command</span>
        <span className="tool-card__command" title={`${tool.config.command} ${tool.config.args?.join(' ') ?? ''}`}>
          {tool.config.command}
          {tool.config.args && tool.config.args.length > 0 ? ` ${tool.config.args.join(' ')}` : ''}
        </span>
      </div>

      {error && <div className="tool-card__error">{error}</div>}

      <div className="tool-card__actions">
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
