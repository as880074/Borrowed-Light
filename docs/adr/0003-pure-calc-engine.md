# ADR-0003 · 計算引擎為純函式無外部依賴

- **狀態 / Status**: Accepted
- **日期 / Date**: 2026-05
- **相關 / Related**: PRD §6、ARCHITECTURE §9

## Context

計算引擎是這個工具的「真正產品」。需要保證：

- 同樣輸入永遠得同樣結果（可預期）
- 易於單元測試（不要 mock fetch / DOM）
- 未來可在後端、CI、Worker 等不同 runtime 重用
- 不被 React 渲染週期綁住

## Decision

`src/lib/calc/engine.ts` 為**純 TypeScript 函式集**：

- 不 import React
- 不讀寫 DOM / localStorage / cookie
- 不發 fetch
- 不依賴 zod（型別由 caller 把關）
- 邊界條件全部於函式內處理（`r=0`, `n=0`, `ownFunds=0`...）

`CalcParams` / `CalcResult` 為單純 TypeScript 介面，無類別、無 method。

## Alternatives Considered

| 方案 | 優點 | 缺點 | 為何不選 |
| --- | --- | --- | --- |
| 計算邏輯散在元件內 | 不用拆檔 | 重用困難、測試難 | 違反 SRP |
| 計算引擎做成 React Hook (`useCalc`) | 與表單耦合方便 | 不能在非 React 環境跑 | 限制未來性 |
| 引入 zod runtime validation | 防呆 | 引入額外依賴與成本 | 表單層已 validate |

## Consequences

### Positive

- `engine.test.ts` 不需任何 mock，跑 < 50ms
- 可直接複製到 Cloudflare Worker 或 Node.js script 用
- 容易由 LLM / 同事新人理解

### Negative / Risks

- 邊界條件多時，函式內 if-else 會變多（已用早返 + 三方分支處理）

### Reversibility

- 任何時候都可以引入 zod 在 boundary validate，不影響內部邏輯

## References

- 實作：`src/lib/calc/engine.ts`
