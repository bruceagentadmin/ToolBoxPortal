import type { ToolStatus } from '../types'

export type ToolStatusFilter = 'all' | ToolStatus

interface StatusFilterProps {
  selectedStatus: ToolStatusFilter
  onSelectStatus: (status: ToolStatusFilter) => void
}

const STATUS_OPTIONS: Array<{ value: ToolStatusFilter; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Not running' },
  { value: 'error', label: 'Error' },
]

export function StatusFilter({ selectedStatus, onSelectStatus }: StatusFilterProps) {
  return (
    <div className="status-filter">
      {STATUS_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`status-filter__pill ${selectedStatus === option.value ? 'status-filter__pill--active' : ''}`}
          onClick={() => onSelectStatus(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
