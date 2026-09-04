import { useMemo, useState } from 'react'
import { ArrowLeftRight, Clock } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import Card, { CardHeader } from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { currencyOptions, exchangeRates } from '../data/mockData.js'

function getRate(from, to) {
  if (from === to) return 1
  if (exchangeRates[from]?.[to]) return exchangeRates[from][to]
  if (exchangeRates[to]?.[from]) return 1 / exchangeRates[to][from]
  // route through USD as a bridge currency
  const fromToUsd = from === 'USD' ? 1 : exchangeRates[from]?.USD || 1 / (exchangeRates.USD?.[from] || 1)
  const usdToTarget = to === 'USD' ? 1 : exchangeRates.USD?.[to] || 1
  return fromToUsd * usdToTarget
}

const symbolFor = { USD: '$', NGN: '₦', EUR: '€', GBP: '£' }

export default function CurrencyConversion() {
  const { fiatAccounts, findAccount, convertAssets } = useApp()
  const toast = useToast()

  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('NGN')
  const [fromAmount, setFromAmount] = useState('500.00')
  const [slippage, setSlippage] = useState('0.5%')
  const [converting, setConverting] = useState(false)
  const [recent, setRecent] = useState([
    { id: 'rc1', date: 'Jan 24, 2026', label: '100.00 USD converted to NGN', value: '+₦158,000.00' },
    { id: 'rc2', date: 'Jan 20, 2026', label: '250.00 USD converted to BTC', value: '+0.0045 BTC' },
  ])

  const rate = useMemo(() => getRate(fromCurrency, toCurrency), [fromCurrency, toCurrency])
  const toAmount = (parseFloat(fromAmount || 0) * rate).toLocaleString(undefined, {
    maximumFractionDigits: toCurrency === 'BTC' || toCurrency === 'ETH' ? 6 : 2,
  })

  const fromAccount = findAccount(fromCurrency)

  function swap() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  function handleConvert(e) {
    e.preventDefault()
    setConverting(true)
    setTimeout(() => {
      setConverting(false)
      const numericTo = parseFloat(fromAmount || 0) * rate
      convertAssets({
        fromAmount: parseFloat(fromAmount || 0),
        fromCurrency,
        toAmount: numericTo,
        toCurrency,
      })
      setRecent((prev) => [
        {
          id: `rc-${Date.now()}`,
          date: 'Today',
          label: `${parseFloat(fromAmount).toLocaleString()} ${fromCurrency} converted to ${toCurrency}`,
          value: `+${numericTo.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${toCurrency}`,
        },
        ...prev,
      ])
      toast.success('Conversion complete', `${fromAmount} ${fromCurrency} → ${toAmount} ${toCurrency}`)
    }, 1000)
  }

  return (
    <DashboardLayout title="Currency Conversion">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-ink-900">Instant Conversion Protocol</h3>
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Clock size={14} /> Exchange rate last updated: just now
            </span>
          </div>

          <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-center">
            <div className="rounded-xl border border-slate-200 px-4 py-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  From (Debit Asset)
                </span>
                {fromAccount && (
                  <span className="text-xs text-slate-400">
                    Available: {fromAccount.symbol}
                    {fromAccount.balance.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <input
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="text-2xl font-extrabold text-ink-900 outline-none min-w-0 w-full"
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="text-sm font-semibold text-ink-800 bg-slate-50 rounded-lg px-2.5 py-1.5 outline-none shrink-0"
                >
                  {currencyOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={swap}
              aria-label="Swap currencies"
              className="h-10 w-10 rounded-full bg-ink-800 text-white grid place-items-center mx-auto hover:bg-ink-900 transition-colors rotate-90 sm:rotate-0"
            >
              <ArrowLeftRight size={16} />
            </button>

            <div className="rounded-xl border border-slate-200 px-4 py-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  To (Credit Asset)
                </span>
                <span className="text-xs text-slate-400">
                  Rate: {symbolFor[toCurrency] || ''}
                  {rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} / {fromCurrency}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-2xl font-extrabold text-ink-900 truncate">{toAmount}</span>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-lg px-2.5 py-1.5 outline-none shrink-0"
                >
                  {currencyOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-400 mb-1">Exchange Rate</p>
              <p className="text-sm font-bold text-ink-900">
                1 {fromCurrency} = {rate.toLocaleString(undefined, { maximumFractionDigits: 6 })}{' '}
                {toCurrency}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-400 mb-1">Conversion Fee</p>
              <p className="text-sm font-bold text-emerald-600">$0.00 USD (Zero Fee Conversion)</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-400 mb-1.5">Slippage Tolerance</p>
              <div className="flex gap-1.5">
                {['0.5%', '1.0%', 'Custom'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlippage(s)}
                    className={`text-xs font-semibold px-2 py-1 rounded-md transition-colors ${
                      slippage === s ? 'bg-ink-800 text-white' : 'text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleConvert}>
            <Button type="submit" fullWidth size="lg" className="mt-5" loading={converting}>
              Convert Assets
            </Button>
          </form>
        </Card>

        <Card>
          <CardHeader title="Recent Currency Conversions" />
          <div className="divide-y divide-slate-50">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-400 w-28 shrink-0">{r.date}</span>
                <span className="text-sm font-semibold text-ink-900 flex-1 text-center px-2">
                  {r.label}
                </span>
                <span className="text-sm font-bold text-emerald-600 w-32 text-right shrink-0">
                  {r.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
