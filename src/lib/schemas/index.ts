import { z } from 'zod';

// 공통 스키마
export const phoneSchema = z.string()
  .min(10, '전화번호는 최소 10자리여야 합니다')
  .max(15, '전화번호는 최대 15자리까지 가능합니다')
  .regex(/^[0-9-+\s()]+$/, '올바른 전화번호 형식이 아닙니다');

export const emailSchema = z.string()
  .email('올바른 이메일 형식이 아닙니다')
  .optional()
  .or(z.literal(''));

export const dateSchema = z.string()
  .refine((date) => !isNaN(Date.parse(date)), '올바른 날짜를 입력해주세요');

export const priceSchema = z.number()
  .min(0, '가격은 0 이상이어야 합니다')
  .max(10000000, '가격이 너무 높습니다');

// 상담고객 스키마
export const consultationCustomerSchema = z.object({
  name: z.string()
    .min(1, '이름은 필수입니다')
    .max(50, '이름은 50자 이하여야 합니다')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문, 공백만 입력 가능합니다'),
  phone: phoneSchema,
  email: emailSchema,
  appointmentDate: dateSchema,
  inquiryChannel: z.string()
    .min(1, '문의경로는 필수입니다')
    .max(50, '문의경로는 50자 이하여야 합니다'),
  sport: z.string()
    .min(1, '종목은 필수입니다')
    .max(50, '종목은 50자 이하여야 합니다'),
  appointmentPurpose: z.enum(['상담', '체험', '기타'], {
    required_error: '예약목적을 선택해주세요',
  }),
  consultationStatus: z.enum(['미상담', '상담완료'], {
    required_error: '상담상태를 선택해주세요',
  }).default('미상담'),
  registrationStatus: z.enum(['미등록', '등록완료'], {
    required_error: '등록상태를 선택해주세요',
  }).default('미등록'),
  managerId: z.string().uuid('올바른 관리자 ID가 아닙니다').optional(),
  memo: z.string().max(1000, '메모는 1000자 이하여야 합니다').optional(),
});

export const updateConsultationCustomerSchema = consultationCustomerSchema.partial();

export type ConsultationCustomerFormData = z.infer<typeof consultationCustomerSchema>;

// 등록회원 스키마
export const registeredCustomerSchema = z.object({
  name: z.string()
    .min(1, '이름은 필수입니다')
    .max(50, '이름은 50자 이하여야 합니다')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문, 공백만 입력 가능합니다'),
  phone: phoneSchema,
  email: emailSchema,
  joinDate: dateSchema,
  membershipType: z.string()
    .min(1, '멤버십 타입은 필수입니다')
    .max(50, '멤버십 타입은 50자 이하여야 합니다'),
  membershipExpiry: dateSchema,
  trainerId: z.string().uuid('올바른 트레이너 ID가 아닙니다').optional(),
  branchId: z.string()
    .uuid('올바른 지점 ID가 아닙니다')
    .min(1, '지점은 필수입니다'),
  status: z.enum(['활동', '만료', '휴면'], {
    required_error: '상태를 선택해주세요',
  }).default('활동'),
  memo: z.string().max(1000, '메모는 1000자 이하여야 합니다').optional(),
});

export const updateRegisteredCustomerSchema = registeredCustomerSchema.partial();

export type RegisteredCustomerFormData = z.infer<typeof registeredCustomerSchema>;

// 제품 스키마
export const productSchema = z.object({
  productName: z.string()
    .min(1, '상품명은 필수입니다')
    .max(100, '상품명은 100자 이하여야 합니다'),
  description: z.string()
    .max(500, '설명은 500자 이하여야 합니다')
    .optional(),
  price: priceSchema,
  validityPeriod: z.number()
    .min(1, '유효기간은 1일 이상이어야 합니다')
    .max(3650, '유효기간은 10년(3650일) 이하여야 합니다'),
  branchId: z.string()
    .uuid('올바른 지점 ID가 아닙니다')
    .optional(),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = productSchema.partial();

export type ProductFormData = z.infer<typeof productSchema>;

// 메시지 템플릿 스키마
export const messageTemplateSchema = z.object({
  templateName: z.string()
    .min(1, '템플릿명은 필수입니다')
    .max(100, '템플릿명은 100자 이하여야 합니다'),
  channel: z.enum(['알림톡', 'SMS'], {
    required_error: '채널을 선택해주세요',
  }),
  templateCode: z.string()
    .max(50, '템플릿 코드는 50자 이하여야 합니다')
    .optional(),
  content: z.string()
    .min(1, '메시지 내용은 필수입니다')
    .max(2000, '메시지 내용은 2000자 이하여야 합니다'),
  variables: z.array(z.string()).default([]),
  status: z.enum(['승인대기', '승인완료', '반려'], {
    required_error: '상태를 선택해주세요',
  }).default('승인대기'),
});

export const updateMessageTemplateSchema = messageTemplateSchema.partial();

export type MessageTemplateFormData = z.infer<typeof messageTemplateSchema>;

// 캠페인 스키마
export const campaignSchema = z.object({
  campaignName: z.string()
    .min(1, '캠페인명은 필수입니다')
    .max(100, '캠페인명은 100자 이하여야 합니다'),
  description: z.string()
    .max(500, '설명은 500자 이하여야 합니다')
    .optional(),
  sendCondition: z.string()
    .min(1, '발송조건은 필수입니다')
    .max(200, '발송조건은 200자 이하여야 합니다'),
  templateId: z.string()
    .uuid('올바른 템플릿 ID가 아닙니다')
    .min(1, '템플릿은 필수입니다'),
  isActive: z.boolean().default(true),
});

export const updateCampaignSchema = campaignSchema.partial();

export type CampaignFormData = z.infer<typeof campaignSchema>;

// 예약 메시지 스키마
export const scheduledMessageSchema = z.object({
  recipientPhone: phoneSchema,
  templateId: z.string()
    .uuid('올바른 템플릿 ID가 아닙니다')
    .min(1, '템플릿은 필수입니다'),
  scheduledAt: dateSchema,
  sendStatus: z.enum(['대기', '성공', '실패'], {
    required_error: '발송상태를 선택해주세요',
  }).default('대기'),
  resultMessage: z.string()
    .max(200, '결과 메시지는 200자 이하여야 합니다')
    .optional(),
});

export type ScheduledMessageFormData = z.infer<typeof scheduledMessageSchema>;

// 결제 스키마
export const paymentSchema = z.object({
  customerId: z.string()
    .uuid('올바른 고객 ID가 아닙니다')
    .min(1, '고객은 필수입니다'),
  productId: z.string()
    .uuid('올바른 상품 ID가 아닙니다')
    .min(1, '상품은 필수입니다'),
  amount: priceSchema,
  paymentMethod: z.enum(['현금', '카드', '계좌이체', '기타'], {
    required_error: '결제방법을 선택해주세요',
  }),
  paymentDate: dateSchema,
  memo: z.string()
    .max(500, '메모는 500자 이하여야 합니다')
    .optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

// 사용자 스키마
export const userSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string()
    .min(8, '비밀번호는 최소 8자리여야 합니다')
    .max(100, '비밀번호는 100자 이하여야 합니다')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다'
    ),
  name: z.string()
    .min(1, '이름은 필수입니다')
    .max(50, '이름은 50자 이하여야 합니다')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문, 공백만 입력 가능합니다'),
  phone: phoneSchema.optional(),
  branchId: z.string()
    .uuid('올바른 지점 ID가 아닙니다')
    .optional(),
  roleId: z.string()
    .uuid('올바른 역할 ID가 아닙니다')
    .min(1, '역할은 필수입니다'),
});

export const updateUserSchema = userSchema.partial().omit({ password: true });

export const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export type UserFormData = z.infer<typeof userSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

// 지점 스키마
export const branchSchema = z.object({
  name: z.string()
    .min(1, '지점명은 필수입니다')
    .max(100, '지점명은 100자 이하여야 합니다'),
  address: z.string()
    .min(1, '주소는 필수입니다')
    .max(200, '주소는 200자 이하여야 합니다'),
  phone: phoneSchema,
  managerId: z.string()
    .uuid('올바른 관리자 ID가 아닙니다')
    .optional(),
});

export const updateBranchSchema = branchSchema.partial();

export type BranchFormData = z.infer<typeof branchSchema>;

// 역할 스키마
export const roleSchema = z.object({
  name: z.string()
    .min(1, '역할명은 필수입니다')
    .max(50, '역할명은 50자 이하여야 합니다'),
  permissions: z.object({
    customers: z.object({
      view: z.boolean(),
      create: z.boolean(),
      edit: z.boolean(),
      delete: z.boolean(),
    }),
    messages: z.object({
      view: z.boolean(),
      create: z.boolean(),
      edit: z.boolean(),
      delete: z.boolean(),
      send: z.boolean(),
    }),
    products: z.object({
      view: z.boolean(),
      create: z.boolean(),
      edit: z.boolean(),
      delete: z.boolean(),
    }),
    statistics: z.object({
      view: z.boolean(),
    }),
    settings: z.object({
      view: z.boolean(),
      edit: z.boolean(),
    }),
  }),
});

export const updateRoleSchema = roleSchema.partial();

export type RoleFormData = z.infer<typeof roleSchema>;