# ADR-0006 · Tailwind v4 + 自訂設計 token，不引 shadcn 模板

- **狀態 / Status**: Accepted
- **日期 / Date**: 2026-06
- **相關 / Related**: PRD §8、ARCHITECTURE §10

## Context

UI 風格定位為「Crypto Trading Terminal · Cyber 暗色 + 紫色霓虹」。市面上常見做法：

1. 直接 copy shadcn/ui 模板，shadow / radius / color 都是 shadcn 預設
2. 用 Material UI / Mantine 等成品庫
3. Tailwind v4 + Radix Primitives + 自訂 token

shadcn/ui 的預設亮色 / 中性配色與本案目標差距很大，套用後仍需大量改寫；其組件結構又會留下用不到的抽象（toast 容器、command palette...）。

## Decision

採方案 3：

- 直接使用 Tailwind v4 的 `@theme` block 定義自訂 token
- 引用 `@radix-ui/*` 原生 primitive（Select / Label / Collapsible / Slot / Tooltip）
- `components/ui/` 為「薄包裝」：只負責 className + Radix 組合，不做業務
- 設計 token 集中於 `src/index.css`：cyber-bg、neon-purple、cyber-panel utility

## Alternatives Considered

| 方案 | 優點 | 缺點 | 為何不選 |
| --- | --- | --- | --- |
| shadcn/ui CLI 安裝 | 元件全套 | 風格差距大、抽象冗餘 | 套了還要拆 |
| Mantine / MUI | 完整 | 樣式高度耦合、難切深色霓虹風 | 換主題成本高 |
| 自寫 | 完全可控 | 工作量大 | 已選此方案 |

## Consequences

### Positive

- 視覺自由度最高
- Bundle 小（沒有 shadcn 預設的 toast / command 等）
- 設計 token 與 utility 集中於一個 CSS file，可快速調色

### Negative / Risks

- 沒有 shadcn 文件 / discord 可問
- 新成員需理解 Tailwind v4 `@theme` 語法

### Reversibility

- 元件 API 與 shadcn 接近（Card / Button / Input / Select），未來想抽換可逐元件遷移

## References

- Tailwind v4 docs · https://tailwindcss.com/docs
- Radix UI · https://www.radix-ui.com/
- 實作：`src/index.css`、`src/components/ui/`
