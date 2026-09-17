import api from './api'

export const walletService = {
  getFiatAccounts: () => api.get('/wallets/fiat'),
  getDigitalAssets: () => api.get('/wallets/digital'),
  linkBankAccount: (payload) => api.post('/wallets/link', payload),
  convertAssets: (payload) => api.post('/wallets/convert', payload),
  getExchangeRates: () => api.get('/wallets/rates'),
}

export default walletService
