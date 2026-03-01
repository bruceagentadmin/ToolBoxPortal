import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { writeFileSync } from 'node:fs'
import type { ToolConfig } from '../shared/types'

export class LauncherEngine {
  async launchTool(config: ToolConfig): Promise<{ pid: number; startTime: Date; lockFile?: string }> {
    if (!config.command || config.command.trim() === '') {
      throw new Error(`Tool "${config.id}": command is empty`)
    }
    if (!config.cwd || config.cwd.trim() === '') {
      throw new Error(`Tool "${config.id}": working directory (cwd) is empty`)
    }

    // Build the inner command to run within the terminal
    // We use powershell -NoExit to keep the window open after execution
    // Similar to the previous implementation, we add a pause manually for consistency
    const escapedCwd = config.cwd.replace(/"/g, '\"')
    const escapedCommand = config.command.replace(/"/g, '\"')
    const escapedArgs = (config.args || []).map((a) => `"${a.replace(/"/g, '\"')}"`).join(' ')

    const lockFile = join(tmpdir(), `toolbox-lock-${config.id}-${Date.now()}.tmp`)

    // Build the command string that will be passed to PowerShell
    // 🦴 鎖定骨頭：以 OpenOrCreate 模式獨佔方式開啟鎖檔案，直到 PowerShell 進程結束為止
    let psSequence = `$lock = [System.IO.File]::Open('${lockFile.replace(/'/g, "''")}', 'OpenOrCreate', 'Read', 'None'); `
    psSequence += `Set-Location '${escapedCwd.replace(/'/g, "''")}'; `
    
    if (config.env) {
      for (const [key, value] of Object.entries(config.env)) {
        psSequence += `$env:${key} = '${value.replace(/'/g, "''")}'; `
      }
    }
    
    psSequence += `& '${escapedCommand.replace(/'/g, "''")}' ${escapedArgs}; `
    psSequence += `Write-Host ""; Write-Host "Process finished. Press any key to close..."; $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")`

    const encodedPS = Buffer.from(psSequence, 'utf16le').toString('base64')

    // Construct wt.exe arguments
    // -w "ToolBoxPortal" uses a named window instance
    // new-tab adds a tab to that window
    // --title sets the tab title, we use a unique prefix to monitor it
    const toolTitle = `ToolBoxPortal:${config.id}`
    const wtArgs = [
      '-w', 'ToolBoxPortal',
      'new-tab',
      '--title', toolTitle,
      '-d', config.cwd,
      'powershell.exe', '-NoExit', '-EncodedCommand', encodedPS
    ]

    return new Promise<{ pid: number; startTime: Date; lockFile?: string }>((resolve, reject) => {
      const proc = spawn('wt.exe', wtArgs, {
        detached: true,
        stdio: 'ignore'
      })

      proc.on('error', (err) => {
        reject(new Error(`Failed to launch Windows Terminal for tool "${config.id}": ${err.message}`))
      })

      setTimeout(() => {
        resolve({ pid: proc.pid || 0, startTime: new Date(), lockFile })
      }, 500)

      proc.unref()
    })
  }
}
