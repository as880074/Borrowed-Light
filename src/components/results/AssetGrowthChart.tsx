import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { AssetGrowthPoint } from '@/lib/calc/engine'
import { formatCurrency } from '@/lib/utils'

interface Props {
  data: AssetGrowthPoint[]
}

const currencyFormatter = (value: number | string | ReadonlyArray<string | number> | undefined) => {
  const resolved = Array.isArray(value) ? value[0] : value
  return formatCurrency(Number(resolved ?? 0))
}

export function AssetGrowthChart({ data }: Props) {
  return (
    <div>
      <h3 className="mb-3 text-base font-semibold text-gray-800">資產成長走勢</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tickFormatter={(v) => `第${v}年`} tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v: number) => `${(v / 10000).toFixed(0)}萬`} tick={{ fontSize: 11 }} width={55} />
          <Tooltip formatter={(value) => currencyFormatter(value)} labelFormatter={(v) => `第 ${v} 年`} />
          <Legend />
          <Line type="monotone" dataKey="etfValue" name="ETF市值" stroke="#2563eb" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="remainingLoan" name="未償還貸款" stroke="#dc2626" strokeWidth={2} dot={false} strokeDasharray="5 5" />
          <Line type="monotone" dataKey="netWorth" name="淨資產" stroke="#16a34a" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
