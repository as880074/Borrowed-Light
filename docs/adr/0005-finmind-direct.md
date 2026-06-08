# ADR-0005 · FinMind 由瀏覽器直連，不架代理

- **狀態 / Status**: Accepted（短期）
- **日期 / Date**: 2026-05
- **相關 / Related**: PRD §12、ARCHITECTURE §11

## Context

「自動帶入」功能需要呼叫 FinMind REST API：

```
GET https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPrice&data_id=...
```

選項：

1. 瀏覽器直接 `fetch`（依賴 FinMind 開 CORS）
2. 自建 Cloudflare Worker 代理
3. 服務化（Next.js Route Handler / 後端）

## Decision

短期採方案 1：**瀏覽器直接 `fetch` FinMind**。

- 不需要架基礎設施
- 與「無後端」的整體架構一致
- 若 CORS 被擋或配額爆掉，UI 層已設計為「失敗不阻擋手動輸入」

## Alternatives Considered

| 方案 | 優點 | 缺點 | 為何不選（短期） |
| --- | --- | --- | --- |
| Worker 代理 | 隱藏 API token、可加快取、繞 CORS | 多一份基礎設施 | MVP 不需要 |
| 後端服務 | 同上 + 配額管理 | 需主機、CI/CD | 違背 SPA 架構 |
| 完全不接 API | 簡單 | 失去自動帶入功能 | UX 倒退 |

## Consequences

### Positive

- 0 維運成本
- 失敗 fallback 已具備（顯示警示、不阻擋）

### Negative / Risks

- 一旦 FinMind 關閉 CORS 或限速，功能會失效
- 無 server-side cache：每次點按鈕都會直打 FinMind
- 若未來換成需要 token 的資料源，無法把 token 藏在前端

### Reversibility

- `EtfDataProvider` 介面已抽象化（[ARCHITECTURE §11](../ARCHITECTURE.md)）
- 切換為 `WorkerProxyProvider` 只需新增 class + EtfSection 替換注入

## Review Triggers

以下任一發生時，應重新評估本 ADR：

- FinMind 連續 7 天以上呼叫失敗
- 需要使用付費 / 帶 token 的資料源
- 配額頻繁打滿
