import { useState, useEffect } from 'react'
import type { ToolConfig, ToolEntry } from '../types'
import { ToolIcon } from './ToolIcon'
import { IconPicker } from './IconPicker'
import { autoResolveIconKey } from './icon-registry'

interface ToolEditorProps {
  tool: ToolEntry | null  // null = create mode
  onSave: (config: ToolConfig, originalId?: string) => void
  onCancel: () => void
}

const EMPTY_CONFIG: ToolConfig = {
  id: '',
  name: '',
  description: '',
  command: '',
  cwd: '',
  args: [],
  tags: [],
  env: {}
}

export function ToolEditor({ tool, onSave, onCancel }: ToolEditorProps) {
  const isEditMode = tool !== null
  const [config, setConfig] = useState<ToolConfig>(tool?.config ?? { ...EMPTY_CONFIG })
  const [argsText, setArgsText] = useState((tool?.config.args ?? []).join(', '))
  const [tagsText, setTagsText] = useState((tool?.config.tags ?? []).join(', '))
  const [envText, setEnvText] = useState(
    tool?.config.env
      ? Object.entries(tool.config.env).map(([k, v]) => `${k}=${v}`).join('\n')
      : ''
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [iconPickerOpen, setIconPickerOpen] = useState(false)
  useEffect(() => {
    if (tool) {
      setConfig(tool.config)
      setArgsText((tool.config.args ?? []).join(', '))
      setTagsText((tool.config.tags ?? []).join(', '))
      setEnvText(
        tool.config.env
          ? Object.entries(tool.config.env).map(([k, v]) => `${k}=${v}`).join('\n')
          : ''
      )
    }
  }, [tool])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!config.id.trim()) newErrors['id'] = 'ID is required'
    else if (!/^[a-z0-9-]+$/.test(config.id)) newErrors['id'] = 'ID must be kebab-case (lowercase, digits, hyphens)'
    if (!config.name.trim()) newErrors['name'] = 'Name is required'
    if (!config.description.trim()) newErrors['description'] = 'Description is required'
    if (!config.command.trim()) newErrors['command'] = 'Command is required'
    if (!config.cwd.trim()) newErrors['cwd'] = 'Working directory is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    // Parse args, tags, env from text inputs
    const args = argsText.trim() ? argsText.split(',').map((s) => s.trim()).filter(Boolean) : undefined
    const tags = tagsText.trim() ? tagsText.split(',').map((s) => s.trim()).filter(Boolean) : undefined

    let env: Record<string, string> | undefined
    if (envText.trim()) {
      env = {}
      for (const line of envText.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed) continue
        const eqIdx = trimmed.indexOf('=')
        if (eqIdx > 0) {
          env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1)
        }
      }
    }

    const finalConfig: ToolConfig = {
      ...config,
      args,
      tags,
      env
    }

    onSave(finalConfig, isEditMode ? tool.config.id : undefined)
  }

  const updateField = (field: keyof ToolConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal__title">{isEditMode ? 'Edit Tool' : 'Add Tool'}</h2>
        <form onSubmit={handleSubmit} className="tool-editor">
          {/* Icon picker trigger */}
          <div className="form-group">
            <label>Icon</label>
            <button
              type="button"
              className="icon-preview-btn"
              onClick={() => setIconPickerOpen(true)}
              title="Click to change icon"
            >
              <ToolIcon
                iconKey={config.icon}
                name={config.name}
                command={config.command}
                tags={tagsText.trim() ? tagsText.split(',').map((s) => s.trim()).filter(Boolean) : undefined}
                size={32}
              />
              <span className="icon-preview-btn__label">
                {config.icon ? 'Change icon' : 'Auto-detected — click to choose'}
              </span>
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="tool-id">ID (kebab-case)</label>
            <input
              id="tool-id"
              type="text"
              value={config.id}
              onChange={(e) => updateField('id', e.target.value)}
              disabled={isEditMode}
              placeholder="my-tool"
            />
            {errors['id'] && <span className="form-error">{errors['id']}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tool-name">Name</label>
            <input
              id="tool-name"
              type="text"
              value={config.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="My Tool"
            />
            {errors['name'] && <span className="form-error">{errors['name']}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tool-description">Description</label>
            <textarea
              id="tool-description"
              value={config.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="What does this tool do?"
              rows={2}
            />
            {errors['description'] && <span className="form-error">{errors['description']}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tool-command">Command</label>
            <input
              id="tool-command"
              type="text"
              value={config.command}
              onChange={(e) => updateField('command', e.target.value)}
              placeholder="node, python, notepad.exe, etc."
            />
            {errors['command'] && <span className="form-error">{errors['command']}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tool-cwd">Working Directory</label>
            <input
              id="tool-cwd"
              type="text"
              value={config.cwd}
              onChange={(e) => updateField('cwd', e.target.value)}
              placeholder="D:\path\to\tool"
            />
            {errors['cwd'] && <span className="form-error">{errors['cwd']}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tool-args">Arguments (comma-separated)</label>
            <input
              id="tool-args"
              type="text"
              value={argsText}
              onChange={(e) => setArgsText(e.target.value)}
              placeholder="server.js, --port, 3000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tool-tags">Tags (comma-separated)</label>
            <input
              id="tool-tags"
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="web, backend, utility"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tool-env">Environment Variables (KEY=VALUE per line)</label>
            <textarea
              id="tool-env"
              value={envText}
              onChange={(e) => setEnvText(e.target.value)}
              placeholder={"PORT=3000\nNODE_ENV=development"}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tool-process-name">Process Name (optional, for monitoring)</label>
            <input
              id="tool-process-name"
              type="text"
              value={config.processName ?? ''}
              onChange={(e) => updateField('processName', e.target.value)}
              placeholder="node.exe"
            />
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn--save">
              {isEditMode ? 'Save Changes' : 'Create Tool'}
            </button>
          </div>
        </form>
      </div>
      {iconPickerOpen && (
        <IconPicker
          currentIcon={config.icon || autoResolveIconKey(config.name, config.command,
            tagsText.trim() ? tagsText.split(',').map((s) => s.trim()).filter(Boolean) : undefined
          )}
          onSelect={(iconKey) => {
            setConfig((prev) => ({ ...prev, icon: iconKey }))
          }}
          onClose={() => setIconPickerOpen(false)}
        />
      )}
    </div>
  )
}
