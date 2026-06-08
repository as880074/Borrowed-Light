# ADR-0004 · 以 URLSearchParams 做 Pseudo Routing

- **狀態 / Status**: Accepted
- **日期 / Date**: 2026-05
- **相關 / Related**: ADR-0002、ARCHITECTURE §8

## Context

本工具只有兩個邏輯頁：

1. 試算首頁 (input)
2. 試算結果頁 (results)

引入完整路由函式庫（React Router）會帶來：

- 約 30KB gzip 體積
- 額外的 `<BrowserRouter>` / `<Routes>` 心智負擔
- 需處理 nested route、loader、catch-all 等用不上的能力

而我們已經因 ADR-0002 採用 URL 為狀態真實來源，路由也是「狀態的一部分」。

## Decision

以 `URLSearchParams` 的 `page=input|results` 做 pseudo routing：

- `App.tsx` 用 `useState<'input' | 'results'>` 儲存當前頁面
- 初始值：`hasResultsParam() ? 'results' : 'input'`
- 切換：呼叫 `history.pushState(..., buildResultsUrl(...))` + `setPage('results')`
- 監聽 `popstate` 同步 state

## Alternatives Considered

| 方案 | 優點 | 缺點 | 為何不選 |
| --- | --- | --- | --- |
| React Router v6/v7 | 標準、文件多 | 30KB+ 體積、能力多餘 | over-engineered for 2 pages |
| TanStack Router | 型別友善 | 學習成本高 | 同上 |
| `wouter` | 體積小 | 仍需多一份依賴 | 連兩頁也用不到 |
| `URLSearchParams` only | 零依賴 | 自己 handle popstate | 簡單到可接受 |

## Consequences

### Positive

- 路由與狀態共用同一個 URL serializer，無重複邏輯
- Zero dependency
- 從外部直接貼分享連結即可進入結果頁

### Negative / Risks

- 若未來頁面數 ≥ 4 或需要 nested route，需要重構（成本可接受）

### Reversibility

- 升級到 React Router 是直線 refactor：把 `page` state 換成 `<Routes>` 即可

## References

- 實作：`src/App.tsx`、`src/lib/url.ts`
