export interface EtfInfo {
  symbol: string
  name?: string
  latestPrice?: number
  annualGrowthRateEstimate?: number
  dividendYieldEstimate?: number
}

export interface EtfDataProvider {
  fetchEtfInfo(symbol: string): Promise<EtfInfo>
}
