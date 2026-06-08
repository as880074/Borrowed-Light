import type { CalcResult } from '@/lib/calc/engine'
import { formatCurrency, formatPercent } from '@/lib/utils'

interface KpiCardProps {
  label: string
  code: string
  value: string
  subLabel?: string
  highlight?: 'positive' | 'negative' | 'neutral' | 'accent'
}

function KpiCard({ label, code, value, subLabel, highlight = 'neutral' }: KpiCardProps) {
  const colorMap = {
    positive: 'text-neon-green',
    negative: 'text-neon-red',
    neutral: 'text-cyber-text',
    accent: 'text-neon-purple-bright text-glow-purple',
  }
  const dotMap = {
    positive: 'bg-neon-green shadow-[0_0_8px_rgba(106,161,95,0.75)]',
    negative: 'bg-neon-red shadow-[0_0_8px_rgba(195,57,47,0.75)]',
    neutral: 'bg-cyber-text-3',
    accent: 'bg-gold shadow-[0_0_8px_rgba(201,164,92,0.8)]',
  }

  return (
    <div className="group cyber-panel relative rounded-lg p-3.5 transition-all duration-200 hover:border-gold/40 hover:shadow-[0_0_0_1px_rgba(201,164,92,0.28),0_10px_28px_-12px_rgba(207,74,55,0.38)]">
      <div className="flex items-center justify-between">
        <p className="mono-tabular text-[10px] uppercase tracking-[0.18em] text-cyber-text-3">{label}</p>
        <span className={`h-1.5 w-1.5 rounded-full ${dotMap[highlight]}`} />
      </div>
      <p className={`mono-tabular mt-2 text-[20px] font-semibold leading-tight ${colorMap[highlight]}`}>{value}</p>
      <div className="mt-1.5 flex items-center justify-between">
        <span className="mono-tabular text-[9px] uppercase tracking-[0.2em] text-cyber-text-4">{code}</span>
        {subLabel && <span className="text-[10px] text-cyber-text-3">{subLabel}</span>}
      </div>
    </div>
  )
}

interface Props {
  result: CalcResult
}

export function KpiGrid({ result }: Props) {
  const { monthlyPayment, totalInterest, etfFinalValue, cumulativeDividends, netProfit, netReturn, roe } = result

  const roeStr = roe === null ? '全額槓桿' : formatPercent(roe)
  const roeHighlight: KpiCardProps['highlight'] = roe === null ? 'accent' : roe >= 0 ? 'positive' : 'negative'
  const netHighlight: KpiCardProps['highlight'] = netProfit >= 0 ? 'positive' : 'negative'

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <KpiCard label="每月還款" code="MON.PAY" value={formatCurrency(monthlyPayment)} subLabel="首期" />
      <KpiCard label="總利息支出" code="INT.SUM" value={formatCurrency(totalInterest)} highlight={totalInterest > 0 ? 'negative' : 'neutral'} />
      <KpiCard label="ETF 最終市值" code="ETF.MV" value={formatCurrency(etfFinalValue)} highlight="accent" />
      <KpiCard label="累計現金股息" code="DIV.CUM" value={formatCurrency(cumulativeDividends)} highlight="positive" />
      <KpiCard label="淨利潤" code="NET.PNL" value={formatCurrency(netProfit)} highlight={netHighlight} />
      <KpiCard label="淨報酬率" code="NET.ROI" value={formatPercent(netReturn)} highlight={netReturn >= 0 ? 'positive' : 'negative'} />
      <KpiCard label="ROE" code="EQT.ROE" value={roeStr} highlight={roeHighlight} subLabel="自有資金報酬" />
    </div>
  )
}
