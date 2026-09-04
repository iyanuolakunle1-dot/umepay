import { createContext, useContext, useMemo, useState } from 'react'
import {
  currentUser,
  fiatAccounts as initialFiatAccounts,
  digitalAssets as initialDigitalAssets,
  initialActivity,
  notifications as initialNotifications,
  recentContacts,
  myContacts,
} from '../data/mockData.js'

const AppContext = createContext(null)

function genReference() {
  const num = Math.floor(100000 + Math.random() * 900000)
  const suffix = ['AD', 'OD', 'CD', 'WD', 'ED', 'PD', 'BD', 'RD', 'FD'][
    Math.floor(Math.random() * 9)
  ]
  return `TX-${num}-${suffix}`
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(currentUser)
  const [fiatAccounts, setFiatAccounts] = useState(initialFiatAccounts)
  const [digitalAssets] = useState(initialDigitalAssets)
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

  function sendToContact({ recipient, amount, currency, remark }) {
    const reference = genReference()
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
    const reference = genReference()
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

  function convertAssets({ fromAmount, fromCurrency, toAmount, toCurrency }) {
    const reference = genReference()
    if (findAccount(fromCurrency)) adjustFiatBalance(fromCurrency, -fromAmount)
    if (findAccount(toCurrency)) adjustFiatBalance(toCurrency, toAmount)
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
    return record
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
