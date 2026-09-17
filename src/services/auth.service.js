import api from './api'

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials)
    if (res?.token) {
      localStorage.setItem('umepay_token', res.token)
    }
    return res
  },

  register: async (payload) => {
    const res = await api.post('/auth/register', payload)
    if (res?.token) {
      localStorage.setItem('umepay_token', res.token)
    }
    return res
  },

  verifyOtp: (payload) => api.post('/auth/verify-otp', payload),
  resendOtp: (payload) => api.post('/auth/resend-otp', payload),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/profile', data),
  submitKyc: (data) => api.post('/kyc/submit', data),
  getKycStatus: () => api.get('/kyc/status'),
  logout: () => {
    localStorage.removeItem('umepay_token')
  },
}

export default authService
