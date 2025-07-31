import { User, Role, Branch, ConsultationCustomer, RegisteredCustomer, Product, Payment, MessageTemplate, Campaign, ScheduledMessage } from '@prisma/client'

export type { ConsultationCustomer, RegisteredCustomer }

export type UserWithRelations = User & {
  role: Role
  branch?: Branch | null
}

export type ConsultationCustomerWithRelations = ConsultationCustomer & {
  manager?: User | null
}

export type RegisteredCustomerWithRelations = RegisteredCustomer & {
  trainer?: User | null
  branch: Branch
  payments: Payment[]
}

export type ProductWithRelations = Product & {
  branch?: Branch | null
  payments: Payment[]
}

export type PaymentWithRelations = Payment & {
  customer: RegisteredCustomer
  product: Product
}

export type MessageTemplateWithRelations = MessageTemplate & {
  campaigns: Campaign[]
  scheduledMessages: ScheduledMessage[]
}

export type CampaignWithRelations = Campaign & {
  template: MessageTemplate
}

export type ScheduledMessageWithRelations = ScheduledMessage & {
  template: MessageTemplate
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Dashboard Stats
export interface DashboardStats {
  totalCustomers: number
  newCustomersThisMonth: number
  totalRevenue: number
  revenueThisMonth: number
  activeMemberships: number
  expiringMemberships: number
}

// Chart Data
export interface ChartData {
  name: string
  value: number
}

// Re-export form types from schemas for consistency
export type {
  ConsultationCustomerFormData,
  RegisteredCustomerFormData,
  ProductFormData,
  MessageTemplateFormData,
  CampaignFormData,
  ScheduledMessageFormData,
  PaymentFormData,
  UserFormData,
  UpdateUserFormData,
  LoginFormData,
  BranchFormData,
  RoleFormData,
} from '@/lib/schemas';

// Permission Types
export interface UserPermissions {
  customers: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
  }
  messages: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
    send: boolean
  }
  products: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
  }
  statistics: {
    view: boolean
  }
  settings: {
    view: boolean
    edit: boolean
  }
}

// Session Types
export interface ExtendedSession {
  user: {
    id: string
    email: string
    name: string
    role: string
    roleId: string
    branchId?: string
    permissions: UserPermissions
  }
  expires: string
}