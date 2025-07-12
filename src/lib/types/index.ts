import { User, Role, Branch, ConsultationCustomer, RegisteredCustomer, Product, Payment, MessageTemplate, Campaign, ScheduledMessage } from '@prisma/client'
import 'next-auth'
import 'next-auth/jwt'

// Prisma 기본 타입들 export
export type { User, Role, Branch, ConsultationCustomer, RegisteredCustomer, Product, Payment, MessageTemplate, Campaign, ScheduledMessage }

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
export interface ApiResponse<T = unknown> {
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

// Form Types
export interface CustomerFormData {
  name: string
  phone: string
  email?: string
  memo?: string
}

export interface ConsultationFormData extends CustomerFormData {
  appointmentDate: Date
  inquiryChannel: string
  sport: string
  appointmentPurpose: string
  consultationStatus: string
  registrationStatus: string
}

export interface RegisteredCustomerFormData extends CustomerFormData {
  joinDate: Date
  membershipType: string
  membershipExpiry: Date
  trainerId?: string
  branchId: string
  status: string
}

export interface ProductFormData {
  productName: string
  description?: string
  price: number
  validityPeriod: number
  branchId?: string
  isActive: boolean
}

export interface MessageTemplateFormData {
  templateName: string
  channel: string
  templateCode?: string
  content: string
  variables: string[]
}

export interface CampaignFormData {
  campaignName: string
  description?: string
  sendCondition: string
  templateId: string
  isActive: boolean
}

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

// NextAuth 타입 확장
declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    role: string
    roleId: string
    branchId?: string
    permissions: UserPermissions
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      roleId: string
      branchId?: string
      permissions: UserPermissions
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    roleId: string
    branchId?: string
    permissions: UserPermissions
  }
}