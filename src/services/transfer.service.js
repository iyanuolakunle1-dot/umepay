import api from './api'

export const transferService = {
  getRecentActivity: (params) => api.get('/transfers/activity', params),
  getContacts: () => api.get('/transfers/contacts'),
  sendToContact: (payload) => api.post('/transfers/send', payload),
  sendToExternalWallet: (payload) => api.post('/transfers/external', payload),
}

export default transferService
