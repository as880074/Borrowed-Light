import type { EtfDataProvider, EtfInfo } from './EtfDataProvider'

const BASE_URL = 'https://api.finmindtrade.com/api/v4'

interface TaiwanStockPriceResponse {
  data?: Array<{ date: string; close: number }>
}

export class FinMindProvider implements EtfDataProvider {
  async fetchEtfInfo(symbol: string): Promise<EtfInfo> {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 8000)

    try {
      const today = new Date()
      const oneYearAgo = new Date(today)
      oneYearAgo.setFullYear(today.getFullYear() - 1)
      const startDate = oneYearAgo.toISOString().slice(0, 10)
      const endDate = today.toISOString().slice(0, 10)

      const url = new URL(`${BASE_URL}/data`)
      url.searchParams.set('dataset', 'TaiwanStockPrice')
      url.searchParams.set('data_id', symbol)
      url.searchParams.set('start_date', startDate)
      url.searchParams.set('end_date', endDate)

      const res = await fetch(url.toString(), { signal: controller.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const json = (await res.json()) as TaiwanStockPriceResponse
      const data = json.data ?? []
      if (data.length < 2) throw new Error('Insufficient data')

      const latest = data[data.length - 1]
      const earliest = data[0]
      if (!latest || !earliest || earliest.close === 0) {
        throw new Error('Invalid data')
      }

      const priceGrowth = (latest.close - earliest.close) / earliest.close

      return {
        symbol,
        latestPrice: latest.close,
        annualGrowthRateEstimate: priceGrowth,
      }
    } finally {
      clearTimeout(timeout)
    }
  }
}
