import type { ToolStatus } from '../types'

interface StatusIndicatorProps {
  status: ToolStatus
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

export function StatusIndicator({ status }: StatusIndicatorProps) {
  return (
    <span className={`status-indicator status-indicator--${status}`} title={labelMap[status]}>
      <span
        className={`status-dot ${status}`}
        style={{ backgroundColor: colorMap[status] }}
      />
      <span className="status-indicator__label">{labelMap[status]}</span>
    </span>
  )
}
