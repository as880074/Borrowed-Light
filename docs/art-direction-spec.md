# 借物之光 ・ 視覺規格書

**大正浪漫 × 鬼滅之刃 和風主題（Taisho Roman × Demon Slayer）**

> 本文件定義「借物之光（Borrowed Light）」ETF 槓桿試算工具的視覺設計系統,
> 並附上所有需要的圖像素材規格與 AI 產圖 Prompt（Midjourney 風格,可直接貼用）。

---

## 1. 設計概念（Concept）

| 主題 | 說明 |
| --- | --- |
| 風格 | 大正浪漫(Taisho Roman)+ 鬼滅之刃和風 + 浮世繪(Ukiyo-e)|
| 紋樣 | 市松紋(Ichimatsu,炭治郎羽織格紋)、青海波(Seigaiha,水之呼吸波紋)|
| 質感 | 和紙(Washi)/ 羊皮紙肌理、墨色暈染、金箔點綴 |
| 字體 | 書道風明朝體 + 復古西文襯線體混排 |
| 氛圍 | 沉穩、典雅、帶有遊戲 UI Kit 的高完成度與儀式感 |

---

## 2. 色彩系統（Color Tokens）

實作於 `src/index.css` 的 `@theme`。命名沿用原 `cyber-*` / `neon-*`(維持相容),語意已轉為和風。

### 基底 — 墨綠黑(Sumi Green-Black)

| Token | Hex | 用途 |
| --- | --- | --- |
| `--color-cyber-bg` | `#0d1310` | 最深底色 |
| `--color-cyber-bg-2` | `#121a15` | 漸層底色 |
| `--color-cyber-panel` | `#18221b` | 面板(和紙)|
| `--color-cyber-panel-2` | `#1f2b23` | 面板亮層 |
| `--color-cyber-panel-3` | `#273428` | hover 面板 |
| `--color-cyber-border` | `#33453a` | 苔綠描邊 |
| `--color-cyber-border-strong` | `#46604f` | 強描邊 |

### 文字 — 生成り和紙(Washi Ivory)

| Token | Hex |
| --- | --- |
| `--color-cyber-text` | `#efe5cf` |
| `--color-cyber-text-2` | `#c7c1a8` |
| `--color-cyber-text-3` | `#8e9182` |
| `--color-cyber-text-4` | `#5f6557` |

### 強調 — 朱・金・水・竹

| Token | Hex | 語意 |
| --- | --- | --- |
| `--color-neon-purple`（主強調）| `#cf4a37` | 朱 / 緋(Vermilion)— 按鈕、焦點 |
| `--color-neon-purple-bright` | `#ec8466` | 朱亮(highlight 文字)|
| `--color-gold` | `#c9a45c` | 金箔 — 邊框、分隔、徽記 |
| `--color-gold-bright` | `#e7c873` | 金亮 |
| `--color-gold-deep` | `#8a6d2f` | 金暗 |
| `--color-neon-cyan` | `#4ba3b0` | 水(Water Breathing teal)|
| `--color-neon-green` | `#6aa15f` | 竹(正向 / 股息)|
| `--color-neon-red` | `#c3392f` | 緋深(危險 / 還款)|

> **配色原則**:朱(實心填充、CTA)+ 金(細線邊框、徽記、分隔)的雙重點綴,
> 墨綠黑承載、和紙象牙作字,水青與竹綠作機能輔助色。

---

## 3. 字體（Typography）

於 `index.html` 以 Google Fonts 載入。

| 變數 | 字體堆疊 | 用途 |
| --- | --- | --- |
| `--font-display` | `Shippori Mincho` → `Noto Serif TC` | 標題(書道明朝)|
| `--font-sans` | `Noto Serif TC` → `Shippori Mincho` | 內文(繁中襯線)|
| `--font-vintage` | `Cinzel` → `Shippori Mincho` | 復古西文大寫(品牌、標籤)|
| `--font-mono` | `JetBrains Mono` | 數字(tabular-nums)、技術標籤 |

---

## 4. 紋樣與材質 Utilities

實作於 `src/index.css`,以 CSS 生成、零圖檔依賴:

| Utility / 元素 | 效果 |
| --- | --- |
| `body::before` | 市松紋(checkerboard)肌理,中央徑向遮罩淡出 |
| `body::after` | 青海波(seigaiha)底部波紋,金/水雙線 |
| `cyber-panel` | 和紙面板 + 金箔 hairline 內框 |
| `cyber-panel-glow` | 金枠強調面板 |
| `text-glow-purple/-cyan/-gold` | 朱 / 水 / 金 文字光暈 |
| `neon-ring` | 金色焦點輪廓 |
| `ichimatsu-rule` | 金朱交錯細格分隔線 |
| `font-vintage` | Cinzel 復古大寫 |

> 以上皆為純 CSS。下節的圖像素材為**選配增強**,用於想再提升質感的場景。

---

## 5. 圖像素材規格書（Image Assets）

以下素材皆為「錦上添花」選配。檔案放置:`public/textures/`、`public/ornaments/`、`public/brand/`。
每項附 **Midjourney 風格 Prompt**(亦適用其他 diffusion 模型,移除 `--ar`/`--style` 參數即可)。

> **已用 Gemini API 產圖**:以下標 ✅ 的素材已透過 `scripts/gen-assets.mjs`
> (模型 `gemini-2.5-flash-image`)產生並存於對應路徑。
>
> 重新產圖:`node scripts/gen-assets.mjs [id...]`(金鑰於執行時讀取 `key.text`)。
> 注意:Gemini/Imagen API **不支援透明背景**,需疊圖的素材(角飾/木框/能量條)已改以
> 深墨綠純底產出,於深色 UI 上可直接合成;若需去背請另行後製。
>
> | id | 檔案 | 狀態 |
> | --- | --- | --- |
> | a1 | `public/textures/washi.png` | ✅ |
> | a2 | `public/textures/ichimatsu.png` | ✅ |
> | a3 | `public/textures/seigaiha.png` | ✅ |
> | c1 | `public/ornaments/gold-corner.png` | ✅ |
> | c2 | `public/ornaments/wood-frame.png` | ✅ |
> | c3 | `public/ornaments/katana-meter.png` | ✅ |
> | hero | `public/brand/hero.png`(已接為 OG 分享圖)| ✅ |
> | b1 | `public/seal.svg`(手繪向量,非產圖)| ✅ |
> | b2 | 刀紋分隔 / toggle | ⬜ 建議 SVG 實作 |
> | d2 | favicon | ✅ 共用 `seal.svg` |

統一負面詞(Negative,適用 SD 系):
`text, watermark, signature, lowres, jpeg artifacts, modern UI, neon cyberpunk, blurry, oversaturated`

---

### A1 ・ 和紙紋理底圖(Washi Paper Texture)

- **用途**:全站背景疊加層(`background-blend-mode: overlay`,透明度 6–10%)
- **規格**:2048×2048 px,可無縫平鋪(seamless tileable),PNG/WebP
- **色調**:深墨綠 `#121a15` 基底,極淡纖維紋理

```
Seamless tileable traditional Japanese washi paper texture, very dark pine-green
and sumi-ink black base, subtle handmade fiber strands, faint gold flecks of
kintsugi dust scattered sparsely, matte parchment surface, extremely subtle and
low-contrast so it works as a background overlay, no pattern motif, flat top-down
scan, high resolution --ar 1:1 --style raw --tile
```

---

### A2 ・ 市松紋樣板(Ichimatsu Checkered Pattern)

- **用途**:Header / Hero 區塊背景,或 Card 角落裝飾
- **規格**:1024×1024 px,seamless tileable,PNG(含透明)
- **色調**:深綠 `#18221b` × 黑 `#0d1310`,金線描邊

```
Seamless tileable Ichimatsu checkerboard pattern from Demon Slayer Tanjiro haori,
alternating dark forest-green and black squares, thin antique gold leaf outline on
each square edge, traditional Japanese textile weave texture, Taisho-era elegance,
matte finish, flat lay, high fidelity --ar 1:1 --style raw --tile
```

---

### A3 ・ 青海波波紋(Seigaiha / Water Breathing Waves)

- **用途**:頁尾、Hero 底緣、結果頁分隔帶
- **規格**:1920×480 px,水平 seamless,PNG(含透明)
- **色調**:水青 `#4ba3b0` + 金 `#c9a45c` 細線,墨綠底

```
Ukiyo-e style Seigaiha wave pattern inspired by Water Breathing from Demon Slayer,
concentric fan-shaped waves, fine antique gold and teal-blue line work on a deep
sumi-green background, flowing elegant Hokusai-influenced linocut texture,
horizontal seamless tile, Taisho Roman aesthetic, high detail --ar 4:1 --style raw --tile
```

---

### B1 ・ 品牌徽記 / 落款印章(Hanko Seal Logo)

- **用途**:Header 左上 Logo、favicon、分享卡浮水印
- **規格**:512×512 px,PNG(透明),另出 32×32 favicon、180×180 apple-touch
- **色調**:朱紅 `#cf4a37` 印泥,金 `#c9a45c` 邊,白字

```
Traditional Japanese hanko seal stamp, square vermilion red ink stamp with a thin
gold border, depicting a stylized crescent moon and a single light ray as a
seal-script kanji-like emblem, hand-carved tenkoku calligraphy feel, slightly
uneven ink texture, isolated on transparent background, centered, high fidelity
logo asset --ar 1:1 --style raw
```

> 主題隱喻:「借物之光」= 月光(借來的光)。徽記以**新月 + 光線**為意象。
>
> **已實作**:`public/seal.svg` —— 手繪向量落款印(朱印泥 + 金箔框 + 象牙新月 + 三道月光),
> 同時作為 header logo 與 favicon(`<link rel="icon">`)。向量格式於任何尺寸皆銳利,
> 若日後需更繁複的雕刻肌理再以上方 Prompt 產點陣圖替換。

---

### B2 ・ 刀紋分隔線 / 切換開關(Katana-Slash Divider & Toggle)

- **用途**:區塊分隔、Toggle/Switch 元件的「劃過」動態素材
- **規格**:1600×120 px(分隔),PNG(透明);Toggle 另出 96×48 px 兩態
- **色調**:金 / 朱 刀光,墨底

```
A single elegant katana slash mark stretching horizontally, glowing thin gold and
vermilion blade-light streak with subtle ink splatter at the ends, motion blur of a
sword cut, traditional Japanese sumi-e brush energy, on transparent dark background,
UI divider asset, high fidelity game UI --ar 13:1 --style raw
```

Toggle(開 / 關兩態):
```
Custom UI toggle switch styled as a katana sheath, the ON state shows the blade
drawn with a glowing gold edge, the OFF state shows the blade sheathed in a dark
lacquered scabbard with a vermilion cord, two states side by side, traditional
Japanese craftsmanship, wooden and metal materials, isolated on transparent
background, high fidelity 2D game UI asset --ar 2:1 --style raw
```

---

### C1 ・ 角落金箔裝飾(Gold Corner Ornament)

- **用途**:Card / 強調面板四角的 corner accent
- **規格**:256×256 px,PNG(透明),需出四向(左上為主,其餘旋轉)
- **色調**:金箔 `#c9a45c` → `#e7c873`

```
Ornate antique gold corner ornament in Taisho-era Art Nouveau meets Japanese
kamon crest style, delicate filigree with a small water-wave and bamboo-leaf
motif, gold leaf foil texture with slight patina, single corner piece (top-left),
isolated on transparent background, high fidelity decorative UI asset --ar 1:1 --style raw
```

---

### C2 ・ 木框庫存格(Wooden-Framed Inventory Slot)

- **用途**:若日後擴充「投資組合 / 情境收藏」格狀 UI 之卡槽框
- **規格**:300×300 px,9-slice 可拉伸,PNG(透明)
- **色調**:深木紋 + 金屬鉚釘 + 朱繩結

```
Intricate dark lacquered wooden inventory slot frame for a game UI, square frame
with carved Japanese cloud and wave patterns on the wood, small brass corner
fittings and rivets, a thin vermilion cord wrapped around one corner, empty center
for content, isolated on transparent background, 9-slice ready, high fidelity 2D
game asset, trending on Dribbble --ar 1:1 --style raw
```

---

### C3 ・ 數值狀態卡 / 刀身能量條(Katana Meter / Status Bar)

- **用途**:KPI 卡、槓桿倍數條、風險壓力條的進度條皮膚
- **規格**:800×80 px,水平,PNG(透明),分「軌道」與「填充」兩層
- **色調**:軌道墨綠 + 金邊;填充朱→金漸層(katana glow)

```
A horizontal health/energy bar shaped like a sheathed katana, the track is a dark
green lacquered scabbard with gold trim, the fill is a glowing blade gradient from
vermilion to gold light, ornate gold end-caps with kamon crest, traditional
Japanese game UI meter, isolated on transparent background, high fidelity 2D game
asset --ar 10:1 --style raw
```

---

### D1 ・ Hero 主視覺 / 開場插畫(Optional Splash)

- **用途**:首屏 / 載入畫面 / 社群分享 OG image
- **規格**:1920×1080 px(`--ar 16:9`),JPG/WebP
- **色調**:全主題集大成

```
A comprehensive UI hero illustration inspired by Demon Slayer anime, Taisho Roman
and traditional Japanese aesthetic. Dark green and black Ichimatsu checkered
pattern background with Water Breathing Ukiyo-e wave motifs, elegant gold and
vermilion accents, parchment paper texture, calligraphic typography mixed with
vintage retro web elements. A glowing crescent moon ("borrowed light") casting a
golden ray over rolling seigaiha waves, atmospheric and elegant, high fidelity,
trending on Dribbble, stunning 2D game asset design --ar 16:9 --style raw
```

---

### D2 ・ Favicon / App Icon

- **用途**:瀏覽器分頁、PWA 圖示
- **規格**:512×512(maskable)、180×180、32×32、16×16
- 直接由 **B1 徽記** 縮放 / 簡化產出;單色版本確保 16px 仍可辨識新月意象。

---

## 6. 落地優先序（Implementation Priority）

| 優先 | 項目 | 狀態 |
| --- | --- | --- |
| P0 | 色彩 token + 字體 + 純 CSS 紋樣(市松 / 青海波 / 和紙) | ✅ 已實作 |
| P1 | B1 徽記 / favicon(新月+光線,手繪 SVG `public/seal.svg`) | ✅ 已實作 |
| P1 | A1 和紙底圖 | ⬜ 待產圖 |
| P2 | C1 金箔角飾、A3 青海波帶、B2 刀紋分隔 | ⬜ 待產圖 |
| P3 | C2 木框格、C3 刀身能量條、D1 Hero | ⬜ 視擴充需求 |

> P0 已純 CSS 完成,網站即刻呈現完整和風視覺;P1 以上素材為漸進增強。
