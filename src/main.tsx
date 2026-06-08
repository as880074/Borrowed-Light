import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { asset } from '@/lib/asset'

// 和紙紋理 URL 需套用 Vite base(GitHub Pages 子路徑),於 CSS 以 var(--washi-url) 引用。
document.documentElement.style.setProperty('--washi-url', `url("${asset('textures/washi.png')}")`)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
