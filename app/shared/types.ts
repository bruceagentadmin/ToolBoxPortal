export interface ToolConfig {
  id: string
  name: string
  description: string
  command: string
  cwd: string
  args?: string[]
  icon?: string
  tags?: string[]
  env?: Record<string, string>
  processName?: string
}

export type ToolStatus = 'stopped' | 'running' | 'error'

export interface ToolEntry {
  config: ToolConfig
  status: ToolStatus
  errorMessage?: string
}
