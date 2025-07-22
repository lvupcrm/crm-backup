import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const api = {
  // Customers
  getConsultationCustomers: (params?: any) =>
    apiClient.get('/customers/consultation', { params }),
  
  createConsultationCustomer: (customer: any) =>
    apiClient.post('/customers/consultation', customer),
  
  updateConsultationCustomer: (id: string, customer: any) =>
    apiClient.put(`/customers/consultation/${id}`, customer),
  
  deleteConsultationCustomer: (id: string) =>
    apiClient.delete(`/customers/consultation/${id}`),
  
  getRegisteredCustomers: (search?: string) =>
    apiClient.get('/customers/registered', { params: { search } }),
  
  createRegisteredCustomer: (customer: any) =>
    apiClient.post('/customers/registered', customer),
  
  updateRegisteredCustomer: (id: string, customer: any) =>
    apiClient.put(`/customers/registered/${id}`, customer),
  
  deleteRegisteredCustomer: (id: string) =>
    apiClient.delete(`/customers/registered/${id}`),
  
  // Messages
  getTemplates: () => apiClient.get('/messages/templates'),
  
  createTemplate: (template: any) =>
    apiClient.post('/messages/templates', template),
  
  updateTemplate: (id: string, template: any) =>
    apiClient.put(`/messages/templates/${id}`, template),
  
  deleteTemplate: (id: string) =>
    apiClient.delete(`/messages/templates/${id}`),
  
  getCampaigns: () => apiClient.get('/messages/campaigns'),
  
  createCampaign: (campaign: any) =>
    apiClient.post('/messages/campaigns', campaign),
  
  updateCampaign: (id: string, campaign: any) =>
    apiClient.put(`/messages/campaigns/${id}`, campaign),
  
  deleteCampaign: (id: string) =>
    apiClient.delete(`/messages/campaigns/${id}`),
  
  // Products
  getProducts: () => apiClient.get('/products'),
  
  createProduct: (product: any) =>
    apiClient.post('/products', product),
  
  updateProduct: (id: string, product: any) =>
    apiClient.put(`/products/${id}`, product),
  
  deleteProduct: (id: string) =>
    apiClient.delete(`/products/${id}`),
  
  // Statistics
  getDashboardStats: () => apiClient.get('/statistics/dashboard'),
  
  getRecentRegisteredCustomers: () => apiClient.get('/statistics/recent-customers'),
}