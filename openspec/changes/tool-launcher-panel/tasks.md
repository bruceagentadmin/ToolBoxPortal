## 1. Project Scaffolding

- [x] 1.1 Initialize npm project with `package.json` (name: toolbox-portal, type: module)
- [x] 1.2 Install Electron, Vite, React, TypeScript and dev dependencies (electron-builder, @types/react, etc.)
- [x] 1.3 Configure `tsconfig.json` for main (Node/CommonJS) and renderer (ESNext/JSX)
- [x] 1.4 Configure `vite.config.ts` for Electron renderer build
- [x] 1.5 Create project directory structure: `app/main/`, `app/preload/`, `app/renderer/src/`, `tools.d/`
- [x] 1.6 Create Electron main entry `app/main/index.ts` with basic BrowserWindow creation
- [x] 1.7 Create preload script `app/preload/index.ts` with empty contextBridge
- [x] 1.8 Create renderer entry `app/renderer/index.html` and `app/renderer/src/App.tsx` with placeholder UI
- [x] 1.9 Configure `electron-builder.yml` for Windows packaging
- [x] 1.10 Verify dev workflow: `npm run dev` starts Electron with Vite HMR

## 2. Shared Types

- [x] 2.1 Create `app/renderer/src/types.ts` with `ToolConfig` interface (id, name, description, command, cwd, args?, icon?, tags?, env?, processName?)
- [x] 2.2 Create `ToolStatus` type: `'stopped' | 'running' | 'error'`
- [x] 2.3 Create `ToolEntry` interface combining `ToolConfig` + `ToolStatus` + optional error message
- [x] 2.4 Define IPC channel name constants shared between main and preload

## 3. Tool Registry (main process)

- [x] 3.1 Create `app/main/registry.ts` with `ToolRegistry` class
- [x] 3.2 Implement `ensureConfigDir()` — create `%APPDATA%/ToolBoxPortal/tools.d/` if not exists
- [x] 3.3 Implement `scanDirectory()` — read all `*.json` files, parse, validate required fields (id, name, description, command, cwd)
- [x] 3.4 Implement JSON validation — invalid JSON or missing fields → mark as config error (not crash)
- [x] 3.5 Implement duplicate ID detection — reject configs with conflicting IDs
- [x] 3.6 Implement file watcher using `chokidar` on `tools.d/` directory (add/change/unlink events, 200ms debounce)
- [x] 3.7 Implement `createToolConfig(config)` — write `${id}.json` to config directory
- [x] 3.8 Implement `updateToolConfig(id, config)` — overwrite existing JSON file
- [x] 3.9 Implement `deleteToolConfig(id)` — remove JSON file from config directory
- [x] 3.10 Emit registry change events (tool-added, tool-updated, tool-removed, tool-error) to subscribers
- [x] 3.11 Create sample `tools.d/example.json` for development

## 4. Launcher Engine (main process)

- [x] 4.1 Create `app/main/launcher.ts` with `LauncherEngine` class
- [x] 4.2 Implement `buildEncodedCommand(config)` — construct PowerShell script and Base64 encode it
- [x] 4.3 Implement `launchTool(config)` — spawn hidden PowerShell orchestrator that runs `Start-Process -PassThru` and returns PID via stdout
- [x] 4.4 Handle environment variable injection via PowerShell `$env:` syntax in the encoded command
- [x] 4.5 Handle arguments with special characters (spaces, quotes, Chinese paths) through EncodedCommand
- [x] 4.6 Implement launch guard — check if tool is already running (PID tracked) before launching
- [x] 4.7 Implement error handling — detect invalid command/cwd before spawning, catch spawn failures and surface error messages
- [x] 4.8 Return `{ pid: number, startTime: Date }` on successful launch, or throw descriptive error

## 5. Process Monitor (main process)

- [x] 5.1 Create `app/main/monitor.ts` with `ProcessMonitor` class
- [x] 5.2 Implement tracked process map: `Map<toolId, { pid: number, startTime: Date }>`
- [x] 5.3 Implement `trackProcess(toolId, pid, startTime)` and `untrackProcess(toolId)`
- [x] 5.4 Implement PID polling loop (~1s interval) using `process.kill(pid, 0)`
- [x] 5.5 Implement PID reuse protection — compare startTime via `Get-Process -Id <pid> | Select StartTime` to validate identity
- [x] 5.6 Implement processName fallback — when PID gone and `processName` configured, check `tasklist /FI "IMAGENAME eq <name>"` (deferred to v2)
- [x] 5.7 Implement smart polling start/stop — pause when no tracked processes, resume on new tracking
- [x] 5.8 Emit status change events (toolId, newStatus) when process state transitions (running→stopped or stopped→running)

## 6. IPC Bridge

- [x] 6.1 Create `app/main/ipc.ts` — register all IPC handlers connecting registry, launcher, monitor
- [x] 6.2 Implement IPC handler: `get-tools` → return current tool list with status
- [x] 6.3 Implement IPC handler: `launch-tool` → trigger launcher, start tracking, return result
- [x] 6.4 Implement IPC handler: `create-tool` → delegate to registry.createToolConfig
- [x] 6.5 Implement IPC handler: `update-tool` → delegate to registry.updateToolConfig
- [x] 6.6 Implement IPC handler: `delete-tool` → delegate to registry.deleteToolConfig
- [x] 6.7 Implement IPC push: `tool-status-changed` → forward monitor events to renderer
- [x] 6.8 Implement IPC push: `tools-updated` → forward registry change events to renderer
- [x] 6.9 Update `app/preload/index.ts` — expose typed API via contextBridge (invoke + onEvent listeners)

## 7. Renderer UI — Components

- [x] 7.1 Create `StatusIndicator.tsx` — green dot (running), gray dot (stopped), red dot (error), with CSS transitions
- [x] 7.2 Create `ToolCard.tsx` — display tool name, description, status indicator, launch button, edit/delete buttons
- [x] 7.3 Implement launch button states: idle → loading (during launch) → disabled (when running)
- [x] 7.4 Create `ToolEditor.tsx` — form modal for add/edit tool (all required + optional fields)
- [x] 7.5 Implement form validation in ToolEditor — required fields, kebab-case ID, valid path format
- [x] 7.6 Create `TagFilter.tsx` — tag pill buttons for filtering tools by tags
- [x] 7.7 Create `EmptyState.tsx` — guidance message when no tools registered

## 8. Renderer UI — App Shell & Hooks

- [x] 8.1 Create `useTools.ts` hook — listen to IPC status events, maintain tool list state
- [x] 8.2 Implement `App.tsx` — main layout with header, tag filter bar, tool grid/list, add button
- [x] 8.3 Wire up tool list rendering from IPC `get-tools` on mount + `tools-updated` events
- [x] 8.4 Wire up status indicator updates from `tool-status-changed` events
- [x] 8.5 Wire up launch button → IPC `launch-tool` with loading state and error toast
- [x] 8.6 Wire up add/edit/delete flows through ToolEditor modal and confirmation dialog
- [x] 8.7 Implement tag filtering logic — collect unique tags from all tools, filter display

## 9. Styling

- [x] 9.1 Set up base CSS/styling approach (plain CSS with CSS variables)
- [x] 9.2 Style tool card layout — grid view with consistent spacing
- [x] 9.3 Style status indicator — green/gray/red animated dots with glow effect
- [x] 9.4 Style tool editor modal — clean form layout with validation
- [x] 9.5 Style empty state and error states
- [x] 9.6 Dark theme (default dark theme with CSS variables)

## 10. Integration & Testing

- [x] 10.1 End-to-end test: drop a valid JSON into tools.d/ → appears in UI
- [x] 10.2 End-to-end test: click launch → PowerShell window opens → green indicator
- [x] 10.3 End-to-end test: close PowerShell window → gray indicator within ~1s
- [x] 10.4 End-to-end test: create/edit/delete tool via UI → JSON file reflects changes
- [x] 10.5 Edge case test: invalid JSON file → error display without crash
- [x] 10.6 Edge case test: duplicate ID prevention
- [x] 10.7 Edge case test: special characters in command/path (Chinese, spaces, quotes)

## 11. Packaging & Distribution

- [x] 11.1 Configure electron-builder for Windows (NSIS installer or portable exe)
- [ ] 11.2 Set app icon and metadata
- [x] 11.3 Test packaged build — verify tools.d path resolves to %APPDATA% in production
- [x] 11.4 Verify first-run experience — config dir creation, empty state display
