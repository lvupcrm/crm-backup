import axios from 'axios'
import type { 
  ConsultationFormData, 
  RegisteredCustomerFormData, 
  ProductFormData, 
  MessageTemplateFormData, 
  CampaignFormData,
  ConsultationCustomer,
  RegisteredCustomer,
  Product,
  MessageTemplate,
  Campaign
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
  getConsultationCustomers: (search?: string): Promise<ConsultationCustomer[]> =>
    apiClient.get('/customers/consultation', { params: { search } }),
  
  createConsultationCustomer: (customer: ConsultationFormData): Promise<ConsultationCustomer> =>
    apiClient.post('/customers/consultation', customer),
  
  updateConsultationCustomer: (id: string, customer: ConsultationFormData): Promise<ConsultationCustomer> =>
    apiClient.put(`/customers/consultation/${id}`, customer),
  
  deleteConsultationCustomer: (id: string): Promise<void> =>
    apiClient.delete(`/customers/consultation/${id}`),
  
  getRegisteredCustomers: (search?: string): Promise<RegisteredCustomer[]> =>
    apiClient.get('/customers/registered', { params: { search } }),
  
  createRegisteredCustomer: (customer: RegisteredCustomerFormData): Promise<RegisteredCustomer> =>
    apiClient.post('/customers/registered', customer),
  
  updateRegisteredCustomer: (id: string, customer: RegisteredCustomerFormData): Promise<RegisteredCustomer> =>
    apiClient.put(`/customers/registered/${id}`, customer),
  
  deleteRegisteredCustomer: (id: string): Promise<void> =>
    apiClient.delete(`/customers/registered/${id}`),
  
  // Messages
  getTemplates: (): Promise<MessageTemplate[]> => apiClient.get('/messages/templates'),
  
  createTemplate: (template: MessageTemplateFormData): Promise<MessageTemplate> =>
    apiClient.post('/messages/templates', template),
  
  updateTemplate: (id: string, template: MessageTemplateFormData): Promise<MessageTemplate> =>
    apiClient.put(`/messages/templates/${id}`, template),
  
  deleteTemplate: (id: string): Promise<void> =>
    apiClient.delete(`/messages/templates/${id}`),
  
  getCampaigns: (): Promise<Campaign[]> => apiClient.get('/messages/campaigns'),
  
  createCampaign: (campaign: CampaignFormData): Promise<Campaign> =>
    apiClient.post('/messages/campaigns', campaign),
  
  updateCampaign: (id: string, campaign: CampaignFormData): Promise<Campaign> =>
    apiClient.put(`/messages/campaigns/${id}`, campaign),
  
  deleteCampaign: (id: string): Promise<void> =>
    apiClient.delete(`/messages/campaigns/${id}`),
  
  // Products
  getProducts: (): Promise<Product[]> => apiClient.get('/products'),
  
  createProduct: (product: ProductFormData): Promise<Product> =>
    apiClient.post('/products', product),
  
  updateProduct: (id: string, product: ProductFormData): Promise<Product> =>
    apiClient.put(`/products/${id}`, product),
  
  deleteProduct: (id: string): Promise<void> =>
    apiClient.delete(`/products/${id}`),
  
  // Statistics
  getStatistics: () => apiClient.get('/statistics'),
  
  // Payments
  getPayments: () => apiClient.get('/payments'),
}