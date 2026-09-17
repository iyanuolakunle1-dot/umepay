import api from './api'

export const cardService = {
  getCards: () => api.get('/cards'),
  getCardTransactions: (cardId) => api.get(`/cards/${cardId}/transactions`),
  createCard: (payload) => api.post('/cards', payload),
  toggleFreeze: (cardId) => api.patch(`/cards/${cardId}/freeze`),
  fundCard: (cardId, amount) => api.post(`/cards/${cardId}/fund`, { amount }),
  updateSettings: (cardId, settings) => api.patch(`/cards/${cardId}/settings`, settings),
  deleteCard: (cardId) => api.delete(`/cards/${cardId}`),
}

export default cardService
