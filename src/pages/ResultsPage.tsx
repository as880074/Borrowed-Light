import type { CalcResult } from '@/lib/calc/engine'
import type { FormValues } from '@/lib/schema'
import { KpiGrid } from '@/components/results/KpiGrid'
import { AssetGrowthChart } from '@/components/results/AssetGrowthChart'
import { CashFlowChart } from '@/components/results/CashFlowChart'
import { ScenarioChart } from '@/components/results/ScenarioChart'
import { RiskTable } from '@/components/results/RiskTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Share2 } from 'lucide-react'
import { buildResultsUrl } from '@/lib/url'
import { formatNumber } from '@/lib/utils'

interface Props {
  result: CalcResult
  formValues: FormValues
  onBack: () => void
}

export function ResultsPage({ result, formValues, onBack }: Props) {
  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}${buildResultsUrl(formValues)}`
    try {
      await navigator.clipboard.writeText(url)
      window.alert('連結已複製到剪貼簿！')
    } catch {
      window.prompt('複製以下連結分享：', url)
    }
  }

  const { loanResult } = result
  const repayMethodLabels: Record<FormValues['repaymentMethod'], string> = {
    amortized: '本息均攤',
    'equal-principal': '本金均攤',
    'interest-only': '只還利息',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              返回修改
            </Button>
            <h1 className="hidden text-lg font-bold text-gray-900 sm:block">試算結果</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-1 h-4 w-4" />
            分享結果
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
              <span>貸款：<strong>{formatNumber(formValues.loanAmount)}</strong> 元</span>
              <span>利率：<strong>{formValues.annualLoanRatePct}%</strong></span>
              <span>年期：<strong>{formValues.termYears}</strong> 年</span>
              <span>還款：<strong>{repayMethodLabels[formValues.repaymentMethod]}</strong></span>
              <span>年化成長：<strong>{formValues.annualGrowthRatePct}%</strong></span>
              <span>殖利率：<strong>{formValues.dividendYieldPct}%</strong></span>
              <span>自有資金：<strong>{formatNumber(formValues.ownFunds)}</strong> 元</span>
              <span>總利息：<strong>{formatNumber(loanResult.totalInterest)}</strong> 元</span>
            </div>
          </CardContent>
        </Card>

        <KpiGrid result={result} />

        <Card>
          <CardContent className="space-y-8 p-4 sm:p-6">
            <AssetGrowthChart data={result.assetGrowthData} />
            <CashFlowChart data={result.cashFlowData} />
            <ScenarioChart scenarios={result.scenarios} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <RiskTable rows={result.riskRows} />
          </CardContent>
        </Card>

        <p className="pb-4 text-center text-xs text-gray-400">本試算工具僅供參考，不構成投資建議。槓桿投資具有風險，請審慎評估自身財務狀況。</p>
      </main>
    </div>
  )
}
