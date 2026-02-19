## Context

這是一個全新的 Windows 桌面應用程式專案。開發者擁有大量自行開發的工具散落在電腦各處，需要一個中央面板來管理、啟動與監控這些工具的運行狀態。

目前沒有任何既有程式碼，需從零開始建構。開發者熟悉 TypeScript/JavaScript 生態系。目標平台為 Windows，啟動機制為 PowerShell。

## Goals / Non-Goals

**Goals:**

- 提供一個桌面級中央面板，可瀏覽所有已註冊的工具清單
- 透過前景 PowerShell 視窗一鍵啟動工具（使用者可見終端機）
- 即時顯示工具運行狀態（綠燈/灰燈）
- 支援以 JSON 設定檔進行工具 CRUD（新增/編輯/刪除）
- 新工具只需放入 JSON 設定檔即可自動納入管理

**Non-Goals:**

- 跨平台支援（僅 Windows）
- 多使用者/權限控管（單人使用）
- 工具的輸出捕獲或日誌收集（工具在獨立 PowerShell 視窗中執行）
- 工具的自動更新或版本管理
- System tray 最小化（v1 不做，未來可擴展）

## Decisions

### Decision 1: 應用程式框架 — Electron + Vite

**選擇**: Electron（main process Node.js）+ Vite（renderer bundler）

**替代方案考量**:
| 方案 | 優點 | 缺點 | 結論 |
|------|------|------|------|
| Electron + Vite | 全 JS/TS 生態、Node.js 原生 process 管理、成熟的打包工具 | 包體較大（~80MB） | **採用** |
| Tauri + Web | 包體極小（~3MB）、啟動快 | 需 Rust 處理 process 邏輯，增加技術複雜度 | 備選方案 |
| Node.js + localhost Web | 最簡單、無框架開銷 | 無桌面體驗、需手動開瀏覽器、背景 process 管理麻煩 | 不適合 |
| C# WPF | 原生 Windows、極佳 process 控制 | 離開 JS 生態、開發速度較慢 | 不適合 |
| PowerShell + WPF | 零依賴 | UI 能力有限、維護困難 | 不適合 |

**理由**: Electron 是全 JS/TS 路線中最成熟的桌面方案。main process 直接使用 Node.js `child_process` 模組管理 PowerShell 啟動，無需跨語言橋接。打包工具（electron-builder）成熟。如果未來包體大小成為問題，可遷移至 Tauri。

### Decision 2: UI 框架 — React

**選擇**: React（renderer 端）

**理由**: 生態系最成熟，元件庫豐富，搭配 Vite 開發體驗佳。面板 UI 複雜度不高，React 足以應對且未來擴展性好。

### Decision 3: 工具啟動機制 — Hidden PowerShell Orchestrator

**選擇**: 由 Electron main process 啟動一個隱藏的 PowerShell 作為 orchestrator，該 orchestrator 再用 `Start-Process` 開啟前景 PowerShell 視窗。

**流程**:
1. Electron main process 呼叫隱藏 PowerShell：
   ```
   powershell.exe -NoProfile -NonInteractive -WindowStyle Hidden -Command <script>
   ```
2. 隱藏 PowerShell 執行：
   ```powershell
   $p = Start-Process powershell.exe -WorkingDirectory <cwd> -WindowStyle Normal -PassThru -ArgumentList <args>
   Write-Output $p.Id
   ```
3. Electron 從 stdout 讀取 PID，用於後續追蹤

**替代方案**: 直接 `child_process.spawn('powershell.exe', ..., { detached: true })` — 但在 Windows 上控制前景視窗行為不可靠。`cmd /c start` 可開新視窗但無法取得 PID。

**理由**: `-PassThru` 是唯一可靠取得前景視窗 PID 的方式。使用 `-EncodedCommand` 避免命令引號嵌套問題。

### Decision 4: 程序狀態監控 — PID 輪詢

**選擇**: 每秒輪詢檢查 PID 是否存在

**機制**:
- 維護 `Map<toolId, { pid: number, startTime: Date }>` 
- 每 ~1 秒呼叫 `tasklist /FI "PID eq <pid>"` 或 Node.js `process.kill(pid, 0)` 檢查存活
- PID 存在 → 綠燈，PID 不存在 → 灰燈
- 記錄 startTime 防止 PID 重用誤判

**替代方案**: WMI 事件訂閱（event-driven）— 更精準但實作複雜度高、Windows 版本相容性不一致。

**理由**: 1 秒輪詢對 UI 狀態燈號而言延遲完全可接受，實作最簡單且可靠。

### Decision 5: 工具註冊 — 目錄式 JSON 檔案

**選擇**: 專用目錄存放每個工具的獨立 JSON 設定檔

**位置**: `%APPDATA%/ToolBoxPortal/tools.d/*.json`

**JSON Schema**:
```json
{
  "id": "my-tool",
  "name": "My Tool",
  "description": "這個工具做什麼",
  "command": "node",
  "args": ["server.js"],
  "cwd": "D:\\path\\to\\tool",
  "icon": "optional-icon-name",
  "tags": ["web", "backend"],
  "env": {
    "PORT": "3000"
  }
}
```

**檔案監控**: 使用 `chokidar` 監聽目錄變更（add/change/unlink），debounce 200ms 避免編輯器暫存檔觸發。無效 JSON 在 UI 中標示為「設定錯誤」而非 crash。

**替代方案**: 單一 registry.json 檔案 — 新增工具需編輯同一檔案，不符合「放入 JSON 即可」的需求。

**理由**: 一個工具一個檔案，直接對應「開發新工具後建立 JSON 設定檔即可納入管理」的使用場景。

### Decision 6: 前後端通訊 — Electron IPC

**選擇**: Electron IPC（main ↔ renderer）

**理由**: 不需要額外的 WebSocket/SSE server。main process 的 registry 變更和 status tick 直接透過 IPC push 到 renderer。Preload script 提供安全的 contextBridge API。

## Risks / Trade-offs

**[包體大小] → 可接受**
Electron 打包後 ~80-100MB。對個人工具而言不是問題。若未來需極致精簡可遷移 Tauri。

**[PID 重用] → 記錄 startTime 緩解**
Windows 可能重用已結束 process 的 PID。透過同時記錄 PID + startTime 進行交叉驗證，輪詢間隔 1 秒內 PID 重用機率極低。

**[Detached 工具] → 提供 processName fallback**
某些工具的 PowerShell 視窗會立即結束（真正的程式在背景執行），導致 PID 追蹤失效。JSON 設定中可提供 `processName` 欄位，作為 fallback 監控方式。

**[命令引號嵌套] → 使用 EncodedCommand**
PowerShell 命令中的引號嵌套容易出錯。使用 `-EncodedCommand`（Base64 編碼的命令字串）完全避免此問題。

**[檔案監控誤觸發] → Debounce + 容錯**
文字編輯器可能透過暫存檔+重新命名寫入，導致 watcher 觸發多次。Debounce 200ms + 忽略 parse 失敗即可處理。

## Project Structure

```
ToolBoxPortal/
├── app/
│   ├── main/                 # Electron main process
│   │   ├── index.ts          # App entry, window creation
│   │   ├── launcher.ts       # PowerShell spawning logic
│   │   ├── registry.ts       # Tool config loading + file watching
│   │   ├── monitor.ts        # PID polling + status tracking
│   │   └── ipc.ts            # IPC handler registration
│   ├── preload/
│   │   └── index.ts          # contextBridge API exposure
│   └── renderer/
│       ├── src/
│       │   ├── App.tsx
│       │   ├── components/
│       │   │   ├── ToolCard.tsx
│       │   │   ├── StatusIndicator.tsx
│       │   │   └── ToolEditor.tsx
│       │   ├── hooks/
│       │   │   └── useToolStatus.ts
│       │   └── types.ts
│       └── index.html
├── tools.d/                  # Sample tool configs (dev)
│   └── example.json
├── electron-builder.yml
├── package.json
├── tsconfig.json
└── vite.config.ts
```
