# Contributing · 借來的光 (Borrowed Light)

> 歡迎協作 ETF 信貸槓桿試算器！本文件說明開發流程、程式規範與如何加入新功能。

---

## 0. 文件地圖

| 文件 | 內容 |
| --- | --- |
| [`docs/PRD.md`](./docs/PRD.md) | 產品需求 · 功能規格 · 計算公式 · Wireframe |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | 模組分層 · 依賴圖 · 資料流 · 擴充指南 |
| [`docs/adr/`](./docs/adr/) | 重大架構決定的歷史紀錄 |
| `CONTRIBUTING.md`（本檔） | 開發流程與程式規範 |

---

## 1. 環境需求

| 工具 | 版本 |
| --- | --- |
| Node.js | ≥ 20 LTS |
| npm | ≥ 10（隨 Node 內建） |
| Git | ≥ 2.40 |

> 推薦使用 [Volta](https://volta.sh/) 或 [fnm](https://github.com/Schniz/fnm) 管理 Node 版本。

## 2. 快速開始

```bash
git clone <repo-url>
cd Borrowed-Light
npm install
npm run dev          # http://localhost:5173
```

| 指令 | 用途 |
| --- | --- |
| `npm run dev` | 啟動 Vite dev server（HMR） |
| `npm run build` | TypeScript 型別檢查 + production build |
| `npm run preview` | 本機預覽 production build |
| `npm test` | Vitest 單次執行 |
| `npm run lint` | ESLint |

---

## 3. 開發流程

### 3.1 分支策略

- `main`：可隨時部署，必須通過 build + test
- `feat/<short-desc>`：新功能
- `fix/<short-desc>`：bug 修正
- `chore/<short-desc>`：相依套件、設定、文件

### 3.2 提交訊息 (Commit Convention)

採 [Conventional Commits](https://www.conventionalcommits.org/) 風格：

```
<type>(<scope>): <subject>

<body 可選>
```

| type | 說明 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 修 bug |
| `refactor` | 重構（無功能改變） |
| `perf` | 效能改善 |
| `style` | 純樣式 / 格式 |
| `test` | 測試 |
| `docs` | 文件 |
| `chore` | 雜項、依賴、設定 |

範例：

```
feat(calc): support balloon-style repayment in computeLoan
fix(ui): correct leverage indicator color threshold to ≥ 3x
docs(adr): add ADR-0008 for monte-carlo provider
```

### 3.3 PR 規則

- PR 標題沿用 Conventional Commit 格式
- Description 至少包含：**Why · What · How tested**
- 對 UI 變更附 before/after 截圖或錄影
- 觸及計算引擎時必附測試
- 通過所有 CI 檢查（build / lint / test）

---

## 4. 程式規範

### 4.1 整體原則

- **不為假想中的未來而設計**：YAGNI 優先
- **錯誤處理只在邊界**：FinMind / URL 解析；內部呼叫信任型別
- **註解寫 Why 不寫 What**：好的命名 > 註解；只在「不顯而易見」處留下原因
- **單一檔案 = 單一職責**：超過 200 行考慮拆分
- **匯入順序**：第三方 → `@/` 別名 → 相對路徑

### 4.2 TypeScript

- 嚴格模式 (`strict: true`) 啟用，避免 `any`，必要時用 `unknown`
- 型別 import 使用 `import type { ... }`
- 對外公開的介面以 `interface` 表達，內部結構用 `type`
- 不為「以後可能會擴」加 generics

### 4.3 React

- 預設使用 `function` 元件 + Hooks
- 派生狀態用 `useMemo`、副作用用 `useEffect`，**禁止用 useEffect 同步衍生資料**
- props 解構於參數，不在元件內 `props.x`
- 不要在元件內定義超大物件（例如 chartConfig），抽到模組層

### 4.4 樣式

- 統一使用 Tailwind utility（v4 語法）
- 設計 token 只在 `src/index.css` 的 `@theme` block 增刪
- 共用樣式用 `@utility`，不要在 component 重複寫長串
- 顏色名遵循 token：`text-cyber-text-2`、`bg-cyber-panel` 等

### 4.5 計算邏輯

- 一律寫在 `src/lib/calc/`
- 函式必須是 **pure**：相同輸入必相同輸出、無副作用、不發 fetch
- 每個 exported function 需有對應測試
- 邊界條件（除以 0、空陣列、極值）必須處理且測試覆蓋

### 4.6 表單

- Schema 為單一真實來源（`src/lib/schema.ts`）
- 不在元件內重複定義 validation
- 預設值集中於 `DEFAULT_VALUES`

---

## 5. 測試

### 5.1 範圍

| 層級 | 範圍 | 必要性 |
| --- | --- | --- |
| 單元測試（Vitest） | `lib/calc/*`、`lib/url.ts` | **必須** |
| 元件測試（@testing-library/react） | 複雜互動或 a11y 細節 | 視需要 |
| E2E | （Phase 2 才導入 Playwright） | 暫不需要 |

### 5.2 撰寫規則

- 一個 `describe` 對應一個 function
- 測試名為自然語言：`it('returns 0 for n=0')`
- 邊界條件單獨一個 case
- 數值斷言用 `toBeCloseTo(expected, 2)` 避免浮點誤差

範例：

```ts
describe('pmt', () => {
  it('returns 0 when n === 0', () => {
    expect(pmt(1_000_000, 0.03, 0)).toBe(0)
  })

  it('degenerates to P/n when annualRate === 0', () => {
    expect(pmt(1_200_000, 0, 1)).toBeCloseTo(100_000, 2)
  })
})
```

### 5.3 跑測試

```bash
npm test                    # 一次性
npx vitest                  # watch 模式
npx vitest run --coverage   # 含覆蓋率（需要時）
```

---

## 6. 加入新功能

### 6.1 新增輸入欄位

依序：

1. `src/lib/schema.ts`：加欄位 + Zod 驗證 + `DEFAULT_VALUES`
2. `src/lib/url.ts`：補上 `KEY_MAP`（2 字短鍵，且勿撞已存在的）
3. `src/lib/calc/engine.ts`：擴充 `CalcParams` 並更新 `compute()`
4. `src/App.tsx`：在 `formValuesToCalcParams` 加入轉換
5. 對應的 `*Section.tsx`：用 `<Input>` 或 `<Select>` 註冊
6. 撰寫 `engine.test.ts` 覆蓋新行為
7. 更新 `docs/PRD.md` §5 與 `docs/ARCHITECTURE.md` §8.2

### 6.2 新增一張圖表

1. 於 `engine.ts` 加上派生資料陣列 + 對應介面
2. 於 `components/results/` 建立 `*Chart.tsx`，沿用 `tooltipStyle` / `axisTick` 參考
3. 在 `ResultsPage.tsx` 的 Visualization Card 插入
4. 給予代號（如 `CHART.04`）並於 PRD §8 wireframe 補上

### 6.3 替換 / 新增資料源

1. 實作新的 `EtfDataProvider`
2. 於 `EtfSection.tsx` 注入新 provider
3. 撰寫 ADR 紀錄選擇緣由（複製 `docs/adr/_template.md`）

### 6.4 重大架構決策

- 任何「會在六個月後讓新成員疑惑為什麼」的選擇都應留下 ADR
- 範本：[`docs/adr/_template.md`](./docs/adr/_template.md)
- 索引：[`docs/adr/README.md`](./docs/adr/README.md)

---

## 7. 上線前自我檢查清單

- [ ] `npm run build` 無錯誤
- [ ] `npm run lint` 無新增 warning
- [ ] `npm test` 全綠
- [ ] Mobile (≤ 414px) 走過 UC-01～UC-04
- [ ] 新欄位的 URL round-trip 通過（手動編輯 URL → reload → 數值還原）
- [ ] 新增測試對 Excel 對照誤差 ≤ 0.1%
- [ ] 觸及隱私 / 資料邊界時，文件已同步更新
- [ ] 若新增/變更計算公式 → 更新 PRD §6
- [ ] 若新增依賴 → 更新 ARCHITECTURE §2，並評估 bundle 影響

---

## 8. 行為準則 (Code of Conduct)

- 對事不對人；review 時針對 code 而非作者
- 同意分歧時，寫 ADR 而非冗長 PR 討論
- 數字 > 直覺：效能、bundle、計算結果都以實測為準

---

## 9. 聯絡與支援

- Issue: 在 GitHub 上開 Issue（請使用對應 template）
- 文件問題：直接編輯送 PR
- 緊急 bug：標題加 `[urgent]`
