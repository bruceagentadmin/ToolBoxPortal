import { EventEmitter } from 'events'
import { app } from 'electron'
import { readdir, readFile, writeFile, unlink, mkdir } from 'fs/promises'
import { join, extname, basename } from 'path'
import { watch, type FSWatcher } from 'chokidar'
import type { ToolConfig } from '../shared/types'

export class ToolRegistry extends EventEmitter {
  private tools: Map<string, ToolConfig> = new Map()
  private watcher: FSWatcher | null = null
  private debounceTimers: Map<string, ReturnType<typeof setTimeout>> = new Map()
  private configDir: string = ''

  getConfigDir(): string {
    if (!this.configDir) {
      this.configDir = join(app.getPath('userData'), 'tools.d')
    }
    return this.configDir
  }

  async init(): Promise<void> {
    const dir = this.getConfigDir()
    await mkdir(dir, { recursive: true })
    await this.scanDirectory()
    this.startWatcher()
  }

  async scanDirectory(): Promise<void> {
    const dir = this.getConfigDir()
    this.tools.clear()

    let files: string[]
    try {
      files = await readdir(dir)
    } catch {
      return
    }

    const jsonFiles = files.filter((f) => extname(f).toLowerCase() === '.json')
    const seenIds = new Set<string>()

    for (const file of jsonFiles) {
      const filePath = join(dir, file)
      try {
        const raw = await readFile(filePath, 'utf-8')
        const data: unknown = JSON.parse(raw)
        const config = this.validateConfig(data)

        if (!config) {
          this.emit('tool-error', { file, reason: 'Missing required fields (id, name, description, command, cwd)' })
          continue
        }

        if (seenIds.has(config.id)) {
          this.emit('tool-error', { file, reason: `Duplicate ID "${config.id}" — skipped` })
          continue
        }

        seenIds.add(config.id)
        this.tools.set(config.id, config)
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        this.emit('tool-error', { file, reason: `Parse error: ${message}` })
      }
    }
  }

  validateConfig(data: unknown): ToolConfig | null {
    if (typeof data !== 'object' || data === null) return null

    const obj = data as Record<string, unknown>
    const required = ['id', 'name', 'description', 'command', 'cwd'] as const

    for (const field of required) {
      if (typeof obj[field] !== 'string' || (obj[field] as string).trim() === '') {
        return null
      }
    }

    return {
      id: obj['id'] as string,
      name: obj['name'] as string,
      description: obj['description'] as string,
      command: obj['command'] as string,
      cwd: obj['cwd'] as string,
      args: Array.isArray(obj['args']) ? (obj['args'] as string[]) : undefined,
      icon: typeof obj['icon'] === 'string' ? obj['icon'] : undefined,
      tags: Array.isArray(obj['tags']) ? (obj['tags'] as string[]) : undefined,
      env: typeof obj['env'] === 'object' && obj['env'] !== null ? (obj['env'] as Record<string, string>) : undefined,
      processName: typeof obj['processName'] === 'string' ? obj['processName'] : undefined,
      tabColor: typeof obj['tabColor'] === 'string' ? obj['tabColor'] : undefined
    }
  }

  private startWatcher(): void {
    const dir = this.getConfigDir()
    this.watcher = watch(dir, {
      ignoreInitial: true,
      depth: 0,
      ignored: (path, stats) => {
        if (stats?.isFile() && !path.endsWith('.json')) return true
        return false
      }
    })

    this.watcher.on('add', (filePath) => this.debouncedHandleFile(filePath, 'add'))
    this.watcher.on('change', (filePath) => this.debouncedHandleFile(filePath, 'change'))
    this.watcher.on('unlink', (filePath) => this.handleFileRemoved(filePath))
  }

  private debouncedHandleFile(filePath: string, eventType: 'add' | 'change'): void {
    const existing = this.debounceTimers.get(filePath)
    if (existing) clearTimeout(existing)

    const timer = setTimeout(() => {
      this.debounceTimers.delete(filePath)
      this.handleFileChanged(filePath, eventType)
    }, 200)

    this.debounceTimers.set(filePath, timer)
  }

  private async handleFileChanged(filePath: string, eventType: 'add' | 'change'): Promise<void> {
    const file = basename(filePath)
    try {
      const raw = await readFile(filePath, 'utf-8')
      const data: unknown = JSON.parse(raw)
      const config = this.validateConfig(data)

      if (!config) {
        this.emit('tool-error', { file, reason: 'Missing required fields' })
        return
      }

      const existed = this.tools.has(config.id)
      this.tools.set(config.id, config)

      if (eventType === 'add' && !existed) {
        this.emit('tool-added', config)
      } else {
        this.emit('tool-updated', config)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      this.emit('tool-error', { file, reason: `Parse error: ${message}` })
    }
  }

  private handleFileRemoved(filePath: string): void {
    const file = basename(filePath, '.json')
    // Find tool by matching filename to id
    for (const [id, config] of this.tools) {
      if (id === file) {
        this.tools.delete(id)
        this.emit('tool-removed', config)
        return
      }
    }
  }

  getTools(): ToolConfig[] {
    return Array.from(this.tools.values())
  }

  getToolById(id: string): ToolConfig | undefined {
    return this.tools.get(id)
  }

  async createToolConfig(config: ToolConfig): Promise<void> {
    const filePath = join(this.getConfigDir(), `${config.id}.json`)
    await writeFile(filePath, JSON.stringify(config, null, 2), 'utf-8')
    this.tools.set(config.id, config)
    this.emit('tool-added', config)
  }

  async updateToolConfig(id: string, config: ToolConfig): Promise<void> {
    const oldFilePath = join(this.getConfigDir(), `${id}.json`)
    // If ID changed, delete old file
    if (config.id !== id) {
      try {
        await unlink(oldFilePath)
      } catch {
        // old file may not exist
      }
      this.tools.delete(id)
    }
    const newFilePath = join(this.getConfigDir(), `${config.id}.json`)
    await writeFile(newFilePath, JSON.stringify(config, null, 2), 'utf-8')
    this.tools.set(config.id, config)
    this.emit('tool-updated', config)
  }

  async deleteToolConfig(id: string): Promise<void> {
    const filePath = join(this.getConfigDir(), `${id}.json`)
    const config = this.tools.get(id)
    try {
      await unlink(filePath)
    } catch {
      // file may already be removed
    }
    this.tools.delete(id)
    if (config) {
      this.emit('tool-removed', config)
    }
  }

  destroy(): void {
    if (this.watcher) {
      this.watcher.close()
      this.watcher = null
    }
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer)
    }
    this.debounceTimers.clear()
  }
}
