/**
 * 借物之光 — 素材產圖腳本 (Gemini / Imagen 4)
 * 依 docs/art-direction-spec.md 的 Prompt 產生點陣素材。
 *
 * 用法:  node scripts/gen-assets.mjs            # 產全部
 *         node scripts/gen-assets.mjs hero a1     # 只產指定 id
 *
 * 金鑰於執行時即時讀取 key.text,不寫入任何輸出或 commit。
 * 注意:Imagen API 不支援透明背景;需疊圖的素材以純墨綠底 (#0d1310) 取代 alpha。
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// Imagen 4 在免費金鑰上配額為 0;改用 Gemini image 模型 (generateContent)。
const MODEL = process.env.GEN_MODEL || 'gemini-2.5-flash-image'
const ENDPOINT = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`

const AR_HINT = {
  '1:1': 'Square 1:1 composition.',
  '16:9': 'Wide 16:9 horizontal banner composition.',
}

const BASE_STYLE =
  'Inspired by Demon Slayer anime, Taisho Roman and traditional Japanese Ukiyo-e aesthetic. ' +
  'Dark forest-green and sumi-ink black palette, antique gold leaf and vermilion accents, ' +
  'washi parchment texture. Elegant, high fidelity, trending on Dribbble, stunning 2D game asset design. '
const NEG =
  ' No text, no watermark, no signature, no modern neon cyberpunk, not blurry, not oversaturated.'

/** @type {{id:string,file:string,ar:string,prompt:string}[]} */
const ASSETS = [
  {
    id: 'a1',
    file: 'public/textures/washi.png',
    ar: '1:1',
    prompt:
      'Seamless tileable traditional Japanese washi paper texture, very dark pine-green and ' +
      'sumi-ink black base, subtle handmade fiber strands, faint sparse gold kintsugi flecks, ' +
      'matte parchment surface, no motif, flat top-down scan, extremely low contrast background overlay.',
  },
  {
    id: 'a2',
    file: 'public/textures/ichimatsu.png',
    ar: '1:1',
    prompt:
      'Seamless tileable Ichimatsu checkerboard pattern from Demon Slayer Tanjiro haori, ' +
      'alternating dark forest-green and black squares, thin antique gold leaf outline on each ' +
      'square edge, traditional Japanese textile weave texture, Taisho-era elegance, matte, flat lay.',
  },
  {
    id: 'a3',
    file: 'public/textures/seigaiha.png',
    ar: '16:9',
    prompt:
      'Ukiyo-e Seigaiha wave pattern inspired by Water Breathing, concentric fan-shaped waves, ' +
      'fine antique gold and teal-blue line work on a deep sumi-green background, flowing elegant ' +
      'Hokusai-influenced linocut texture, horizontal banner composition.',
  },
  {
    id: 'c1',
    file: 'public/ornaments/gold-corner.png',
    ar: '1:1',
    prompt:
      'A single ornate antique gold corner ornament (top-left piece), Taisho-era Art Nouveau meets ' +
      'Japanese kamon crest, delicate filigree with a small water-wave and bamboo-leaf motif, gold ' +
      'leaf foil with slight patina, centered on a flat solid dark sumi-green background.',
  },
  {
    id: 'c2',
    file: 'public/ornaments/wood-frame.png',
    ar: '1:1',
    prompt:
      'Intricate dark lacquered wooden inventory slot frame for a game UI, square frame with carved ' +
      'Japanese cloud and wave patterns, small brass corner fittings and rivets, a thin vermilion cord ' +
      'wrapped around one corner, empty dark center, centered on a flat solid deep blackish-green background.',
  },
  {
    id: 'c3',
    file: 'public/ornaments/katana-meter.png',
    ar: '16:9',
    prompt:
      'A horizontal energy bar shaped like a sheathed katana, the track is a dark green lacquered ' +
      'scabbard with gold trim, the fill is a glowing blade gradient from vermilion to gold light, ' +
      'ornate gold end-caps with a kamon crest, on a flat solid deep blackish-green background.',
  },
  {
    id: 'hero',
    file: 'public/brand/hero.png',
    ar: '16:9',
    prompt:
      'A comprehensive UI hero illustration: dark green and black Ichimatsu checkered background with ' +
      'Water Breathing Ukiyo-e wave motifs, elegant gold and vermilion accents, parchment paper texture, ' +
      'a glowing crescent moon ("borrowed light") casting a golden ray over rolling seigaiha waves, ' +
      'atmospheric, calligraphic vintage retro web elements.',
  },
]

async function gen(key, asset) {
  const prompt = `${BASE_STYLE}${asset.prompt} ${AR_HINT[asset.ar] || ''}${NEG}`
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['IMAGE'] },
  }
  const res = await fetch(ENDPOINT(key), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 300)}`)
  }
  const json = await res.json()
  const parts = json?.candidates?.[0]?.content?.parts || []
  const imgPart = parts.find((p) => p.inlineData?.data)
  if (!imgPart) throw new Error(`no image in response: ${JSON.stringify(json).slice(0, 300)}`)
  const out = resolve(ROOT, asset.file)
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, Buffer.from(imgPart.inlineData.data, 'base64'))
  return out
}

async function main() {
  const key = (await readFile(resolve(ROOT, 'key.text'), 'utf8')).trim()
  const filterIds = process.argv.slice(2).map((s) => s.toLowerCase())
  const todo = filterIds.length ? ASSETS.filter((a) => filterIds.includes(a.id)) : ASSETS

  console.log(`▶ 產生 ${todo.length} 張素材 (model: ${MODEL})\n`)
  for (const a of todo) {
    process.stdout.write(`  [${a.id}] ${a.ar} → ${a.file} ... `)
    try {
      const out = await gen(key, a)
      const { size } = await import('node:fs').then((m) => m.promises.stat(out))
      console.log(`✓ ${(size / 1024).toFixed(0)} KB`)
    } catch (e) {
      console.log(`✗ ${e.message}`)
    }
  }
  console.log('\n完成。')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
