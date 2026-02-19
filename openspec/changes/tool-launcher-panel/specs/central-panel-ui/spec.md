## ADDED Requirements

### Requirement: Tool list display
系統 SHALL 在中央面板中以清單形式展示所有已註冊的工具。

#### Scenario: Display tool information
- **WHEN** 面板載入工具清單
- **THEN** 每個工具 SHALL 顯示：名稱（name）、簡述（description）、狀態燈號、啟動按鈕

#### Scenario: Empty tool list
- **WHEN** 沒有任何已註冊的工具
- **THEN** 系統 SHALL 顯示引導訊息，提示使用者如何新增工具（建立 JSON 設定檔或透過 UI 新增）

#### Scenario: Config error display
- **WHEN** 某個 JSON 設定檔解析失敗
- **THEN** 該工具 SHALL 在清單中以錯誤樣式顯示，標示為「設定錯誤」，並顯示錯誤原因

### Requirement: Status indicator
系統 SHALL 為每個工具顯示即時狀態燈號。

#### Scenario: Running status (green)
- **WHEN** 工具的 process 正在運行
- **THEN** 系統 SHALL 顯示綠色燈號

#### Scenario: Stopped status (gray)
- **WHEN** 工具的 process 未在運行
- **THEN** 系統 SHALL 顯示灰色燈號

#### Scenario: Real-time update
- **WHEN** 工具的運行狀態從 running 變為 stopped（或反之）
- **THEN** 系統 SHALL 在接收到 IPC 狀態變更事件後立即更新 UI 燈號，無需使用者手動刷新

### Requirement: One-click launch
系統 SHALL 提供一鍵啟動功能。

#### Scenario: Launch button click
- **WHEN** 使用者點擊工具的啟動按鈕
- **THEN** 系統 SHALL 觸發 launcher-engine 啟動該工具，啟動按鈕在啟動過程中 SHALL 顯示為 loading 狀態

#### Scenario: Launch button for running tool
- **WHEN** 工具已在運行中
- **THEN** 啟動按鈕 SHALL 顯示為禁用狀態或變為「運行中」提示

### Requirement: Tool management UI
系統 SHALL 提供工具管理介面，支援 CRUD 操作。

#### Scenario: Add new tool
- **WHEN** 使用者點擊「新增工具」按鈕
- **THEN** 系統 SHALL 顯示表單，包含所有必要欄位（id, name, description, command, cwd）和可選欄位（args, icon, tags, env, processName）

#### Scenario: Edit existing tool
- **WHEN** 使用者點擊工具的「編輯」按鈕
- **THEN** 系統 SHALL 顯示預填了現有設定值的編輯表單

#### Scenario: Delete tool confirmation
- **WHEN** 使用者點擊工具的「刪除」按鈕
- **THEN** 系統 SHALL 顯示確認對話框，確認後才執行刪除

### Requirement: Tool filtering by tags
系統 SHALL 支援透過標籤篩選工具清單。

#### Scenario: Filter by tag
- **WHEN** 使用者選擇一個或多個標籤
- **THEN** 系統 SHALL 僅顯示包含所選標籤的工具

#### Scenario: Clear filter
- **WHEN** 使用者清除標籤篩選
- **THEN** 系統 SHALL 顯示所有工具
