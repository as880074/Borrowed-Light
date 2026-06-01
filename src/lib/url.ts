import type { FormValues } from './schema'
import { DEFAULT_VALUES } from './schema'

const KEY_MAP: Record<keyof FormValues, string> = {
  loanAmount: 'la',
  annualLoanRatePct: 'lr',
  termYears: 'ty',
  repaymentMethod: 'rm',
  etfSymbol: 'es',
  annualGrowthRatePct: 'gr',
  dividendYieldPct: 'dy',
  dividendPolicy: 'dp',
  customReinvestRatioPct: 'cr',
  ownFunds: 'of',
  dividendTaxRatePct: 'dt',
  tradingTaxRatePct: 'tt',
  brokerageRatePct: 'br',
  brokerageDiscountPct: 'bd',
}

const REVERSE_KEY_MAP = Object.fromEntries(
  Object.entries(KEY_MAP).map(([k, v]) => [v, k]),
) as Record<string, keyof FormValues>

export function serializeToUrl(values: FormValues): string {
  const params = new URLSearchParams()
  for (const [key, shortKey] of Object.entries(KEY_MAP)) {
    const val = values[key as keyof FormValues]
    if (val !== undefined && val !== '') {
      params.set(shortKey, String(val))
    }
  }
  return params.toString()
}

export function deserializeFromUrl(search: string): Partial<FormValues> {
  const params = new URLSearchParams(search)
  const result: Partial<FormValues> = {}

  for (const [shortKey, longKey] of Object.entries(REVERSE_KEY_MAP)) {
    const raw = params.get(shortKey)
    if (raw === null) continue

    const defaultVal = DEFAULT_VALUES[longKey]
    if (typeof defaultVal === 'number') {
      const num = Number.parseFloat(raw)
      if (!Number.isNaN(num)) {
        ;(result as Record<string, unknown>)[longKey] = num
      }
    } else {
      ;(result as Record<string, unknown>)[longKey] = raw
    }
  }

  return result
}

export function hasResultsParam(): boolean {
  return new URLSearchParams(window.location.search).get('page') === 'results'
}

export function buildResultsUrl(values: FormValues): string {
  const params = new URLSearchParams(serializeToUrl(values))
  params.set('page', 'results')
  return `?${params.toString()}`
}

export function buildInputUrl(values: FormValues): string {
  const params = new URLSearchParams(serializeToUrl(values))
  params.set('page', 'input')
  return `?${params.toString()}`
}
