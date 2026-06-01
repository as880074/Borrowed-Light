import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ScenarioResult } from '@/lib/calc/engine'

interface Props {
  scenarios: ScenarioResult[]
}

export function ScenarioChart({ scenarios }: Props) {
  const data = scenarios.map((s) => ({
    label: s.label,
    '淨利潤（萬）': Number.parseFloat((s.netProfit / 10000).toFixed(1)),
    '淨報酬率（%）': Number.parseFloat((s.netReturn * 100).toFixed(2)),
    'ROE（%）': s.roe !== null ? Number.parseFloat((s.roe * 100).toFixed(2)) : 0,
  }))

  return (
    <div>
      <h3 className="mb-3 text-base font-semibold text-gray-800">情境分析（悲觀 / 基準 / 樂觀）</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="淨利潤（萬）" fill="#3b82f6" />
          <Bar dataKey="淨報酬率（%）" fill="#10b981" />
          <Bar dataKey="ROE（%）" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
