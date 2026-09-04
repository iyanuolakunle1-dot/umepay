// All data below is static mock data. There is no backend — every "mutation"
// in the app happens in memory via AppContext for the duration of the session.

export const currentUser = {
  name: 'Adaeze Okafor',
  tier: 'Personal Tier 2',
  phone: '+234 812 345 6789',
  email: 'adaeze.okafor@gmail.com',
  avatar: null,
  avatarInitials: 'AO',
  kycVerified: true,
  dailySendLimit: 50000,
  dailyReceiveLimit: null, // null => Unlimited
  universalAccountNumber: '812 345 6789',
}

export const fiatAccounts = [
  {
    id: 'ngn',
    code: 'NGN',
    name: 'Nigerian Naira',
    shortLabel: 'Naira Account',
    accountMask: '•••• 6789',
    bankName: 'Wema Bank',
    accountNumber: '1023471102',
    balance: 4250000,
    usdEquivalent: 2656.25,
    symbol: '₦',
    accent: 'emerald',
    heldForSettlement: 50000,
  },
  {
    id: 'usd',
    code: 'USD',
    name: 'US Dollar Vault',
    shortLabel: 'USD Virtual Vault',
    accountMask: '•••• 1102',
    bankName: 'Standard Chartered',
    accountNumber: '4471029981',
    balance: 2100.5,
    usdEquivalent: 2100.5,
    symbol: '$',
    accent: 'blue',
    tag: 'FedWire Mapped',
  },
  {
    id: 'gbp',
    code: 'GBP',
    name: 'British Pound',
    shortLabel: 'GBP Virtual Account',
    accountMask: '•••• 4591',
    bankName: 'Barclays Bank',
    accountNumber: '00223491',
    balance: 1500.0,
    usdEquivalent: 1920.0,
    symbol: '£',
    accent: 'violet',
  },
]

export const digitalAssets = [
  {
    id: 'usdt',
    code: 'USDT',
    name: 'Tether Stablecoin',
    network: 'ERC-20/Tron',
    balance: 3200.0,
    usdEquivalent: 3200.0,
    changePct: 0.02,
    accent: 'violet',
  },
  {
    id: 'usdc',
    code: 'USDC',
    name: 'USD Coin',
    network: 'ERC-20',
    balance: 1500.25,
    usdEquivalent: 1500.25,
    changePct: -0.01,
    accent: 'blue',
  },
  {
    id: 'btc',
    code: 'BTC',
    name: 'Bitcoin Core',
    network: 'Bitcoin Mainnet',
    balance: 0.0045,
    usdEquivalent: 4493.57,
    changePct: 4.12,
    accent: 'orange',
  },
  {
    id: 'eth',
    code: 'ETH',
    name: 'Ethereum Core',
    network: 'Smart-contract storage',
    balance: 0.125,
    usdEquivalent: 397.45,
    changePct: 2.85,
    accent: 'indigo',
  },
]

export const allocationSplit = [
  { label: 'USD', pct: 35, color: '#2563EB' },
  { label: 'NGN', pct: 40, color: '#EA580C' },
  { label: 'BTC/USDT', pct: 25, color: '#7C3AED' },
]

export const recentContacts = [
  { id: 'c1', name: 'Chinedu', phone: '+234 803 112 3344', initials: 'C' },
  { id: 'c2', name: 'Fatima', phone: '+234 814 990 8877', initials: 'F' },
  { id: 'c3', name: 'Tunde', phone: '+234 809 556 2211', initials: 'T' },
  { id: 'c4', name: 'Kofi', phone: '+233 24 556 9988', initials: 'K' },
  { id: 'c5', name: 'Emma Wilson', phone: '1234567890', initials: 'EW' },
  { id: 'c6', name: 'Sarah Chen', phone: '2345567891', initials: 'SC' },
]

export const myContacts = [
  { id: 'm1', name: 'Andrew Sterling', phone: '812 009 2314', initials: 'AS' },
  { id: 'm2', name: 'Beatriz Gomez', phone: '612 990 1441', initials: 'BG' },
  { id: 'm3', name: 'Charles Osei', phone: '243 556 7789', initials: 'CO' },
]

export const notifications = [
  {
    id: 'n1',
    title: "Emma Wilson accepted your $450.00 transfer",
    time: 'Just now',
    read: false,
  },
  {
    id: 'n2',
    title: 'USDT Deposit of 400.00 confirmed on Ethereum rail',
    time: '2h ago',
    read: false,
  },
  {
    id: 'n3',
    title: 'Verification limits upgraded to Tier 2',
    time: '1d ago',
    read: true,
  },
  {
    id: 'n4',
    title: 'Security alert: login detected from CA, USA',
    time: '3d ago',
    read: true,
  },
]

export const initialActivity = [
  {
    id: 'tx1',
    date: 'Jan 25, 2026',
    time: '10:24 AM',
    description: 'Salary Deposit',
    type: 'Receive',
    asset: 'USD',
    amount: 2500.0,
    direction: 'in',
    fee: 0,
    status: 'Success',
    reference: 'TX-908234-AD',
  },
  {
    id: 'tx2',
    date: 'Jan 24, 2026',
    time: '03:15 PM',
    description: 'Sent to Emma Watson',
    type: 'Send',
    asset: 'USD',
    amount: 450.0,
    direction: 'out',
    fee: 1.5,
    status: 'Success',
    reference: 'TX-112349-OD',
  },
  {
    id: 'tx3',
    date: 'Jan 24, 2026',
    time: '11:02 AM',
    description: 'Crypto Convert',
    type: 'Convert',
    asset: 'USDT → NGN',
    amount: 200000,
    currencyPrefix: '₦',
    direction: 'neutral',
    fee: '1.20 USDT',
    status: 'Success',
    reference: 'TX-883294-CD',
  },
  {
    id: 'tx4',
    date: 'Jan 23, 2026',
    time: '08:40 PM',
    description: 'Merchant Payment',
    type: 'Send',
    asset: 'USD',
    amount: 12.5,
    direction: 'out',
    fee: 0.12,
    status: 'Success',
    reference: 'TX-409123-WD',
  },
  {
    id: 'tx5',
    date: 'Jan 22, 2026',
    time: '01:12 PM',
    description: 'External Wallet Deposit',
    type: 'Receive',
    asset: 'USDT',
    amount: 400.0,
    direction: 'in',
    fee: '0.00 USDT',
    status: 'Success',
    reference: 'TX-773491-ED',
  },
  {
    id: 'tx6',
    date: 'Jan 21, 2026',
    time: '09:05 AM',
    description: 'Withdraw to Wema',
    type: 'Send',
    asset: 'NGN',
    amount: 150000,
    currencyPrefix: '₦',
    direction: 'out',
    fee: '₦150.00',
    status: 'Pending',
    reference: 'TX-302391-PD',
  },
  {
    id: 'tx7',
    date: 'Jan 20, 2026',
    time: '06:12 PM',
    description: 'Buy Bitcoin',
    type: 'Convert',
    asset: 'USD → BTC',
    amount: 0.0045,
    suffix: 'BTC',
    direction: 'neutral',
    fee: 2.0,
    status: 'Success',
    reference: 'TX-102931-BD',
  },
  {
    id: 'tx8',
    date: 'Jan 19, 2026',
    time: '02:30 PM',
    description: 'Refund - Shopify Inc',
    type: 'Receive',
    asset: 'USD',
    amount: 45.0,
    direction: 'in',
    fee: 0,
    status: 'Success',
    reference: 'TX-449102-RD',
  },
  {
    id: 'tx9',
    date: 'Jan 18, 2026',
    time: '11:15 AM',
    description: 'Failed Subscription',
    type: 'Send',
    asset: 'USD',
    amount: 14.99,
    direction: 'out',
    fee: 0,
    status: 'Failed',
    reference: 'TX-990231-FD',
  },
]

export const linkedRails = [
  { id: 'r1', name: 'Wema Bank Rail', tag: '₦ Primary Settlement', initials: 'W' },
  { id: 'r2', name: 'Standard Chartered', tag: '$ Federal Virtual Routing', initials: 'S' },
]

export const supportedReceiveAssets = ['NGN', 'USD', 'USDT', 'USDC', 'BTC', 'ETH']

export const exchangeRates = {
  // rate = 1 unit of "from" in units of "to"
  USD: { NGN: 1580, EUR: 0.92, GBP: 0.79, USDT: 1, USDC: 1, BTC: 0.0000114, ETH: 0.00031 },
  NGN: { USD: 1 / 1580 },
  EUR: { USD: 1.09 },
  GBP: { USD: 1.27 },
}

export const currencyOptions = ['USD', 'NGN', 'EUR', 'GBP', 'USDT', 'USDC', 'BTC', 'ETH']
