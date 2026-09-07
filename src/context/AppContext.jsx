import { createContext, useContext, useMemo, useState } from 'react'
import {
  currentUser,
  fiatAccounts as initialFiatAccounts,
  digitalAssets as initialDigitalAssets,
  initialCards,
  initialCardTransactions,
  initialConversions,
  initialActivity,
  notifications as initialNotifications,
  recentContacts,
  myContacts,
} from '../data/mockData.js'

const AppContext = createContext(null)

function genReference(prefix = 'TX') {
  const num = Math.floor(100000 + Math.random() * 900000)
  const suffix = ['AD', 'OD', 'CD', 'WD', 'ED', 'PD', 'BD', 'RD', 'FD', 'XR', 'BT'][
    Math.floor(Math.random() * 11)
  ]
  return `${prefix}-${num}-${suffix}`
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(currentUser)
  const [fiatAccounts, setFiatAccounts] = useState(initialFiatAccounts)
  const [digitalAssets, setDigitalAssets] = useState(initialDigitalAssets)
  const [cards, setCards] = useState(initialCards)
  const [cardTransactions, setCardTransactions] = useState(initialCardTransactions)
  const [conversions, setConversions] = useState(initialConversions)
  const [activity, setActivity] = useState(initialActivity)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [lastReceipt, setLastReceipt] = useState(null)

  function updateAvatar(avatarUrl) {
    setUser((prev) => ({ ...prev, avatar: avatarUrl }))
  }

  function updateUser(updates) {
    setUser((prev) => ({ ...prev, ...updates }))
  }

  const totalPortfolioValue = useMemo(() => {
    const fiat = fiatAccounts.reduce((sum, a) => sum + a.usdEquivalent, 0)
    const digital = digitalAssets.reduce((sum, a) => sum + a.usdEquivalent, 0)
    return fiat + digital
  }, [fiatAccounts, digitalAssets])

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function findAccount(code) {
    return fiatAccounts.find((a) => a.code === code)
  }

  function adjustFiatBalance(code, delta) {
    setFiatAccounts((prev) =>
      prev.map((a) => (a.code === code ? { ...a, balance: a.balance + delta } : a))
    )
  }

  // --- CARD MUTATIONS ---
  function createCard({ label, currency, spendLimit, autoFund, fundingSource }) {
    const last4 = String(Math.floor(1000 + Math.random() * 9000))
    const cardId = `card-${Date.now()}`
    const symbolMap = { USD: '$', NGN: '₦', EUR: '€', GBP: '£' }
    const colorMap = { USD: 'blue', NGN: 'navy', EUR: 'gold', GBP: 'purple' }
    const currencyLabelMap = {
      USD: 'USD (United States Dollar)',
      NGN: 'NGN (Nigerian Naira)',
      EUR: 'EUR (Euro)',
      GBP: 'GBP (British Pound)',
    }

    const newCard = {
      id: cardId,
      label: label || `${currency} Virtual Card`,
      currency,
      currencyLabel: currencyLabelMap[currency] || `${currency} Card`,
      symbol: symbolMap[currency] || '$',
      balance: 0.0,
      spendLimit: parseFloat(spendLimit) || 500.0,
      spentThisMonth: 0.0,
      autoFund: !!autoFund,
      autoFundThreshold: 50.0,
      autoFundTopup: 200.0,
      fundingSource: fundingSource || 'USD Wallet',
      last4,
      cardNumber: `4821 •••• •••• ${last4}`,
      fullCardNumber: `4821 5590 1284 ${last4}`,
      holder: user.name.toUpperCase(),
      expiry: '09/29',
      cvv: String(Math.floor(100 + Math.random() * 900)),
      cardType: 'Virtual Visa Debit',
      network: 'Visa debit international',
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'ACTIVE',
      colorScheme: colorMap[currency] || 'blue',
      txCountThisMonth: 0,
      settings: {
        spendingLimitEnabled: true,
        monthlyLimit: parseFloat(spendLimit) || 500.0,
        perTxLimitEnabled: false,
        perTxLimit: 250.0,
        dailyTxCountEnabled: false,
        dailyTxCount: 5,
        onlineTx: true,
        internationalTx: true,
        contactless: false,
        atmWithdrawals: false,
        txAlerts: true,
        declineAlerts: true,
        summaryEmail: true,
        autoFundEnabled: !!autoFund,
        minThreshold: 50.0,
        topUpAmount: 200.0,
        fundingSource: fundingSource || 'USD Wallet',
      },
    }

    setCards((prev) => [newCard, ...prev])
    return newCard
  }

  function toggleCardFreeze(cardId) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, status: c.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE' }
          : c
      )
    )
  }

  function deleteCard(cardId) {
    setCards((prev) => prev.filter((c) => c.id !== cardId))
  }

  function updateCardLabel(cardId, newLabel) {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, label: newLabel } : c))
    )
  }

  function updateCardSettings(cardId, newSettings) {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, settings: { ...c.settings, ...newSettings } } : c))
    )
  }

  function fundCard(cardId, amount) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId ? { ...c, balance: c.balance + parseFloat(amount) } : c
      )
    )
  }

  // --- TRANSFERS & CONVERSIONS ---
  function sendToContact({ recipient, amount, currency, remark }) {
    const reference = genReference('TX')
    adjustFiatBalance(currency, -amount)
    const record = {
      id: reference,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: `Sent to ${recipient.name}`,
      type: 'Send',
      asset: currency,
      amount,
      direction: 'out',
      fee: 0,
      status: 'Success',
      reference,
    }
    setActivity((prev) => [record, ...prev])
    const receipt = {
      amount,
      currency,
      recipient: recipient.name,
      reference,
      settlementDate: 'Today',
      remark,
    }
    setLastReceipt(receipt)
    return receipt
  }

  function sendToExternalWallet({ asset, address, network, amount, remark }) {
    const reference = genReference('TX')
    const record = {
      id: reference,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: 'External Wallet Transfer',
      type: 'Send',
      asset,
      amount,
      suffix: asset,
      direction: 'out',
      fee: 0,
      status: 'Success',
      reference,
    }
    setActivity((prev) => [record, ...prev])
    const receipt = { amount, currency: asset, recipient: address, reference, network, remark }
    setLastReceipt(receipt)
    return receipt
  }

  function convertAssets({ fromAmount, fromCurrency, toAmount, toCurrency, exchangeRate }) {
    const reference = genReference('CV')
    if (findAccount(fromCurrency)) adjustFiatBalance(fromCurrency, -fromAmount)
    if (findAccount(toCurrency)) adjustFiatBalance(toCurrency, toAmount)

    const newConversion = {
      id: reference,
      date: 'Today',
      fromAmount,
      fromCurrency,
      toAmount,
      toCurrency,
      text: `${fromAmount.toLocaleString()} ${fromCurrency} converted to ${toCurrency}`,
      creditedText: `+${toCurrency === 'NGN' ? '₦' : toCurrency === 'EUR' ? '€' : toCurrency === 'GBP' ? '£' : ''}${toAmount.toLocaleString()}${toCurrency === 'BTC' ? ' BTC' : ''}`,
      reference,
      exchangeRate: exchangeRate || `1 ${fromCurrency} = ${Number(toAmount / fromAmount).toLocaleString()} ${toCurrency}`,
      status: 'SUCCESSFUL',
    }

    setConversions((prev) => [newConversion, ...prev])

    const record = {
      id: reference,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: `${fromCurrency} converted to ${toCurrency}`,
      type: 'Convert',
      asset: `${fromCurrency} → ${toCurrency}`,
      amount: toAmount,
      direction: 'neutral',
      fee: 0,
      status: 'Success',
      reference,
    }
    setActivity((prev) => [record, ...prev])
    return newConversion
  }

  function logout() {
    setUser(currentUser)
  }

  const value = {
    user,
    setUser,
    updateUser,
    updateAvatar,
    logout,
    fiatAccounts,
    digitalAssets,
    cards,
    cardTransactions,
    conversions,
    createCard,
    toggleCardFreeze,
    deleteCard,
    updateCardLabel,
    updateCardSettings,
    fundCard,
    activity,
    notifications,
    unreadCount,
    recentContacts,
    myContacts,
    totalPortfolioValue,
    lastReceipt,
    markAllNotificationsRead,
    sendToContact,
    sendToExternalWallet,
    convertAssets,
    findAccount,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
