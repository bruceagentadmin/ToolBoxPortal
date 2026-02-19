import { spawn } from 'child_process'
import type { ToolConfig } from '../shared/types'

export class LauncherEngine {
  buildEncodedCommand(config: ToolConfig): string {
    const lines: string[] = []

    // Set environment variables
    if (config.env) {
      for (const [key, value] of Object.entries(config.env)) {
        lines.push(`$env:${key} = '${value.replace(/'/g, "''")}'`)
      }
    }

    // Build the inner command that runs in the visible PowerShell window
    const escapedCwd = config.cwd.replace(/'/g, "''")
    let innerCommand = `Set-Location '${escapedCwd}'; `

    // Build the actual command to run
    const escapedCommand = config.command.replace(/'/g, "''")
    innerCommand += `& '${escapedCommand}'`

    if (config.args && config.args.length > 0) {
      const escapedArgs = config.args.map((a) => `'${a.replace(/'/g, "''")}'`).join(' ')
      innerCommand += ` ${escapedArgs}`
    }

    // Add pause to keep window open after command finishes
    innerCommand += '; Write-Host ""; Write-Host "Process finished. Press any key to close..."; $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")'

    // Wrap inner command for the ArgumentList of Start-Process
    const innerEncoded = Buffer.from(innerCommand, 'utf16le').toString('base64')

    // Build the orchestrator script
    const escapedCwdOuter = config.cwd.replace(/'/g, "''")
    lines.push(
      `$p = Start-Process powershell.exe -WorkingDirectory '${escapedCwdOuter}' -WindowStyle Normal -PassThru -ArgumentList '-NoExit','-EncodedCommand','${innerEncoded}'`
    )
    lines.push('Write-Output $p.Id')

    const script = lines.join('\n')
    return Buffer.from(script, 'utf16le').toString('base64')
  }

  async launchTool(config: ToolConfig): Promise<{ pid: number; startTime: Date }> {
    if (!config.command || config.command.trim() === '') {
      throw new Error(`Tool "${config.id}": command is empty`)
    }
    if (!config.cwd || config.cwd.trim() === '') {
      throw new Error(`Tool "${config.id}": working directory (cwd) is empty`)
    }

    const encodedCommand = this.buildEncodedCommand(config)

    return new Promise<{ pid: number; startTime: Date }>((resolve, reject) => {
      const proc = spawn('powershell.exe', [
        '-NoProfile',
        '-NonInteractive',
        '-WindowStyle', 'Hidden',
        '-EncodedCommand', encodedCommand
      ], {
        stdio: ['ignore', 'pipe', 'pipe']
      })

      let stdout = ''
      let stderr = ''

      proc.stdout.on('data', (chunk: Buffer) => {
        stdout += chunk.toString()
      })

      proc.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString()
      })

      proc.on('error', (err) => {
        reject(new Error(`Failed to spawn PowerShell for tool "${config.id}": ${err.message}`))
      })

      proc.on('close', (code) => {
        if (code !== 0 && stdout.trim() === '') {
          reject(new Error(`PowerShell exited with code ${code} for tool "${config.id}": ${stderr.trim()}`))
          return
        }

        const pidStr = stdout.trim().split(/\r?\n/)[0]
        const pid = parseInt(pidStr, 10)

        if (isNaN(pid)) {
          reject(new Error(`Failed to parse PID from PowerShell output for tool "${config.id}": "${stdout.trim()}"`))
          return
        }

        resolve({ pid, startTime: new Date() })
      })
    })
  }
}
