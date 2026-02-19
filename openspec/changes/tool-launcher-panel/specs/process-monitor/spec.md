## ADDED Requirements

### Requirement: PID-based process status tracking
系統 SHALL 追蹤已啟動工具的 PID，定期輪詢以判斷工具是否仍在運行。

#### Scenario: Process running
- **WHEN** 已啟動工具的 PID 仍然存在於系統中
- **THEN** 系統 SHALL 將該工具的狀態回報為「運行中」（綠燈）

#### Scenario: Process exited
- **WHEN** 已啟動工具的 PID 不再存在於系統中
- **THEN** 系統 SHALL 將該工具的狀態更新為「未啟動」（灰燈），並清除該工具的 PID 追蹤資料

#### Scenario: Polling interval
- **WHEN** 系統有一個或多個工具處於追蹤狀態
- **THEN** 系統 SHALL 每約 1 秒執行一次 PID 存活檢查

#### Scenario: No tracked processes
- **WHEN** 沒有任何工具處於追蹤狀態
- **THEN** 系統 SHALL 暫停輪詢以節省資源，直到有新工具啟動

### Requirement: PID reuse protection
系統 SHALL 防止因 Windows PID 重用導致的狀態誤判。

#### Scenario: PID reused by different process
- **WHEN** 原工具 process 已結束但 PID 被新 process 重用
- **THEN** 系統 SHALL 透過比對 startTime 判斷為不同 process，將工具狀態更新為「未啟動」（灰燈）

### Requirement: Process name fallback monitoring
系統 SHALL 支援以 process 名稱作為 fallback 監控方式，適用於工具的 PowerShell 視窗快速結束但真正程式在背景運行的情況。

#### Scenario: ProcessName fallback active
- **WHEN** 工具設定包含 `processName` 欄位，且 PID 追蹤顯示 process 已結束
- **THEN** 系統 SHALL 改用 `processName` 檢查系統中是否有對應名稱的 process 正在運行，若有則狀態為綠燈

#### Scenario: ProcessName not configured
- **WHEN** 工具設定未包含 `processName` 欄位
- **THEN** 系統 SHALL 僅依賴 PID 追蹤判斷狀態

### Requirement: Status change notification
系統 SHALL 在工具狀態變更時即時通知 renderer（UI 層）。

#### Scenario: Status changes from gray to green
- **WHEN** 工具成功啟動並取得 PID
- **THEN** 系統 SHALL 透過 Electron IPC 推送狀態變更事件至 renderer

#### Scenario: Status changes from green to gray
- **WHEN** 輪詢偵測到工具 process 已結束
- **THEN** 系統 SHALL 透過 Electron IPC 推送狀態變更事件至 renderer
