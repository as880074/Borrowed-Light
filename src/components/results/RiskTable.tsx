import type { RiskRow } from '@/lib/calc/engine'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface Props {
  rows: RiskRow[]
}

export function RiskTable({ rows }: Props) {
  return (
    <div>
      <h3 className="mb-3 text-base font-semibold text-gray-800">風險試算：ETF 跌幅情境（以投入當下試算）</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 pr-4 text-left font-medium text-gray-600">ETF跌幅</th>
              <th className="py-2 pr-4 text-right font-medium text-gray-600">ETF市值</th>
              <th className="py-2 pr-4 text-right font-medium text-gray-600">未償還貸款</th>
              <th className="py-2 text-right font-medium text-gray-600">淨資產</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.dropPct} className={`border-b border-gray-100 ${row.isInsolvable ? 'bg-red-50' : ''}`}>
                <td className="py-2.5 pr-4 font-medium text-gray-700">
                  <span className="text-red-600">▼{(row.dropPct * 100).toFixed(0)}%</span>
                </td>
                <td className="py-2.5 pr-4 text-right text-gray-700">{formatCurrency(row.etfValue)}</td>
                <td className="py-2.5 pr-4 text-right text-gray-700">{formatCurrency(row.remainingLoan)}</td>
                <td className="py-2.5 text-right">
                  <span className={row.netWorth < 0 ? 'font-semibold text-red-600' : 'text-gray-700'}>{formatCurrency(row.netWorth)}</span>
                  {row.isInsolvable && <Badge variant="destructive" className="ml-2 text-xs">資不抵債</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-400">* 此表假設在投入當下（第0年）ETF即時下跌，以評估最壞情境之槓桿風險。</p>
    </div>
  )
}
