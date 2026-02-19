## ADDED Requirements

### Requirement: Tool config JSON schema
系統 SHALL 定義標準的工具設定 JSON 格式，包含以下必要欄位：
- `id`（string）：工具唯一識別碼，kebab-case
- `name`（string）：工具顯示名稱
- `description`（string）：工具用途說明
- `command`（string）：啟動指令（可執行檔路徑或命令名稱）
- `cwd`（string）：工作目錄的絕對路徑

以及以下可選欄位：
- `args`（string[]）：啟動參數陣列
- `icon`（string）：圖示名稱
- `tags`（string[]）：分類標籤
- `env`（Record<string, string>）：環境變數
- `processName`（string）：用於 fallback 狀態監控的 process 名稱

#### Scenario: Valid tool config
- **WHEN** 使用者建立一個包含所有必要欄位的 JSON 檔案
- **THEN** 系統 SHALL 成功解析該設定並將工具加入清單

#### Scenario: Missing required fields
- **WHEN** JSON 檔案缺少任何必要欄位（id, name, description, command, cwd）
- **THEN** 系統 SHALL 標示該設定為「設定錯誤」，不將其加入可啟動的工具清單，並在 UI 中顯示錯誤訊息

#### Scenario: Invalid JSON syntax
- **WHEN** 檔案內容不是有效的 JSON
- **THEN** 系統 SHALL 忽略該檔案並在 UI 中標示為「設定錯誤」，不得導致應用程式 crash

### Requirement: Tool config directory scanning
系統 SHALL 在啟動時掃描工具設定目錄（`%APPDATA%/ToolBoxPortal/tools.d/`）中所有 `*.json` 檔案，並載入有效的設定。

#### Scenario: Startup loading
- **WHEN** 應用程式啟動
- **THEN** 系統 SHALL 讀取設定目錄中所有 `*.json` 檔案，解析有效設定並建立工具清單

#### Scenario: Empty directory
- **WHEN** 設定目錄中沒有任何 JSON 檔案
- **THEN** 系統 SHALL 顯示空的工具清單，不得報錯

#### Scenario: Directory not exists
- **WHEN** 設定目錄不存在
- **THEN** 系統 SHALL 自動建立該目錄，並顯示空的工具清單

### Requirement: Tool config hot-reload
系統 SHALL 透過檔案監控即時偵測設定目錄中的變更，無需重啟應用程式。

#### Scenario: New config file added
- **WHEN** 使用者將新的 JSON 設定檔放入設定目錄
- **THEN** 系統 SHALL 在 debounce 期間（200ms）後自動載入新設定並更新 UI 工具清單

#### Scenario: Config file modified
- **WHEN** 使用者修改現有的 JSON 設定檔
- **THEN** 系統 SHALL 重新載入該設定並在 UI 中反映變更

#### Scenario: Config file deleted
- **WHEN** 使用者刪除一個 JSON 設定檔
- **THEN** 系統 SHALL 從工具清單中移除該工具（若該工具正在運行，不影響其 process）

### Requirement: Tool config CRUD via UI
系統 SHALL 提供 UI 介面讓使用者新增、編輯、刪除工具設定。

#### Scenario: Create new tool config
- **WHEN** 使用者透過 UI 填寫工具資訊並儲存
- **THEN** 系統 SHALL 在設定目錄中建立一個以 `${id}.json` 命名的新 JSON 檔案

#### Scenario: Edit existing tool config
- **WHEN** 使用者透過 UI 修改工具資訊並儲存
- **THEN** 系統 SHALL 更新對應的 JSON 設定檔

#### Scenario: Delete tool config
- **WHEN** 使用者透過 UI 刪除一個工具
- **THEN** 系統 SHALL 刪除對應的 JSON 設定檔，該工具從清單中移除

#### Scenario: Duplicate ID prevention
- **WHEN** 使用者嘗試建立一個 ID 已存在的工具
- **THEN** 系統 SHALL 拒絕建立並提示 ID 重複
