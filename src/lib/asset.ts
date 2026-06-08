/**
 * 解析 public/ 靜態素材的 URL,自動套用 Vite base。
 * 開發時 base = '/';GitHub Pages 專案站台 base = '/Borrowed-Light/'。
 * 用法:asset('seal.svg') → '/Borrowed-Light/seal.svg'
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}
