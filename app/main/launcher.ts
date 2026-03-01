import { spawn } from 'child_process'
import type { ToolConfig } from '../shared/types'

export class LauncherEngine {
  // Removed buildEncodedCommand as WT integration handles command building inside launchTool

  async launchTool(config: ToolConfig): Promise<{ pid: number; startTime: Date }> {
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

    // Build the command string that will be passed to PowerShell
    // Set-Location, set env, run command, then pause
    let psSequence = `Set-Location '${escapedCwd.replace(/'/g, "''")}'; `
    
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
    // --title sets the tab title
    // -d sets the starting directory (though we also Set-Location in PS)
    const wtArgs = [
      '-w', 'ToolBoxPortal',
      'new-tab',
      '--title', config.name || config.id,
      '-d', config.cwd,
      'powershell.exe', '-NoExit', '-EncodedCommand', encodedPS
    ]

    return new Promise<{ pid: number; startTime: Date }>((resolve, reject) => {
      const proc = spawn('wt.exe', wtArgs, {
        detached: true,
        stdio: 'ignore'
      })

      proc.on('error', (err) => {
        reject(new Error(`Failed to launch Windows Terminal for tool "${config.id}": ${err.message}`))
      })

      // Since wt.exe with detached: true won't give us a useful PID of the actual process,
      // and it often returns immediately, we resolve with a mock-ish result or the spawn PID.
      // Note: Full process monitoring might be limited with wt.exe integration.
      setTimeout(() => {
        resolve({ pid: proc.pid || 0, startTime: new Date() })
      }, 500)

      proc.unref()
    })
  }
}
