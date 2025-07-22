'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, MessageSquare } from 'lucide-react'
import { ConsultationCustomer, RegisteredCustomer } from '@prisma/client'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface CustomerTableProps {
  customers: ConsultationCustomer[] | RegisteredCustomer[]
  type: 'consultation' | 'registered' | 'unregistered'
  onDetailView?: (customer: RegisteredCustomer) => void
}

export function CustomerTable({ customers, type, onDetailView }: CustomerTableProps) {
  const router = useRouter()

  // 예약목적별 뱃지 색상 매핑 함수
  const getPurposeBadgeClass = (purpose: string) => {
    switch (purpose) {
      case '상담': return 'bg-blue-100 text-blue-700';
      case '체험': return 'bg-green-100 text-green-700';
      case '등록': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  }

  // 상태별 뱃지 색상 매핑 함수
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case '활동': return 'bg-green-100 text-green-700';
      case '만료': return 'bg-red-100 text-red-700';
      case '휴면': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      '미상담': 'secondary',
      '상담완료': 'default',
      '미등록': 'destructive',
      '등록완료': 'success',
      '활동': 'default',
      '만료': 'destructive',
      '휴면': 'secondary',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  if (type === 'consultation') {
    return (
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-400 text-white">
            <th className="p-3">번호</th>
            <th className="p-3">이름</th>
            <th className="p-3">연락처</th>
            <th className="p-3">예약일시</th>
            <th className="p-3">문의경로</th>
            <th className="p-3">종목</th>
            <th className="p-3">예약목적</th>
            <th className="p-3">상담기록</th>
            <th className="p-3">작업</th>
          </tr>
        </thead>
        <tbody>
          {(customers as ConsultationCustomer[]).length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center p-8 text-gray-500">등록된 상담 고객이 없습니다.</td>
            </tr>
          ) : (
            (customers as ConsultationCustomer[]).map((customer, idx) => (
              <tr key={customer.id} className={"border-b" + (idx % 2 === 1 ? " bg-gray-50" : "")}>
                <td className="p-3 align-middle text-center">{idx + 1}</td>
                <td className="p-3 align-middle">{customer.name}</td>
                <td className="p-3 align-middle">{customer.phone}</td>
                <td className="p-3 align-middle">{customer.appointmentDate ? format(new Date(customer.appointmentDate), 'yyyy-MM-dd HH:mm', { locale: ko }) : '-'}</td>
                <td className="p-3 align-middle">{customer.inquiryChannel}</td>
                <td className="p-3 align-middle">{customer.sport}</td>
                <td className="p-3 align-middle">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPurposeBadgeClass(customer.appointmentPurpose)}`}>
                    {customer.appointmentPurpose || '기타'}
                  </span>
                </td>
                <td className="p-3 align-middle">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-blue-600 hover:text-blue-700"
                  >
                    상담기록
                  </Button>
                </td>
                <td className="p-3 align-middle">
                  <div className="flex gap-2 items-center">
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      상담완료
                    </Button>
                    <Button size="sm" variant="outline">
                      수정
                    </Button>
                    <Button size="sm" variant="destructive">
                      삭제
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    )
  }

  if (type === 'unregistered') {
    return (
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-400 text-white">
            <th className="p-3">번호</th>
            <th className="p-3">이름</th>
            <th className="p-3">연락처</th>
            <th className="p-3">예약일시</th>
            <th className="p-3">문의경로</th>
            <th className="p-3">종목</th>
            <th className="p-3">예약목적</th>
            <th className="p-3">상담기록</th>
            <th className="p-3">작업</th>
          </tr>
        </thead>
        <tbody>
          {(customers as ConsultationCustomer[]).length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center p-8 text-gray-500">등록된 미등록 고객이 없습니다.</td>
            </tr>
          ) : (
            (customers as ConsultationCustomer[]).map((customer, idx) => (
              <tr key={customer.id} className={"border-b" + (idx % 2 === 1 ? " bg-gray-50" : "")}>
                <td className="p-3 align-middle text-center">{idx + 1}</td>
                <td className="p-3 align-middle">{customer.name}</td>
                <td className="p-3 align-middle">{customer.phone}</td>
                <td className="p-3 align-middle">{customer.appointmentDate ? format(new Date(customer.appointmentDate), 'yyyy-MM-dd HH:mm', { locale: ko }) : '-'}</td>
                <td className="p-3 align-middle">{customer.inquiryChannel}</td>
                <td className="p-3 align-middle">{customer.sport}</td>
                <td className="p-3 align-middle">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPurposeBadgeClass(customer.appointmentPurpose)}`}>
                    {customer.appointmentPurpose || '기타'}
                  </span>
                </td>
                <td className="p-3 align-middle">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-blue-600 hover:text-blue-700"
                  >
                    상담기록
                  </Button>
                </td>
                <td className="p-3 align-middle">
                  <div className="flex gap-2 items-center">
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      등록완료
                    </Button>
                    <Button size="sm" variant="outline">
                      수정
                    </Button>
                    <Button size="sm" variant="destructive">
                      삭제
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    )
  }

  // 등록 고객 테이블
  return (
    <table className="min-w-full">
      <thead>
        <tr className="bg-gray-400 text-white">
          <th className="p-3">번호</th>
          <th className="p-3">이름</th>
          <th className="p-3">연락처</th>
          <th className="p-3">등록일</th>
          <th className="p-3">회원권 종류</th>
          <th className="p-3">결제 방법</th>
          <th className="p-3">담당 트레이너</th>
          <th className="p-3">회원번호</th>
          <th className="p-3">추천회원</th>
          <th className="p-3">생년월일</th>
          <th className="p-3">주소</th>
          <th className="p-3">상담기록</th>
          <th className="p-3">작업</th>
        </tr>
      </thead>
      <tbody>
        {(customers as RegisteredCustomer[]).length === 0 ? (
          <tr>
            <td colSpan={13} className="text-center p-8 text-gray-500">등록된 신규 등록 고객이 없습니다.</td>
          </tr>
        ) : (
          (customers as RegisteredCustomer[]).map((customer, idx) => (
            <tr key={customer.id} className={"border-b" + (idx % 2 === 1 ? " bg-gray-50" : "")}>
              <td className="p-3 align-middle text-center">{idx + 1}</td>
              <td className="p-3 align-middle">{customer.name}</td>
              <td className="p-3 align-middle">{customer.phone}</td>
              <td className="p-3 align-middle">
                {customer.joinDate ? format(new Date(customer.joinDate), 'yyyy-MM-dd', { locale: ko }) : '-'}
              </td>
              <td className="p-3 align-middle">{customer.membershipType || '-'}</td>
              <td className="p-3 align-middle">-</td>
              <td className="p-3 align-middle">{customer.trainerId || '미배정'}</td>
              <td className="p-3 align-middle">-</td>
              <td className="p-3 align-middle">-</td>
              <td className="p-3 align-middle">-</td>
              <td className="p-3 align-middle max-w-xs truncate">-</td>
              <td className="p-3 align-middle">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-blue-600 hover:text-blue-700"
                >
                  상담기록
                </Button>
              </td>
              <td className="p-3 align-middle">
                <div className="flex gap-2 items-center">
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onDetailView?.(customer)}
                  >
                    상세보기
                  </Button>
                  <Button size="sm" variant="outline">
                    수정
                  </Button>
                  <Button size="sm" variant="destructive">
                    삭제
                  </Button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
