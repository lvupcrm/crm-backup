'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ConsultationCustomer } from '@/lib/types'

const consultationSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  phone: z.string().regex(/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/, '올바른 연락처를 입력해주세요'),
  appointmentDate: z.string(),
  inquiryChannel: z.string().min(1, '문의경로를 입력해주세요'),
  sport: z.string().min(1, '종목을 입력해주세요'),
  appointmentPurpose: z.enum(['상담', '체험', '기타']),
  consultationStatus: z.enum(['미상담', '상담완료']),
  registrationStatus: z.enum(['미등록', '등록완료']),
  memo: z.string().optional(),
})

type FormData = z.infer<typeof consultationSchema>

interface CustomerFormProps {
  type: 'consultation' | 'registered'
  customer?: ConsultationCustomer
  onSubmit: (data: FormData) => void
  isLoading?: boolean
}

export function CustomerForm({ type, customer, onSubmit, isLoading }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: customer || {
      consultationStatus: '미상담',
      registrationStatus: '미등록',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">이름 *</Label>
          <Input
            id="name"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">연락처 *</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="010-1234-5678"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="appointmentDate">예약일시 *</Label>
          <Input
            id="appointmentDate"
            type="datetime-local"
            {...register('appointmentDate')}
            className={errors.appointmentDate ? 'border-red-500' : ''}
          />
        </div>

        <div>
          <Label htmlFor="inquiryChannel">문의경로 *</Label>
          <Input
            id="inquiryChannel"
            {...register('inquiryChannel')}
            placeholder="네이버, 인스타그램, 지인소개 등"
            className={errors.inquiryChannel ? 'border-red-500' : ''}
          />
        </div>

        <div>
          <Label htmlFor="sport">종목 *</Label>
          <Input
            id="sport"
            {...register('sport')}
            placeholder="헬스, 필라테스, 요가 등"
            className={errors.sport ? 'border-red-500' : ''}
          />
        </div>

        <div>
          <Label htmlFor="appointmentPurpose">예약목적 *</Label>
          <Select
            value={watch('appointmentPurpose')}
            onValueChange={(value) => setValue('appointmentPurpose', value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="상담">상담</SelectItem>
              <SelectItem value="체험">체험</SelectItem>
              <SelectItem value="기타">기타</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="consultationStatus">상담상태 *</Label>
          <Select
            value={watch('consultationStatus')}
            onValueChange={(value) => setValue('consultationStatus', value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="미상담">미상담</SelectItem>
              <SelectItem value="상담완료">상담완료</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="registrationStatus">등록상태 *</Label>
          <Select
            value={watch('registrationStatus')}
            onValueChange={(value) => setValue('registrationStatus', value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="미등록">미등록</SelectItem>
              <SelectItem value="등록완료">등록완료</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="memo">메모</Label>
        <Textarea
          id="memo"
          {...register('memo')}
          rows={4}
          placeholder="고객 관련 특이사항을 입력하세요"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '저장 중...' : customer ? '수정' : '등록'}
        </Button>
      </div>
    </form>
  )
}