const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

async function request(endpoint, options = {}) {
  const { method = 'GET', body, params, headers = {}, ...customConfig } = options
  const token = localStorage.getItem('umepay_token')

  let url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`

  if (params) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString()
    if (query) url += `?${query}`
  }

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...customConfig,
  }

  if (body) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  const res = await fetch(url, config)

  if (res.status === 401) {
    localStorage.removeItem('umepay_token')
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const error = new Error(data?.message || `Request failed with status ${res.status}`)
    error.status = res.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  get: (url, params, config) => request(url, { ...config, method: 'GET', params }),
  post: (url, body, config) => request(url, { ...config, method: 'POST', body }),
  put: (url, body, config) => request(url, { ...config, method: 'PUT', body }),
  patch: (url, body, config) => request(url, { ...config, method: 'PATCH', body }),
  delete: (url, config) => request(url, { ...config, method: 'DELETE' }),
}

export default api
