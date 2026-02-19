## ADDED Requirements

### Requirement: Launch tool via foreground PowerShell
系統 SHALL 透過前景 PowerShell 視窗啟動工具，使用者 MUST 能看到獨立的 PowerShell 終端機視窗。

#### Scenario: Successful launch
- **WHEN** 使用者點擊工具的啟動按鈕
- **THEN** 系統 SHALL 開啟一個新的前景 PowerShell 視窗，在指定的 `cwd` 中執行 `command` 加上 `args`，並回傳該 process 的 PID

#### Scenario: Launch with environment variables
- **WHEN** 工具設定包含 `env` 欄位
- **THEN** 系統 SHALL 在啟動 PowerShell 時將指定的環境變數注入 process 環境

#### Scenario: Launch with arguments
- **WHEN** 工具設定包含 `args` 陣列
- **THEN** 系統 SHALL 將所有 args 正確傳遞給啟動指令，不得因引號或特殊字元導致參數解析錯誤

### Requirement: PowerShell orchestrator mechanism
系統 SHALL 使用隱藏的 PowerShell orchestrator 來啟動前景視窗，以可靠取得 PID。

#### Scenario: Hidden orchestrator spawns visible window
- **WHEN** 系統執行啟動流程
- **THEN** 系統 SHALL 先啟動一個隱藏的 PowerShell（`-WindowStyle Hidden`），由該 PowerShell 使用 `Start-Process -PassThru` 開啟前景視窗，並透過 stdout 回傳新 process 的 PID

#### Scenario: Command encoding
- **WHEN** 啟動指令包含特殊字元（引號、空格、中文路徑等）
- **THEN** 系統 SHALL 使用 `-EncodedCommand`（Base64 編碼）傳遞指令，避免引號嵌套問題

### Requirement: Launch guard
系統 SHALL 防止重複啟動同一工具。

#### Scenario: Tool already running
- **WHEN** 使用者嘗試啟動一個已在運行中的工具（PID 存在且有效）
- **THEN** 系統 SHALL 阻止重複啟動，並在 UI 中提示該工具已在運行

#### Scenario: Tool not running
- **WHEN** 使用者嘗試啟動一個未在運行中的工具
- **THEN** 系統 SHALL 正常執行啟動流程

### Requirement: Launch error handling
系統 SHALL 妥善處理啟動失敗的情況。

#### Scenario: Invalid command path
- **WHEN** 工具設定中的 `command` 指向不存在的可執行檔
- **THEN** 系統 SHALL 在 UI 中顯示啟動失敗的錯誤訊息，工具狀態保持灰燈

#### Scenario: Invalid working directory
- **WHEN** 工具設定中的 `cwd` 指向不存在的目錄
- **THEN** 系統 SHALL 在 UI 中顯示錯誤訊息，不嘗試啟動
