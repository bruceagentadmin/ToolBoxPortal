import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../shared/ipc-channels'
import type { ToolConfig, ToolEntry } from '../shared/types'

export interface ToolBoxAPI {
  getTools(): Promise<ToolEntry[]>
  launchTool(toolId: string): Promise<{ success: boolean; error?: string }>
  createTool(config: ToolConfig): Promise<{ success: boolean; error?: string }>
  updateTool(id: string, config: ToolConfig): Promise<{ success: boolean; error?: string }>
  deleteTool(id: string): Promise<{ success: boolean; error?: string }>
  onToolStatusChanged(callback: (data: { toolId: string; status: string }) => void): () => void
  onToolsUpdated(callback: () => void): () => void
}

const api: ToolBoxAPI = {
  getTools: () => ipcRenderer.invoke(IPC_CHANNELS.GET_TOOLS),
  launchTool: (toolId: string) => ipcRenderer.invoke(IPC_CHANNELS.LAUNCH_TOOL, toolId),
  createTool: (config: ToolConfig) => ipcRenderer.invoke(IPC_CHANNELS.CREATE_TOOL, config),
  updateTool: (id: string, config: ToolConfig) => ipcRenderer.invoke(IPC_CHANNELS.UPDATE_TOOL, id, config),
  deleteTool: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.DELETE_TOOL, id),

  onToolStatusChanged: (callback: (data: { toolId: string; status: string }) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: { toolId: string; status: string }): void => {
      callback(data)
    }
    ipcRenderer.on(IPC_CHANNELS.TOOL_STATUS_CHANGED, handler)
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TOOL_STATUS_CHANGED, handler)
    }
  },

  onToolsUpdated: (callback: () => void) => {
    const handler = (): void => {
      callback()
    }
    ipcRenderer.on(IPC_CHANNELS.TOOLS_UPDATED, handler)
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TOOLS_UPDATED, handler)
    }
  }
}

contextBridge.exposeInMainWorld('api', api)
