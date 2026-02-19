export const IPC_CHANNELS = {
  GET_TOOLS: 'get-tools',
  LAUNCH_TOOL: 'launch-tool',
  CREATE_TOOL: 'create-tool',
  UPDATE_TOOL: 'update-tool',
  DELETE_TOOL: 'delete-tool',
  TOOL_STATUS_CHANGED: 'tool-status-changed',
  TOOLS_UPDATED: 'tools-updated',
} as const

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS]
