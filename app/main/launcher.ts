import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import type { ToolConfig } from '../shared/types'

export class LauncherEngine {
  async launchTool(config: ToolConfig): Promise<{ pid: number; startTime: Date; pidFile: string }> {
    if (!config.command || config.command.trim() === '') {
      throw new Error(`Tool "${config.id}": command is empty`)
    }
    if (!config.cwd || config.cwd.trim() === '') {
      throw new Error(`Tool "${config.id}": working directory (cwd) is empty`)
    }

    // Build the inner command to run within the terminal
    // We use powershell -NoExit to keep the window open after execution
    // Similar to the previous implementation, we add a pause manually for consistency
    const escapedCwd = config.cwd.replaceAll('"', '\"')
    const escapedCommand = config.command.replaceAll('"', '\"')
    const escapedArgs = (config.args || []).map((a) => `"${a.replaceAll('"', '\"')}"`).join(' ')

    const pidFile = join(tmpdir(), `toolbox-pid-${config.id}-${Date.now()}.tmp`)
    console.log(`[Launcher] PID file path: ${pidFile}`)

    // 🧠 核心強化：讓 PowerShell 把自己的 PID 寫入檔案，作為絕對監控標記
    let psSequence = `$PID | Out-File -FilePath '${pidFile.replace(/'/g, "''")}' -Encoding ascii; `
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
    const toolTitle = config.name
    const wtArgs = [
      '-w', 'ToolBoxPortal',
      'new-tab',
      '--title', toolTitle,
      '-d', config.cwd,
    ]

    if (config.tabColor) {
      wtArgs.push('--tabColor', config.tabColor)
    }

    wtArgs.push('powershell.exe', '-NoExit', '-EncodedCommand', encodedPS)

    return new Promise<{ pid: number; startTime: Date; pidFile: string }>((resolve, reject) => {
      const proc = spawn('wt.exe', wtArgs, {
        detached: true,
        stdio: 'ignore'
      })

      proc.on('error', (err: Error) => {
        reject(new Error(`Failed to launch Windows Terminal for tool "${config.id}": ${err.message}`))
      })

      setTimeout(() => {
        // 我們回傳 0 作為 PID，因為真正的 PID 會在 pidFile 中
        resolve({ pid: 0, startTime: new Date(), pidFile })
      }, 500)

      proc.unref()
    })
  }
}
