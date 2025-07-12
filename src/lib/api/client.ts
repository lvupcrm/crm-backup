import axios from 'axios'
import type { 
  ConsultationFormData, 
  RegisteredCustomerFormData, 
  ProductFormData, 
  MessageTemplateFormData, 
  CampaignFormData 
} from '@/lib/types'

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
  getConsultationCustomers: (search?: string) =>
    apiClient.get('/customers/consultation', { params: { search } }),
  
  createConsultationCustomer: (customer: ConsultationFormData) =>
    apiClient.post('/customers/consultation', customer),
  
  updateConsultationCustomer: (id: string, customer: ConsultationFormData) =>
    apiClient.put(`/customers/consultation/${id}`, customer),
  
  deleteConsultationCustomer: (id: string) =>
    apiClient.delete(`/customers/consultation/${id}`),
  
  getRegisteredCustomers: (search?: string) =>
    apiClient.get('/customers/registered', { params: { search } }),
  
  createRegisteredCustomer: (customer: RegisteredCustomerFormData) =>
    apiClient.post('/customers/registered', customer),
  
  updateRegisteredCustomer: (id: string, customer: RegisteredCustomerFormData) =>
    apiClient.put(`/customers/registered/${id}`, customer),
  
  deleteRegisteredCustomer: (id: string) =>
    apiClient.delete(`/customers/registered/${id}`),
  
  // Messages
  getTemplates: () => apiClient.get('/messages/templates'),
  
  createTemplate: (template: MessageTemplateFormData) =>
    apiClient.post('/messages/templates', template),
  
  updateTemplate: (id: string, template: MessageTemplateFormData) =>
    apiClient.put(`/messages/templates/${id}`, template),
  
  deleteTemplate: (id: string) =>
    apiClient.delete(`/messages/templates/${id}`),
  
  getCampaigns: () => apiClient.get('/messages/campaigns'),
  
  createCampaign: (campaign: CampaignFormData) =>
    apiClient.post('/messages/campaigns', campaign),
  
  updateCampaign: (id: string, campaign: CampaignFormData) =>
    apiClient.put(`/messages/campaigns/${id}`, campaign),
  
  deleteCampaign: (id: string) =>
    apiClient.delete(`/messages/campaigns/${id}`),
  
  // Products
  getProducts: () => apiClient.get('/products'),
  
  createProduct: (product: ProductFormData) =>
    apiClient.post('/products', product),
  
  updateProduct: (id: string, product: ProductFormData) =>
    apiClient.put(`/products/${id}`, product),
  
  deleteProduct: (id: string) =>
    apiClient.delete(`/products/${id}`),
  
  // Statistics
  getStatistics: () => apiClient.get('/statistics'),
  
  // Payments
  getPayments: () => apiClient.get('/payments'),
}