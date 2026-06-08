# Architecture Decision Records (ADR)

> 紀錄專案在重大技術選型上的決定 · 為什麼選 A 不選 B、後悔了怎麼回滾。

## 為什麼要寫 ADR

- **保留脈絡**：六個月後你（或新成員）會問「為什麼當初不用 Next.js？」ADR 就是答案
- **可追溯**：每個決定都有日期、狀態、替代方案
- **可逆**：若決定被推翻，舊 ADR 標為 `Superseded by ADR-XXXX`，而非刪除

## 狀態說明

| 狀態 | 含義 |
| --- | --- |
| `Proposed` | 提案中，待評估 |
| `Accepted` | 已採用 |
| `Deprecated` | 不再建議，但仍存在 |
| `Superseded by ADR-XXXX` | 已被新決定取代 |

## 索引

| 編號 | 標題 | 狀態 | 日期 |
| --- | --- | --- | --- |
| [0001](./0001-vite-react-spa.md) | 採用 Vite + React SPA 而非 Next.js | Accepted | 2026-05 |
| [0002](./0002-url-as-state.md) | URL 作為唯一狀態來源 | Accepted | 2026-05 |
| [0003](./0003-pure-calc-engine.md) | 計算引擎為純函式無外部依賴 | Accepted | 2026-05 |
| [0004](./0004-pseudo-routing.md) | 以 URLSearchParams 做 pseudo routing | Accepted | 2026-05 |
| [0005](./0005-finmind-direct.md) | FinMind 由瀏覽器直連，不架代理 | Accepted | 2026-05 |
| [0006](./0006-tailwind-v4-tokens.md) | Tailwind v4 + 自訂設計 token，不引 shadcn 模板 | Accepted | 2026-06 |
| [0007](./0007-recharts.md) | 選用 Recharts 作為圖表函式庫 | Accepted | 2026-05 |

## 寫一份新 ADR

1. 複製 [`_template.md`](./_template.md)
2. 命名為 `NNNN-kebab-title.md`（NNNN 為下一個 4 位數）
3. 填寫 Context / Decision / Consequences
4. 在本檔索引加一列
5. 提 PR 給團隊審

## 範本

見 [`_template.md`](./_template.md)。
