import { ipcMain, BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../shared/ipc-channels'
import type { ToolConfig, ToolEntry } from '../shared/types'
import { ToolRegistry } from './registry'
import { LauncherEngine } from './launcher'
import { ProcessMonitor } from './monitor'

export function registerIpcHandlers(
  registry: ToolRegistry,
  launcher: LauncherEngine,
  monitor: ProcessMonitor
): void {
  // GET_TOOLS: return tool list with status
  ipcMain.handle(IPC_CHANNELS.GET_TOOLS, (): ToolEntry[] => {
    const tools = registry.getTools()
    return tools.map((config) => {
      const isRunning = monitor.isTracked(config.id)
      return {
        config,
        status: isRunning ? 'running' : 'stopped',
      } satisfies ToolEntry
    })
  })

  // LAUNCH_TOOL: launch a tool by id
  ipcMain.handle(IPC_CHANNELS.LAUNCH_TOOL, async (_event, toolId: string): Promise<{ success: boolean; error?: string }> => {
    const config = registry.getToolById(toolId)
    if (!config) {
      return { success: false, error: `Tool "${toolId}" not found` }
    }

    if (monitor.isTracked(toolId)) {
      return { success: false, error: `Tool "${toolId}" is already running` }
    }

    try {
      const { pid, startTime } = await launcher.launchTool(config)
      monitor.trackProcess(toolId, pid, startTime)
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message }
    }
  })

  // CREATE_TOOL: create a new tool config
  ipcMain.handle(IPC_CHANNELS.CREATE_TOOL, async (_event, config: ToolConfig): Promise<{ success: boolean; error?: string }> => {
    try {
      const existing = registry.getToolById(config.id)
      if (existing) {
        return { success: false, error: `Tool with ID "${config.id}" already exists` }
      }
      await registry.createToolConfig(config)
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message }
    }
  })

  // UPDATE_TOOL: update existing tool config
  ipcMain.handle(IPC_CHANNELS.UPDATE_TOOL, async (_event, id: string, config: ToolConfig): Promise<{ success: boolean; error?: string }> => {
    try {
      await registry.updateToolConfig(id, config)
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message }
    }
  })

  // DELETE_TOOL: delete tool config
  ipcMain.handle(IPC_CHANNELS.DELETE_TOOL, async (_event, id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await registry.deleteToolConfig(id)
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message }
    }
  })

  // Forward monitor status changes to renderer
  monitor.on('status-changed', (data: { toolId: string; status: string }) => {
    const windows = BrowserWindow.getAllWindows()
    for (const win of windows) {
      win.webContents.send(IPC_CHANNELS.TOOL_STATUS_CHANGED, data)
    }
  })

  // Forward registry changes to renderer
  const forwardRegistryEvent = (): void => {
    const windows = BrowserWindow.getAllWindows()
    for (const win of windows) {
      win.webContents.send(IPC_CHANNELS.TOOLS_UPDATED)
    }
  }

  registry.on('tool-added', forwardRegistryEvent)
  registry.on('tool-updated', forwardRegistryEvent)
  registry.on('tool-removed', forwardRegistryEvent)
}
