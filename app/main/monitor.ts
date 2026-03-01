import { EventEmitter } from 'node:events'
import { openSync, closeSync, unlinkSync } from 'node:fs'

interface TrackedProcess {
  pid: number
  lockFile?: string
  startTime: Date
}

export class ProcessMonitor extends EventEmitter {
  private tracked: Map<string, TrackedProcess> = new Map()
  private pollInterval: ReturnType<typeof setInterval> | null = null

  trackProcess(toolId: string, pid: number, startTime: Date, lockFile?: string): void {
    this.tracked.set(toolId, { pid, startTime, lockFile })
    this.emit('status-changed', { toolId, status: 'running' })
    if (!this.pollInterval) {
      this.startPolling()
    }
  }

  untrackProcess(toolId: string): void {
    const info = this.tracked.get(toolId)
    if (info) {
      if (info.lockFile) {
        try { unlinkSync(info.lockFile) } catch (e) {}
      }
      this.tracked.delete(toolId)
      this.emit('status-changed', { toolId, status: 'stopped' })
    }
    
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

  private pollAll(): void {
    const toRemove: string[] = []

    for (const [toolId, info] of this.tracked) {
      let alive = false
      if (info.lockFile) {
        alive = this.isLockAlive(info.lockFile)
      } else {
        alive = this.isPidAlive(info.pid)
      }
      
      if (!alive) {
        toRemove.push(toolId)
      }
    }

    for (const toolId of toRemove) {
      this.untrackProcess(toolId)
    }
  }

  private isPidAlive(pid: number): boolean {
    if (pid <= 0) return false
    try {
      process.kill(pid, 0)
      return true
    } catch (err: unknown) {
      const error = err as NodeJS.ErrnoException
      if (error.code === 'EPERM') return true
      return false
    }
  }

  private isLockAlive(lockFile: string): boolean {
    const info = Array.from(this.tracked.values()).find(i => i.lockFile === lockFile)
    if (info && (Date.now() - info.startTime.getTime() < 2000)) {
      return true // 給 PowerShell 2 秒鐘的啟動緩衝，避免太快判定為已關閉
    }

    try {
      // 嘗試以「讀取與寫入」模式開啟檔案。
      // 如果 PowerShell 仍然咬著檔案（獨佔模式），這裡會發生拋出例外（鎖定中）。
      const fd = openSync(lockFile, 'r+')
      closeSync(fd)
      return false // 檔案可開啟 = 已解鎖 = 進程已消失
    } catch (err: any) {
      // EBUSY, EPERM, EACCES 代表檔案被另一個進程（PowerShell）鎖定中
      if (err.code === 'EBUSY' || err.code === 'EPERM' || err.code === 'EACCES') {
        return true 
      }
      return false
    }
  }

  destroy(): void {
    this.stopPolling()
    for (const [_, info] of this.tracked) {
      if (info.lockFile) {
        try { unlinkSync(info.lockFile) } catch (e) {}
      }
    }
    this.tracked.clear()
  }
}
