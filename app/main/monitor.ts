import { EventEmitter } from 'node:events'
import { readFileSync, unlinkSync } from 'node:fs'

interface TrackedProcess {
  pid: number
  pidFile: string
  startTime: Date
  realPid?: number
  deadCount: number // 🛡️ 死亡計數器：防止短暫的系統跳動導致誤判
}

export class ProcessMonitor extends EventEmitter {
  private tracked: Map<string, TrackedProcess> = new Map()
  private pollInterval: ReturnType<typeof setInterval> | null = null

  trackProcess(toolId: string, pid: number, startTime: Date, pidFile: string): void {
    console.log(`[Monitor] Tracking tool: ${toolId}, pidFile: ${pidFile}`)
    this.tracked.set(toolId, { pid, startTime, pidFile, deadCount: 0 })
    this.emit('status-changed', { toolId, status: 'running' })
    if (!this.pollInterval) {
      this.startPolling()
    }
  }

  untrackProcess(toolId: string): void {
    const info = this.tracked.get(toolId)
    if (info) {
      try { unlinkSync(info.pidFile) } catch (e) {}
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
    const NOW = Date.now()

    for (const [toolId, info] of this.tracked) {
      let alive = true
      const elapsed = NOW - info.startTime.getTime()

      // 1. 如果還沒拿到 realPid，嘗試讀取 pidFile
      if (!info.realPid) {
        try {
          const content = readFileSync(info.pidFile, 'utf8').trim()
          if (content) {
            info.realPid = parseInt(content, 10)
            console.log(`[Monitor] Got real PID for ${toolId}: ${info.realPid}`)
          }
        } catch (e) {
          // 檔案可能還沒建立
        }
      }

      // 2. 判斷是否存活
      if (info.realPid) {
        const currentlyAlive = this.isPidAlive(info.realPid)
        if (!currentlyAlive) {
          info.deadCount++
          // 🛡️ 三連擊機制：必須連續 3 秒偵測到死亡，才真正判定熄燈
          if (info.deadCount >= 3) {
            alive = false
          } else {
            // console.log(`[Monitor] Tool ${toolId} (PID: ${info.realPid}) dead count: ${info.deadCount}/3`)
            alive = true
          }
        } else {
          info.deadCount = 0 // 只要活著就歸零
          alive = true
        }
      } else {
        // 如果 20 秒後還沒拿到 PID，代表啟動失敗或超時
        if (elapsed > 20000) {
          console.log(`[Monitor] Tool ${toolId} PID detection timeout.`)
          alive = false
        } else {
          alive = true
        }
      }
     
      if (!alive) {
        console.log(`[Monitor] Tool ${toolId} (PID: ${info.realPid}) is dead.`)
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

  destroy(): void {
    this.stopPolling()
    for (const [_, info] of this.tracked) {
      try { unlinkSync(info.pidFile) } catch (e) {}
    }
    this.tracked.clear()
  }
}
