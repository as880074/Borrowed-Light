# ADR-0002 · URL 作為唯一狀態來源 (Single Source of Truth)

- **狀態 / Status**: Accepted
- **日期 / Date**: 2026-05
- **相關 / Related**: PRD §9、ARCHITECTURE §7-§8

## Context

試算結果需要可分享（UC-04）。同時為了能在重新整理 / 直接貼上連結時還原試算內容，所有輸入必須是可序列化的。

候選狀態管理方案：

1. Redux / Zustand global store + 額外的分享匯出
2. URL query string 即狀態
3. localStorage + UUID + 短連結

## Decision

採用 **URL query string 作為單一真實來源**。

- `react-hook-form` 持有的內部表單狀態僅為 transient（用於 UI 互動）
- 每次欄位變動：`history.replaceState(..., buildInputUrl(values))`
- 切換頁面：`history.pushState(..., buildResultsUrl(values))`
- 監聽 `popstate` 還原
- 為節省 URL 長度，採用 2 字短鍵映射（`la, lr, ty, ...`，見 ARCHITECTURE §8.2）

## Alternatives Considered

| 方案 | 優點 | 缺點 | 為何不選 |
| --- | --- | --- | --- |
| Redux Toolkit | 生態成熟 | 額外抽象、樣板碼多 | 狀態形狀小，不值得 |
| Zustand | 輕量 | 仍需另外做 URL 同步 | 重複造輪 |
| localStorage + 短連結 | URL 短 | 需後端 KV、無後端時不可行 | 本版本不打算引入後端 |
| URL query string | 零依賴、天然可分享 | URL 可能變長 | 短鍵後實測 < 200 字元 |

## Consequences

### Positive

- 0 額外依賴
- 分享、refresh、瀏覽器上下頁皆免費獲得正確行為
- 容易測試（pure function `serialize` / `deserialize`）

### Negative / Risks

- URL 內容對隱私敏感者可能造成困擾（會出現在分享預覽、瀏覽器歷史）
  - 緩解：URL 不含個資；數字皆為使用者自行輸入的假設值
- 欄位新增時要同步維護 `KEY_MAP`

### Reversibility

- 未來若引入短連結後端，可在 URL 層加 `?s=abc123` 短碼回 fetch 真實參數
- 不影響元件層

## References

- MDN · History API
- 實作：`src/lib/url.ts`
