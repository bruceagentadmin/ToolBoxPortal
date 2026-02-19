import { useState, useEffect, useCallback } from 'react'
import type { ToolEntry } from '../types'

export function useTools() {
  const [tools, setTools] = useState<ToolEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTools = useCallback(async () => {
    try {
      const result = await window.api.getTools()
      setTools(result)
    } catch (err) {
      console.error('Failed to fetch tools:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTools()

    // Listen for registry changes
    const unsubUpdated = window.api.onToolsUpdated(() => {
      fetchTools()
    })

    // Listen for status changes
    const unsubStatus = window.api.onToolStatusChanged((data) => {
      setTools((prev) =>
        prev.map((tool) => {
          if (tool.config.id === data.toolId) {
            return { ...tool, status: data.status as ToolEntry['status'] }
          }
          return tool
        })
      )
    })

    return () => {
      unsubUpdated()
      unsubStatus()
    }
  }, [fetchTools])

  const launchTool = useCallback(async (toolId: string) => {
    const result = await window.api.launchTool(toolId)
    if (result.success) {
      // Optimistically set running status
      setTools((prev) =>
        prev.map((tool) =>
          tool.config.id === toolId ? { ...tool, status: 'running' as const } : tool
        )
      )
    }
    return result
  }, [])

  const createTool = useCallback(async (config: ToolEntry['config']) => {
    const result = await window.api.createTool(config)
    if (result.success) {
      await fetchTools()
    }
    return result
  }, [fetchTools])

  const updateTool = useCallback(async (id: string, config: ToolEntry['config']) => {
    const result = await window.api.updateTool(id, config)
    if (result.success) {
      await fetchTools()
    }
    return result
  }, [fetchTools])

  const deleteTool = useCallback(async (id: string) => {
    const result = await window.api.deleteTool(id)
    if (result.success) {
      await fetchTools()
    }
    return result
  }, [fetchTools])

  return { tools, loading, launchTool, createTool, updateTool, deleteTool, refetch: fetchTools }
}
