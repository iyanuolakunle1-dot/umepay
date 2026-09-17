import api from './api'

export const transactionService = {
  getTransactions: (params) => api.get('/transactions', params),
  getTransactionById: (id) => api.get(`/transactions/${id}`),
  exportStatement: (params) => api.get('/transactions/export', params),
}

export default transactionService
