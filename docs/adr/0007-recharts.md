# ADR-0007 · 選用 Recharts 作為圖表函式庫

- **狀態 / Status**: Accepted
- **日期 / Date**: 2026-05
- **相關 / Related**: PRD §6、ARCHITECTURE §10

## Context

結果頁需要三類圖表：

- 折線圖（資產成長：ETF / 剩餘貸款 / 淨資產）
- ComposedChart（現金流：Bar + Line + Custom dot）
- BarChart（情境比較：三組數值並列）

選型候選：

1. Recharts（React 友善、SVG）
2. Chart.js + react-chartjs-2（Canvas）
3. visx / D3 直接寫
4. Apache ECharts

## Decision

採 **Recharts**。

- 完整 React 元件 API、JSX-friendly
- SVG → CSS / Tailwind 可直接控樣式
- 支援 ComposedChart 與自訂 Dot（CashFlowChart 需要）
- 學習曲線最低，與專案大小相稱

## Alternatives Considered

| 方案 | 優點 | 缺點 | 為何不選 |
| --- | --- | --- | --- |
| Chart.js | 性能好（Canvas） | 樣式不易跟 Tailwind 整合、組合圖較硬 | 風格客製成本高 |
| visx / D3 | 完全可控 | 學習曲線陡、開發慢 | over-engineered |
| ECharts | 功能最廣 | bundle 大（~1MB pre-gzip） | 三張圖不需要 |
| Recharts | React 原生 / 寫法直觀 | 大資料時不如 Canvas 快 | 完全符合需求 |

## Consequences

### Positive

- 三張圖總共 < 200 行 TSX
- Tooltip、Legend、Grid 樣式皆可用 inline style 客製成 cyber 風格

### Negative / Risks

- bundle 較大（gzip 估 ~80KB）
- 若未來需要交易圖 / K 棒，可能要加 Lightweight Charts

### Reversibility

- 每張圖各自為一檔（`results/*Chart.tsx`），可獨立替換實作

## References

- 實作：`src/components/results/*.tsx`
