# ADR-0001 · 採用 Vite + React SPA 而非 Next.js

- **狀態 / Status**: Accepted
- **日期 / Date**: 2026-05
- **相關 / Related**: PRD §9 技術架構、ARCHITECTURE §2

## Context

初版 PRD 草稿提到使用 Next.js 15 + Server Actions。但在實際開發前，重新檢視專案特性：

- 純客戶端計算：所有公式皆可同步算完，無需後端
- 無資料庫、無使用者帳號、無 API
- 第三方資料源 (FinMind) 為使用者主動觸發
- 期望可部署於 GitHub Pages / Cloudflare Pages 等純靜態託管

引入 SSR / Server Actions 等能力會增加：構建複雜度、學習曲線、部署所需 runtime、bundle 體積。

## Decision

採用 **Vite + React 19 SPA**，產出純靜態檔案 (`dist/index.html` + JS/CSS bundle)。

## Alternatives Considered

| 方案 | 優點 | 缺點 | 為何不選 |
| --- | --- | --- | --- |
| Next.js 15 (App Router) | SSR / SEO 友善、生態廣 | 需 Node runtime、構建慢、SPA 場景 over-engineered | MVP 不需 SSR；Server Actions 用不上 |
| Astro | 內容導向時很省 JS | 互動表單仍需 React island，配置麻煩 | 本案幾乎全互動，無內容頁面 |
| Remix | Loader / Action 介面好 | 仍需 server | 同 Next.js |
| Vite + React | 構建快、Bundle 小、純靜態部署 | 需自行處理 routing | 完全符合需求 |

## Consequences

### Positive

- Dev server 啟動 < 1 秒、HMR 即時
- gzip 後 bundle ~245KB，可放任何 CDN
- 無 runtime 維運成本

### Negative / Risks

- 沒有 SSR → 初次載入需 JS；對 SEO 不友善（但本工具不需 SEO）
- 路由需自行實作（見 [ADR-0004](./0004-pseudo-routing.md)）

### Reversibility

- 計算引擎為純函式（[ADR-0003](./0003-pure-calc-engine.md)），可直接移植到 Next.js Server Action
- 元件層為標準 React，遷移成本主要在 routing 與 build config

## References

- Vite docs · https://vite.dev/
