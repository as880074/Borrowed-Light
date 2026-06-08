import { Calculator, TrendingUp, TrendingDown, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { LivePreview } from './useLivePreview'

interface Props {
  preview: LivePreview
  onSubmit: () => void
  isValid: boolean
}

interface RowProps {
  label: string
  code: string
  value: string
  tone?: 'neutral' | 'accent' | 'positive' | 'negative' | 'amber'
}

function Row({ label, code, value, tone = 'neutral' }: RowProps) {
  const toneClass = {
    neutral: 'text-cyber-text',
    accent: 'text-neon-purple-bright text-glow-purple',
    positive: 'text-neon-green',
    negative: 'text-neon-red',
    amber: 'text-neon-amber',
  }[tone]

  return (
    <div className="flex items-center justify-between gap-3 border-b border-cyber-border/40 py-2.5 last:border-b-0">
      <div className="flex flex-col">
        <span className="text-[13px] text-cyber-text-2">{label}</span>
        <span className="mono-tabular text-[9px] uppercase tracking-[0.18em] text-cyber-text-4">{code}</span>
      </div>
      <span className={`mono-tabular text-[17px] font-semibold tabular-nums ${toneClass}`}>{value}</span>
    </div>
  )
}

export function LivePreviewSidebar({ preview, onSubmit, isValid }: Props) {
  const { result, totalCapital, leverage, ready } = preview
  const leverageHot = leverage !== null && leverage >= 3
  const netReturn = result?.netReturn ?? 0
  const profitTone = netReturn >= 0 ? 'positive' : 'negative'

  return (
    <aside className="hidden lg:block lg:col-span-5">
      <div className="sticky top-[92px]">
        <div className="cyber-panel-glow rounded-xl">
          <div className="flex items-center justify-between border-b border-cyber-border/70 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(201,164,92,0.85)] pulse-dot" />
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-cyber-text">
                即時試算
              </h2>
            </div>
            <span className="mono-tabular text-[10px] uppercase tracking-[0.2em] text-cyber-text-3">
              LIVE
            </span>
          </div>

          <div className="px-5 py-2">
            <Row
              label="每月還款"
              code="MON.PAY"
              value={ready && result ? formatCurrency(result.monthlyPayment) : '—'}
            />
            <Row
              label="總投入本金"
              code="CAPITAL.0"
              value={formatCurrency(totalCapital)}
            />
            <Row
              label="槓桿倍數"
              code="LEV.X"
              value={leverage === null ? '∞' : `${leverage.toFixed(1)}x`}
              tone={leverageHot ? 'amber' : 'accent'}
            />
            <Row
              label="總利息支出"
              code="INT.SUM"
              value={ready && result ? formatCurrency(result.totalInterest) : '—'}
              tone={ready && result && result.totalInterest > 0 ? 'negative' : 'neutral'}
            />
            <Row
              label="預估期末市值"
              code="ETF.MV"
              value={ready && result ? formatCurrency(result.etfFinalValue) : '—'}
              tone="accent"
            />
            <Row
              label="預估淨利潤"
              code="NET.PNL"
              value={ready && result ? formatCurrency(result.netProfit) : '—'}
              tone={ready && result ? profitTone : 'neutral'}
            />
            <Row
              label="預估淨報酬率"
              code="NET.ROI"
              value={ready && result ? formatPercent(result.netReturn) : '—'}
              tone={ready && result ? profitTone : 'neutral'}
            />
            <Row
              label="ROE 自有資金報酬"
              code="EQT.ROE"
              value={ready && result ? (result.roe === null ? '全額槓桿' : formatPercent(result.roe)) : '—'}
              tone={ready && result && result.roe !== null && result.roe >= 0 ? 'positive' : ready && result && result.roe !== null ? 'negative' : 'accent'}
            />
          </div>

          {leverageHot && (
            <div className="mx-5 mb-3 flex items-center gap-2 rounded-md border border-neon-amber/40 bg-neon-amber/[0.08] px-3 py-2 text-[11px] text-neon-amber">
              <Zap className="h-3.5 w-3.5 flex-shrink-0" />
              <span>槓桿倍數 ≥ 3x · 屬高風險策略，請審慎評估</span>
            </div>
          )}

          <div className="border-t border-cyber-border/70 p-4">
            <Button size="lg" className="w-full" type="button" onClick={onSubmit} disabled={!isValid}>
              {netReturn >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              <span>立即試算詳細結果</span>
            </Button>
            <p className="mono-tabular mt-2 text-center text-[10px] uppercase tracking-[0.18em] text-cyber-text-4">
              {isValid ? '右上角的數字會即時變化' : '請先完成必填欄位'}
            </p>
          </div>
        </div>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-cyber-text-4">
          <Calculator className="h-3 w-3" />
          純前端計算 · 不上傳任何資料
        </p>
      </div>
    </aside>
  )
}
