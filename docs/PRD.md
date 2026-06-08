# 借來的光 · Borrowed Light — 產品規格書 (PRD)

| 欄位 | 內容 |
| --- | --- |
| 產品名稱 | 借來的光 / Borrowed Light |
| 副標 | ETF 信貸槓桿投資試算器 |
| 文件版本 | v1.1 |
| 文件狀態 | Active · MVP 已實作 |
| 適用範圍 | Web (Desktop + Mobile) |
| 主要語系 | zh-TW |
| 文件擁有者 | Product · Engineering |
| 最後更新 | 2026-06-02 |

---

## 0. 目錄

1. 產品定位與成功定義
2. 目標使用者與使用情境
3. 範圍 (In / Out of Scope)
4. 名詞表
5. 功能需求 (FR)
6. 計算引擎規格
7. 資料模型
8. UI / UX 規格
9. 狀態管理與分享
10. 非功能性需求
11. 邊界條件與錯誤處理
12. 第三方資料來源
13. 測試策略
14. 驗收條件 (Acceptance Criteria)
15. 路線圖 (Roadmap)
16. 開放議題 (Open Questions)
17. 變更紀錄 (Changelog)

---

## 1. 產品定位與成功定義

### 1.1 一句話定位

協助考慮以「信貸資金投入 ETF」的台灣散戶，在 30 秒內看清楚一筆借錢買 ETF 的潛在報酬與風險。

### 1.2 解決什麼問題

| 痛點 | 痛點描述 |
| --- | --- |
| 月付金壓力不清楚 | 信貸試算多只算月付金，不含投資現金流 |
| 看不到淨資產走勢 | 不知道資產扣掉貸款後的真實淨值如何隨時間變化 |
| 風險無感 | 對 ETF 下跌 30% 時是否「資不抵債」沒有概念 |
| 槓桿報酬難算 | 自有資金回報 (ROE) 通常要自己拉 Excel |

### 1.3 成功指標 (Success Metrics)

| 類別 | 指標 | 目標 |
| --- | --- | --- |
| 任務效率 | P50 完成單次試算時間 | ≤ 30 秒 |
| 計算正確性 | 與 Excel 對照誤差 | 絕對誤差 ≤ 0.1% |
| 跨裝置 | Mobile (≤ 414px) 與 Desktop 皆通過手動驗收 | 100% |
| 效能 | Lighthouse Performance / Accessibility / Best Practices | 每項 ≥ 90 |
| 可分享 | 分享連結還原試算結果成功率 | 100% |

---

## 2. 目標使用者與使用情境

### 2.1 主要使用者

| 角色 | 描述 | 主要訴求 |
| --- | --- | --- |
| 槓桿新手 | 30-45 歲台灣上班族，有穩定薪資、考慮辦信貸投入 ETF | 想知道月付金、風險是否在承受範圍內 |
| 比較型使用者 | 已用過券商試算工具，但缺乏整合視角 | 想同時看資產走勢 + 現金流 + 跌幅模擬 |
| 內容創作者 | 投資自媒體 / 教學講師 | 想用具體數字 + 分享連結向觀眾說明案例 |

### 2.2 使用情境

#### UC-01 · 基準試算

> 申請信貸 100 萬、利率 2.5%、7 年、本息均攤；投入 0050、年化 8%、殖利率 3%。
> 期望輸出：月付金、總利息、ETF 最終市值、累計股息、淨利潤、淨報酬率、ROE。

**驗收**

- 月付金與 Excel `PMT` 函數誤差 ≤ 0.1%
- 結果頁可看見 7 個 KPI 區塊
- 三張圖表（資產成長、現金流、情境分析）皆呈現

#### UC-02 · 自有 vs 借款比較

> 比較「全額自有資金 100 萬」與「30 萬自有 + 70 萬信貸」兩種投入策略。

**驗收**

- 兩次試算結果可分別取得分享連結
- 當 `ownFunds = 0` 時 ROE 顯示「全額槓桿」而非 NaN / ∞

#### UC-03 · 下跌風險評估

> 持有期間任一時點 ETF 下跌 10% / 20% / 30% / 40% / 50% 時，淨資產是否轉負。

**驗收**

- Stress Matrix 表格列出 5 個跌幅情境
- 淨資產為負時，整列以紅色強調並標示「資不抵債」

#### UC-04 · 分享試算

> 把當前試算結果以 URL 形式傳給朋友 / 直接貼到社群。

**驗收**

- 接收者開啟連結後，看到的數字與發送者完全一致
- URL 長度合理（< 500 字元）

---

## 3. 範圍 (Scope)

### 3.1 In Scope (MVP)

- 信貸貸款參數設定（三種還款方式）
- ETF 假設參數設定（含 FinMind 半自動帶入）
- 股息政策（不投入 / 全投入 / 自訂比例）
- 進階費用（股息稅、證交稅、手續費、手續費折扣）
- 試算結果 KPI、圖表、風險矩陣
- URL 狀態保存與分享
- zh-TW 介面、深色 Cyber 風格

### 3.2 Out of Scope (本版本不做)

- 帳號 / 登入 / 雲端儲存
- 後端 API、資料庫
- ETF 即時行情串接 (僅含 FinMind 半自動估計)
- 蒙地卡羅模擬、可變利率、可變報酬率年度模型
- PDF 報告匯出
- 多語系切換

---

## 4. 名詞表 (Glossary)

| 名詞 | 定義 |
| --- | --- |
| C0 | 初始投入金額 = `ownFunds + loanAmount` |
| 本息均攤 (amortized) | 每月固定金額，前期利息多本金少 |
| 本金均攤 (equal-principal) | 每月固定本金，總月付逐月遞減 |
| 只還利息 (interest-only) | 期間只繳息，到期一次還本（氣球型） |
| DRIP | Dividend Re-Investment Plan，股息再投入 |
| ROE | 淨利潤 ÷ 自有資金；當自有資金為 0 時定義為「全額槓桿」 |
| 資不抵債 | 淨資產（ETF 市值 − 剩餘貸款）< 0 |
| 有效手續費率 | `brokerageRate × (1 - brokerageDiscount)` |

---

## 5. 功能需求 (Functional Requirements)

> ID 規則：`FR-<區塊>.<序號>`。每條需求附帶驗收條件。

### FR-5.1 信貸設定 (Credit Module)

| 欄位 | 型別 | 必填 | 預設 | 限制 |
| --- | --- | --- | --- | --- |
| `loanAmount` 貸款金額 (TWD) | number | ✓ | 1,000,000 | ≥ 0 |
| `annualLoanRatePct` 年利率 (%) | number | ✓ | 3.5 | 0 ~ 50 |
| `termYears` 年期 (年) | integer | ✓ | 7 | 1 ~ 40 |
| `repaymentMethod` 還款方式 | enum | ✓ | `amortized` | 三選一 |

**還款方式列舉**

| 值 | 顯示名 |
| --- | --- |
| `amortized` | 本息均攤（等額還款） |
| `equal-principal` | 本金均攤（等額本金） |
| `interest-only` | 只還利息（氣球型） |

**驗收**

- 不合法輸入即時於欄位下方顯示中文錯誤
- 三種還款方式皆有對應月付金 / 年度排程
- `loanAmount + ownFunds === 0` 時整表單不可送出

### FR-5.2 ETF 設定 (Asset Feed)

| 欄位 | 型別 | 必填 | 預設 | 限制 |
| --- | --- | --- | --- | --- |
| `etfSymbol` ETF 代號 | string | ✗ | `0050` | — |
| `annualGrowthRatePct` 年化價格成長率 (%) | number | ✓ | 8 | -50 ~ 100 |
| `dividendYieldPct` 殖利率 (%) | number | ✓ | 3 | 0 ~ 50 |

**自動帶入 (FR-5.2.1)**

- 使用者輸入 ETF 代號並按下「自動帶入」時，呼叫 FinMind API，回填 `annualGrowthRatePct` 與 `dividendYieldPct`。
- 失敗（CORS / 配額 / 找不到）時顯示警示訊息，不阻擋手動輸入。

### FR-5.3 股息政策 (Yield Policy)

| 值 | 顯示名 | 行為 |
| --- | --- | --- |
| `none` | 不再投入（全部領現金） | 再投入比例 = 0% |
| `full` | 全數再投入（DRIP） | 再投入比例 = 100% |
| `custom` | 自訂比例 | 啟用 `customReinvestRatioPct` 欄位 |

**驗收**

- 切換為 `custom` 時即時顯示自訂比例欄位
- 比例介於 0 ~ 100，否則無法送出

### FR-5.4 自有資金與槓桿指示 (Equity Base)

| 欄位 | 型別 | 必填 | 預設 | 限制 |
| --- | --- | --- | --- | --- |
| `ownFunds` 自有資金 (TWD) | number | ✓ | 300,000 | ≥ 0 |

**衍生資訊**

- `總投入本金 = ownFunds + loanAmount`
- `槓桿倍數 = 總投入本金 / ownFunds`；當 `ownFunds = 0` 顯示為 `∞`
- 槓桿 ≥ 3x 時，倍數以警示色（amber）顯示

### FR-5.5 進階費用 (Advanced Fees, Optional)

| 欄位 | 型別 | 預設 | 限制 |
| --- | --- | --- | --- |
| `dividendTaxRatePct` 股息稅率 (%) | number | 28 | 0 ~ 100 |
| `tradingTaxRatePct` 證交稅率 (%) | number | 0.1 | 0 ~ 5 |
| `brokerageRatePct` 手續費率 (%) | number | 0.1425 | 0 ~ 5 |
| `brokerageDiscountPct` 手續費折扣 (%) | number | 60 | 0 ~ 100 |

**驗收**

- 預設值反映台灣現況（28% 股息稅、0.1% 證交、0.1425% 手續費、6 折）
- 整個區塊以 Collapsible 預設收合，避免新手被嚇到

### FR-5.6 試算執行 (Execute)

- 表單通過 Zod 驗證才啟用按鈕
- 按下後路由切換至 `?page=results&...`，並 push 至瀏覽器歷史
- 重新整理頁面或從外部連結進入時，自動還原表單與結果

---

## 6. 計算引擎規格

> 演算法以實作於 `src/lib/calc/engine.ts` 為準。本節為對齊文件，不重述 TypeScript 細節。

### 6.1 共同符號

| 符號 | 意義 |
| --- | --- |
| `P` | 貸款本金 `loanAmount` |
| `r` | 月利率 = 年利率 / 12 |
| `n` | 期數 = 年期 × 12 |
| `C0` | 初始投入 = `ownFunds + P` |
| `g` | 年化價格成長率 (decimal) |
| `y` | 殖利率 (decimal) |
| `τ_d` | 股息稅率 (decimal) |
| `τ_t` | 證交稅率 (decimal) |
| `f` | 有效手續費率 = `brokerageRate × (1 - brokerageDiscount)` |
| `ρ` | 股息再投入比例 (decimal) |

### 6.2 月付金 PMT

**本息均攤**

```
PMT = P × r(1+r)^n / [(1+r)^n - 1]
```

- 邊界：`n = 0` → `PMT = 0`；`r = 0` → `PMT = P / n`
- 年度排程：逐月攤提，年末紀錄剩餘本金 / 年度本金 / 年度利息

**本金均攤**

```
月本金 = P / n
首月月付 = P/n + P × r
```

- 之後每月利息按當前餘額計算，月付逐月遞減

**只還利息（氣球型）**

```
月付 = P × r
末期最後一期額外付 P
```

- `r = 0` → 月付 = 0，期末仍需一次還本

### 6.3 ETF 成長 (含股息再投入)

對每一年 `t = 1..N`：

```
divGross_t  = etfValue_{t-1} × y
divNet_t    = divGross_t × (1 - τ_d)
divReinv_t  = divNet_t × ρ
divCash_t   = divNet_t × (1 - ρ)
etfValue_t  = etfValue_{t-1} × (1 + g) + divReinv_t
```

- `etfValue_0 = C0`
- 累計現金股息 `cumCash = Σ divCash_t`

### 6.4 手續費

- 買入手續費：`buyFee = C0 × f`
- 賣出含稅：`sellFee = etfFinalValue × (τ_t + f)`
- `totalFees = buyFee + sellFee`

### 6.5 淨利潤與報酬

```
netProfit  = etfFinalValue + cumCashDividends - ownFunds - P - totalInterest - totalFees
netReturn  = netProfit / C0           // C0 = 0 時為 0
ROE        = netProfit / ownFunds     // ownFunds = 0 時為 null（顯示「全額槓桿」）
```

### 6.6 情境分析

固定三組成長率（不採用「相對基準偏移」）：

| 標籤 | 年化成長率 |
| --- | --- |
| 悲觀 3% | 0.03 |
| 基準 `{g×100}%` | 使用者輸入的 `g` |
| 樂觀 12% | 0.12 |

每組情境重新跑 ETF 成長 + 賣出費用 + 淨利潤計算（**貸款利息為固定支出，不隨情境變動**）。

### 6.7 風險矩陣 (Stress Matrix)

固定 5 個跌幅：10% / 20% / 30% / 40% / 50%

```
etfValue_drop  = C0 × (1 - drop)
remainingLoan  = P     // 假設投入當下立即下跌，貸款尚未攤提
netWorth_drop  = etfValue_drop - remainingLoan
isInsolvable   = netWorth_drop < 0
```

> ⚠ 此為「投入當下即時下跌」之最壞情境模型，並非期末模型。

---

## 7. 資料模型

### 7.1 表單輸入 (`FormValues`)

```ts
type RepaymentMethod = 'amortized' | 'equal-principal' | 'interest-only'
type DividendPolicy  = 'none' | 'full' | 'custom'

interface FormValues {
  loanAmount: number              // TWD
  annualLoanRatePct: number       // %
  termYears: number               // 整數
  repaymentMethod: RepaymentMethod
  etfSymbol?: string
  annualGrowthRatePct: number     // %
  dividendYieldPct: number        // %
  dividendPolicy: DividendPolicy
  customReinvestRatioPct: number  // %
  ownFunds: number                // TWD
  dividendTaxRatePct: number      // %
  tradingTaxRatePct: number       // %
  brokerageRatePct: number        // %
  brokerageDiscountPct: number    // %
}
```

### 7.2 計算結果 (`CalcResult`)

```ts
interface CalcResult {
  loanResult:           LoanResult
  etfResult:            EtfResult
  monthlyPayment:       number          // 首期 (本金均攤情況)
  totalInterest:        number
  etfFinalValue:        number
  cumulativeDividends:  number
  netProfit:            number
  netReturn:            number          // ratio, e.g. 0.63 = 63%
  roe:                  number | null   // null = 全額槓桿
  assetGrowthData:      AssetGrowthPoint[]
  cashFlowData:         CashFlowPoint[]
  scenarios:            ScenarioResult[]
  riskRows:             RiskRow[]
}
```

完整型別定義見 `src/lib/calc/engine.ts`。

---

## 8. UI / UX 規格

### 8.1 整體風格

- 主題：Cyber Trading Terminal · 深色 + 紫色霓虹點綴
- 色票
  - 背景 `#07080d` / 面板 `#11131c` / 邊框 `#242838`
  - 主色 Neon Purple `#a855f7`，輔色 Cyan `#22d3ee` / Green `#34d399` / Amber `#fbbf24` / Red `#f43f5e`
- 字體
  - UI: `Inter`
  - 標題: `Space Grotesk`
  - 數字: `JetBrains Mono` (`tabular-nums`)

### 8.2 頁面結構

#### Page 1 · 試算首頁

```
Header  : Logo + 狀態燈 (ENGINE READY)
Section : 01 Credit Module        (貸款)
Section : 02 Asset Feed           (ETF + FinMind 帶入)
Section : 03 Yield Policy         (股息)
Section : 04 Equity Base          (自有資金 + 槓桿指示)
Section : 05 Advanced Fees [collapse]
CTA     : Execute Simulation
```

#### Page 2 · 試算結果

```
Header  : ← 返回 | RUN.<hash> | 分享按鈕
Block A : Run Parameters Meta (8 欄)
Block B : KPI Grid (7 卡片)
Block C : Visualization (3 圖表)
Block D : Stress Matrix
Footer  : Disclaimer
```

### 8.3 互動細節

- 表單即時驗證（onChange），錯誤以紅色 11px 顯示於欄位下方
- 槓桿倍數 ≥ 3x 自動轉 amber 色（風險暗示）
- 圖表 Tooltip 為深色面板 + 紫色光暈邊框
- KPI 卡片右上角狀態色點：positive / negative / accent / neutral

### 8.4 響應式

| 斷點 | 行為 |
| --- | --- |
| ≥ 1024px | 結果頁 KPI 4 欄；表單最大寬度 3xl |
| ≥ 640px | KPI 3 欄；表單欄位 2 欄 |
| < 640px | 所有區塊單欄；CTA 全寬 |

### 8.5 無障礙

- 所有互動元素具備 `aria-label` 或可見文字
- focus-visible 為紫色 2px ring，符合 WCAG AA 對比
- 表單欄位皆有 `<label htmlFor>` 關聯
- 顏色不單獨用來傳達狀態（資不抵債同時有文字標籤）

### 8.6 Wireframes

#### Page 1 · 試算首頁（Desktop ≥ 1024px）

```
┌──────────────────────────────────────────────────────────────────────┐
│ ◉ 借來的光 // BORROWED LIGHT              SESSION · ONLINE  ●        │
│   ETF Leverage Terminal · v1.0                                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│           ── ── ── Configure Parameters ── ── ──                     │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐  ╮       │
│  │ ▤ 01 · CREDIT MODULE                       LOAN.CFG    │  │       │
│  ├────────────────────────────────────────────────────────┤  │       │
│  │ 貸款金額 (TWD)            年利率 (%)                   │  │       │
│  │ [ 1,000,000        ]      [ 3.5            %]          │  │ Card  │
│  │                                                        │  │       │
│  │ 貸款年期 (年)             還款方式                     │  │       │
│  │ [ 7                ]      [ 本息均攤 ▾        ]        │  │       │
│  └────────────────────────────────────────────────────────┘  ╯       │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐          │
│  │ ▦ 02 · ASSET FEED                          ETF.SRC     │          │
│  ├────────────────────────────────────────────────────────┤          │
│  │ ETF代號           [ 0050      ]  [⟳ 自動帶入]          │          │
│  │ 年化價格成長率                  殖利率                 │          │
│  │ [ 8.0           %]              [ 3.0             %]   │          │
│  └────────────────────────────────────────────────────────┘          │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐          │
│  │ ◎ 03 · YIELD POLICY                        DIV.OUT     │          │
│  ├────────────────────────────────────────────────────────┤          │
│  │ 股息政策 [ 不再投入（全部領現金） ▾ ]                  │          │
│  └────────────────────────────────────────────────────────┘          │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐          │
│  │ ▣ 04 · EQUITY BASE                         CAPITAL.EQ  │          │
│  ├────────────────────────────────────────────────────────┤          │
│  │ 自有資金 [ 300,000 ]                                   │          │
│  │ ╭──────────────────────────────────────────────────╮   │          │
│  │ │ 總投入本金     1,300,000 TWD                     │   │          │
│  │ │ ⚡ 槓桿倍數       4.3x   (amber · 警示)          │   │          │
│  │ ╰──────────────────────────────────────────────────╯   │          │
│  └────────────────────────────────────────────────────────┘          │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐          │
│  │ ⚙ 05 · ADVANCED FEES (optional)             ▾         │          │
│  └────────────────────────────────────────────────────────┘          │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐          │
│  │   ▷  EXECUTE SIMULATION                                │          │
│  └────────────────────────────────────────────────────────┘          │
│      // press to run leverage projection engine                      │
└──────────────────────────────────────────────────────────────────────┘
```

#### Page 2 · 試算結果（Desktop ≥ 1024px）

```
┌──────────────────────────────────────────────────────────────────────┐
│ ← 返回 | ◉ Simulation Result  / RUN.A3F2     ● ENGINE READY  [分享] │
├──────────────────────────────────────────────────────────────────────┤
│ ┌─ ● Run Parameters ──────────────────────────────────── META ─┐     │
│ │ 貸款       │ 利率       │ 年期       │ 還款                  │     │
│ │ 1,000,000  │ 3.5 %      │ 7 YR       │ 本息均攤              │     │
│ │ 年化成長   │ 殖利率     │ 自有資金   │ 總利息                │     │
│ │ 8 %        │ 3 %        │ 300,000    │ 134,580               │     │
│ └──────────────────────────────────────────────────────────────┘     │
│                                                                      │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                      │
│ │ MON.PAY │ │ INT.SUM │ │ ETF.MV  │ │ DIV.CUM │   ● status dot       │
│ │ 13,245  │ │ 134,580 │ │ 2,158K  │ │ 420,000 │   monospace numbers  │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘                      │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                                  │
│ │ NET.PNL │ │ NET.ROI │ │ EQT.ROE │                                  │
│ │ 630,000 │ │ 63.0 %  │ │ 210.0%  │                                  │
│ └─────────┘ └─────────┘ └─────────┘                                  │
│                                                                      │
│ ┌─ ▤ Visualization ────────────────────────────────── CHARTS ─┐      │
│ │  ● 資產成長走勢                                CHART.01      │      │
│ │  ╱╲       ╱─────╱      legend: ETF / Loan-(dash) / Net      │      │
│ │ ╱  ╲___╱─────────╲                                          │      │
│ │ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄                                         │      │
│ │  ● 年度現金流量                                 CHART.02     │      │
│ │  ▌▌▌ vs ▌▌▌ + line                                          │      │
│ │ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄                                         │      │
│ │  ● 情境分析 (悲觀/基準/樂觀)                     CHART.03    │      │
│ │  ▌▌▌  ▌▌▌  ▌▌▌                                              │      │
│ └─────────────────────────────────────────────────────────────┘      │
│                                                                      │
│ ┌─ ▲ Stress Matrix ────────────────────────────── RISK ────────┐    │
│ │  ETF 跌幅 │ ETF 市值      │ 未償還貸款  │ 淨資產             │    │
│ │  ▼ 10%   │ 1,170,000     │ 1,000,000   │  170,000           │    │
│ │  ▼ 30%   │   910,000     │ 1,000,000   │  -90,000  資不抵債 │    │
│ │  ▼ 50%   │   650,000     │ 1,000,000   │ -350,000  資不抵債 │    │
│ └─────────────────────────────────────────────────────────────┘     │
│                                                                      │
│ // disclaimer · 本試算工具僅供參考，不構成投資建議                   │
└──────────────────────────────────────────────────────────────────────┘
```

#### Mobile (< 640px)

```
┌────────────────────┐
│ ◉ Borrowed Light   │
│ Terminal v1.0      │
├────────────────────┤
│ [Section card]     │
│ ┌────────────────┐ │
│ │ 01 · CREDIT    │ │
│ ├────────────────┤ │
│ │ 貸款金額        │ │
│ │ [           ]  │ │
│ │ 年利率          │ │
│ │ [        % ]   │ │
│ │ 年期            │ │
│ │ [           ]  │ │
│ │ 還款方式        │ │
│ │ [    ▾    ]    │ │
│ └────────────────┘ │
│ (其餘區塊單欄滾動) │
│ [ ▷ EXECUTE ]     │
└────────────────────┘
```

---

## 9. 狀態管理與分享

### 9.1 URL Schema

`?page=<input|results>&<short_key>=<value>...`

短鍵映射（節省 URL 長度）：

| 完整鍵 | 短鍵 |
| --- | --- |
| `loanAmount` | `la` |
| `annualLoanRatePct` | `lr` |
| `termYears` | `ty` |
| `repaymentMethod` | `rm` |
| `etfSymbol` | `es` |
| `annualGrowthRatePct` | `gr` |
| `dividendYieldPct` | `dy` |
| `dividendPolicy` | `dp` |
| `customReinvestRatioPct` | `cr` |
| `ownFunds` | `of` |
| `dividendTaxRatePct` | `dt` |
| `tradingTaxRatePct` | `tt` |
| `brokerageRatePct` | `br` |
| `brokerageDiscountPct` | `bd` |

### 9.2 行為

- 表單欄位變動 → `history.replaceState`（不污染歷史）
- 按下 Execute → `history.pushState` 切換到 results
- 返回按鈕 → 切回 input 並 `pushState`
- 監聽 `popstate` 還原狀態
- 分享按鈕：複製含 origin 的完整 URL 到剪貼簿，fallback 為 `prompt()`

---

## 10. 非功能性需求

| 類別 | 要求 |
| --- | --- |
| 效能 | 首次互動 (TTI) < 2s @ 4G；計算同步完成 < 50ms |
| Bundle | gzip 後 < 300KB（目前約 244KB） |
| 瀏覽器 | 最新兩版 Chrome / Edge / Safari / Firefox；iOS Safari 16+ |
| 隱私 | 無 cookie、無第三方追蹤；僅本機計算 |
| SEO | 提供 `<title>` 與 `<meta name="theme-color">` 即可，不需 OG |
| i18n | 介面僅 zh-TW；數字使用 `Intl.NumberFormat('zh-TW')` |

---

## 11. 邊界條件與錯誤處理

| 情境 | 處理 |
| --- | --- |
| `loanAmount = 0` 且 `ownFunds > 0` | 視為純自有資金投資；月付金 / 利息為 0 |
| `loanAmount > 0` 且 `ownFunds = 0` | 視為全額槓桿；ROE 顯示「全額槓桿」字樣 |
| `loanAmount = 0` 且 `ownFunds = 0` | 表單驗證失敗，按鈕不可送出 |
| `annualLoanRate = 0` | PMT 退化為 `P/n`；只還利息退化為月付 0、期末還本 |
| 年化成長率為負值 | 允許（最壞情境），但會出現 etfValue 隨年下降 |
| 自訂再投入比例 = 0 | 等同 `none` |
| FinMind API 失敗 | 顯示警示訊息，欄位保留原值，不阻擋手動 |

---

## 12. 第三方資料來源

### 12.1 FinMind

- 用途：根據 ETF 代號估算 `annualGrowthRatePct` 與 `dividendYieldPct`
- 觸發：使用者主動按下「自動帶入」按鈕
- 失敗模式：CORS、配額、找不到代號
- 隱私：不傳送任何使用者輸入，僅送出代號字串

> 後端依賴目前直接從瀏覽器發起，未來若遇到 CORS / 配額問題，會考慮加 Edge Function 代理。

---

## 13. 測試策略

| 層級 | 工具 | 範圍 |
| --- | --- | --- |
| 單元測試 | Vitest | `src/lib/calc/engine.ts` 各函式（PMT、ETF growth、scenario、risk） |
| 型別檢查 | `tsc -b` | CI 必通過 |
| Lint | ESLint | React Hooks、unused vars |
| 視覺驗證 | 手動 | 至少一次 Mobile + Desktop 走完 UC-01 ~ UC-04 |

> 自動化 E2E（Playwright）暫不在 MVP 範圍。

---

## 14. 驗收條件 (MVP)

- [x] 三種還款方式皆能正確計算月付金與年度排程
- [x] ETF 成長含再投入並考慮股息稅
- [x] 七個 KPI 顯示正確且 ROE 邊界處理（全額槓桿）已實作
- [x] 三張圖表（資產成長 / 現金流 / 情境）能渲染
- [x] 風險矩陣含 5 個跌幅 + `isInsolvable` 標示
- [x] URL 序列化 / 反序列化 round-trip 正確
- [x] FinMind 自動帶入成功 / 失敗皆有對應 UX
- [x] 進階費用區塊預設收合，預設值符合台灣現況
- [x] Lighthouse Performance / Accessibility / Best Practices ≥ 90（待最終量測）

---

## 15. 路線圖 (Roadmap)

### Phase 2 候選

| 項目 | 概述 | 預估價值 | 預估成本 |
| --- | --- | --- | --- |
| ETF 即時市價 + 歷史回填 | 接入 TWSE / 證交所 / FinMind 歷史報酬 | 中 | 中 |
| 蒙地卡羅模擬 | 以 σ 與 μ 跑 N 次模擬輸出機率分布 | 高 | 高 |
| 損益平衡點分析 | 解出 ETF 必須年化多少才能打平 | 中 | 低 |
| 可變利率 / 階梯費率 | 信貸前 6 期優惠利率等 | 中 | 中 |
| PDF 報告匯出 | 含圖表與情境表 | 中 | 中 |
| 分享短連結 | `/share/{id}` 對應 KV 儲存 | 高 | 中（需後端） |
| 多情境並列 | 同時看 A 案 vs B 案 | 高 | 中 |

### 後期 (Phase 3+)

- 使用者帳號 / 歷史試算紀錄
- 多語系 (en, ja)
- 桌面 App (Tauri)

---

## 16. 開放議題 (Open Questions)

1. **情境分析的悲觀 / 樂觀比例是否應該跟著基準動態調整？** 目前固定 3% / 12%，當基準為 15% 時「樂觀」反而比基準低。
2. **損益平衡點 (Break-even) 是否要加入 KPI？** 目前未實作，原 PRD 有提及。
3. **是否要支援 USD / 美股 ETF？** 涉及匯率假設。
4. **FinMind 是否該由前端直連？** CORS 與配額長期是隱患。
5. **是否提供 dry-run（不寫入 URL history）模式？** 目前每次輸入都會 `replaceState`，可能對隱私敏感使用者造成困擾。

---

## 17. 變更紀錄

| 版本 | 日期 | 變更 | 作者 |
| --- | --- | --- | --- |
| v1.0 | 2026-05 | 初版規格書 | — |
| v1.1 | 2026-06-02 | 對齊實作：技術棧改為 Vite + React 19；補上進階費用、URL 分享、FinMind 自動帶入、ROE 邊界、Stress Matrix `isInsolvable`、Cyber 風格 UI；補上資料模型、無障礙、邊界條件、Roadmap、Open Questions 等章節 | Engineering |
