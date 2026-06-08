import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ScenarioResult } from '@/lib/calc/engine'

interface Props {
  scenarios: ScenarioResult[]
}

const tooltipStyle = {
  background: 'rgba(24, 34, 27, 0.96)',
  border: '1px solid rgba(201, 164, 92, 0.4)',
  borderRadius: 8,
  fontSize: 12,
  color: '#efe5cf',
  boxShadow: '0 10px 34px -8px rgba(0, 0, 0, 0.6)',
}

const axisTick = { fontSize: 10, fill: '#8e9182', fontFamily: 'JetBrains Mono, monospace' }
const legendStyle = { fontSize: 11, color: '#c7c1a8', paddingTop: 8 }

export function ScenarioChart({ scenarios }: Props) {
  const data = scenarios.map((s) => ({
    label: s.label,
    '淨利潤（萬）': Number.parseFloat((s.netProfit / 10000).toFixed(1)),
    '淨報酬率（%）': Number.parseFloat((s.netReturn * 100).toFixed(2)),
    'ROE（%）': s.roe !== null ? Number.parseFloat((s.roe * 100).toFixed(2)) : 0,
  }))

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-cyber-text">
          <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(201,164,92,0.85)]" />
          情境分析（悲觀 / 基準 / 樂觀）
        </h3>
        <span className="mono-tabular text-[10px] uppercase tracking-[0.2em] text-cyber-text-3">CHART.03</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#33453a" />
          <XAxis dataKey="label" tick={{ ...axisTick, fontFamily: 'Noto Serif TC, serif' }} stroke="#46604f" />
          <YAxis tick={axisTick} stroke="#46604f" />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(201, 164, 92, 0.07)' }} />
          <Legend wrapperStyle={legendStyle} iconType="square" />
          <Bar dataKey="淨利潤（萬）" fill="#c9a45c" fillOpacity={0.72} stroke="#e7c873" strokeWidth={1} />
          <Bar dataKey="淨報酬率（%）" fill="#4ba3b0" fillOpacity={0.65} stroke="#4ba3b0" strokeWidth={1} />
          <Bar dataKey="ROE（%）" fill="#6aa15f" fillOpacity={0.62} stroke="#6aa15f" strokeWidth={1} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
