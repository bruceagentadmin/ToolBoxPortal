import type { ToolBoxAPI } from '../../preload/index'

declare global {
  interface Window {
    api: ToolBoxAPI
  }
}
