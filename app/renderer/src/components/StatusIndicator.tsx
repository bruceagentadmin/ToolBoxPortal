import type { ToolStatus } from '../types'

interface StatusIndicatorProps {
  status: ToolStatus
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const colorMap: Record<ToolStatus, string> = {
    running: '#22c55e',
    stopped: '#9ca3af',
    error: '#ef4444'
  }

  const labelMap: Record<ToolStatus, string> = {
    running: 'Running',
    stopped: 'Stopped',
    error: 'Error'
  }

  return (
    <span className="status-indicator" title={labelMap[status]}>
      <span
        className={`status-dot ${status}`}
        style={{ backgroundColor: colorMap[status] }}
      />
    </span>
  )
}
