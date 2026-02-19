# ToolBox Portal

這是一個為開發者設計的集中式工具啟動面板，專為 Windows 環境打造。它能協助您統一管理、啟動並監控各種開發工具與腳本，解決工具分散、容易遺忘的問題。

## 功能特色

- **集中管理**：將常用的開發工具、Script 或執行檔統一收納於一個介面。
- **快速啟動**：一鍵啟動工具，並支援即時狀態顯示（執行中/已停止）。
- **靈活配置**：
  - 支援新增、編輯、刪除工具設定。
  - 可設定執行指令 (Command)、工作目錄 (CWD)、參數 (Args) 及環境變數 (Env)。
  - 支援設定 Process Name 以精確監控執行狀態。
- **分類過濾**：透過標籤 (Tags) 快速篩選與尋找工具。
- **現代化介面**：基於 React 打造的響應式 UI，提供清晰的卡片式佈局與即時反饋。

## 技術架構

本專案採用 **Electron + Vite + React** 的現代化桌面應用開發架構：

1.  **Main Process (主進程)**
    - 使用 Node.js runtime。
    - 負責應用程式生命週期管理。
    - **ToolRegistry**：管理工具配置檔的讀寫。
    - **LauncherEngine**：負責執行工具指令。
    - **ProcessMonitor**：監控子程序狀態。
    - 處理 IPC 通訊。

2.  **Preload Script (預加載腳本)**
    - 建立安全的 Context Bridge。
    - 暴露受限的 API (`ToolBoxAPI`) 給渲染進程，隔離 Node.js 環境。

3.  **Renderer Process (渲染進程)**
    - 使用 **React 19** + **TypeScript**。
    - 使用 **Vite** 進行極速建置與 HMR。
    - UI 組件化設計 (ToolCard, ToolEditor 等)。
    - 使用 `lucide-react` 提供圖示。

## 專案結構

```
d:/Bruce/Coding/Lab/ToolBoxPortal/
├── app/
│   ├── main/           # Electron 主進程源碼
│   ├── preload/        # Preload 腳本源碼
│   ├── renderer/       # React 前端源碼
│   └── shared/         # 前後端共用的型別定義 (Types)
├── build/              # ICON 與構建資源
├── dist/               # 建置輸出目錄
├── electron.vite.config.ts # Vite 配置檔
└── package.json        # 專案依賴與腳本
```

## 安裝與執行

### 前置需求
- Node.js (建議 v18 以上)
- npm

### 開發模式

1.  安裝依賴：
    ```bash
    npm install
    ```

2.  啟動開發伺服器 (同時啟動 Electron 與 Vite Dev Server)：
    ```bash
    npm run dev
    ```

### 建置發布

1.  建置專案 (Transpile TypeScript & Build Assets)：
    ```bash
    npm run build
    ```

2.  預覽建置結果：
    ```bash
    npm run preview
    ```

3.  打包應用程式 (生成 Windows 安裝檔/執行檔)：
    ```bash
    npm run package
    ```

## 使用說明

1.  開啟程式後，點擊右上角的 **+ Add Tool** 按鈕。
2.  填寫工具資訊：
    - **Name**: 工具顯示名稱。
    - **Command**: 執行指令 (例如 `powershell`, `node`, `C:\path\to\exe`)。
    - **CWD**: 工作目錄 (Current Working Directory)。
    - **Args**: 參數列表 (選填)。
    - **Tags**: 標籤 (選填，用於分類)。
3.  儲存後，點擊卡片上的 **Launch** 即可啟動工具。
4.  程式會自動監控該工具的執行狀態，並以指示燈顏色顯示 (綠色：執行中 / 灰色：已停止)。
