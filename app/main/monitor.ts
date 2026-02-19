import { EventEmitter } from 'events'

interface TrackedProcess {
  pid: number
  startTime: Date
}

export class ProcessMonitor extends EventEmitter {
  private tracked: Map<string, TrackedProcess> = new Map()
  private pollInterval: ReturnType<typeof setInterval> | null = null

  trackProcess(toolId: string, pid: number, startTime: Date): void {
    this.tracked.set(toolId, { pid, startTime })
    this.emit('status-changed', { toolId, status: 'running' })
    if (!this.pollInterval) {
      this.startPolling()
    }
  }

  untrackProcess(toolId: string): void {
    this.tracked.delete(toolId)
    if (this.tracked.size === 0) {
      this.stopPolling()
    }
  }

  getTrackedTools(): Map<string, TrackedProcess> {
    return new Map(this.tracked)
  }

  isTracked(toolId: string): boolean {
    return this.tracked.has(toolId)
  }

  private startPolling(): void {
    if (this.pollInterval) return
    this.pollInterval = setInterval(() => {
      this.pollAll()
    }, 1000)
  }

  private stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
  }

  private async pollAll(): Promise<void> {
    const toRemove: string[] = []

    for (const [toolId, info] of this.tracked) {
      const alive = this.isPidAlive(info.pid)
      if (!alive) {
        toRemove.push(toolId)
      }
    }

    for (const toolId of toRemove) {
      this.tracked.delete(toolId)
      this.emit('status-changed', { toolId, status: 'stopped' })
    }

    if (this.tracked.size === 0) {
      this.stopPolling()
    }
  }

  private isPidAlive(pid: number): boolean {
    try {
      process.kill(pid, 0)
      return true
    } catch (err: unknown) {
      const error = err as NodeJS.ErrnoException
      if (error.code === 'EPERM') {
        // Process exists but we don't have permission — it's alive
        return true
      }
      // ESRCH or other error — process doesn't exist
      return false
    }
  }

  destroy(): void {
    this.stopPolling()
    this.tracked.clear()
  }
}
