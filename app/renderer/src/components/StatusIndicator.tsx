import type { ToolStatus } from '../types'

interface StatusIndicatorProps {
  status: ToolStatus
  onClick?: () => void
  disabled?: boolean
  busy?: boolean
}

const colorMap: Record<ToolStatus, string> = {
  running: '#22c55e',
  stopped: '#9ca3af',
  error: '#ef4444'
}

const labelMap: Record<ToolStatus, string> = {
  running: 'Running',
  stopped: 'Not running',
  error: 'Error'
}

export function StatusIndicator({ status, onClick, disabled = false, busy = false }: StatusIndicatorProps) {
  const isInteractive = Boolean(onClick) && !disabled

  return (
    <button
      type="button"
      className={`status-indicator status-indicator--${status} ${isInteractive ? 'status-indicator--interactive' : ''}`}
      title={labelMap[status]}
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className={`status-dot ${status} ${busy ? 'is-busy' : ''}`}
        style={{ backgroundColor: colorMap[status] }}
      />
      <span className="status-indicator__label">{busy ? 'Starting…' : labelMap[status]}</span>
    </button>
  )
}
