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
  type: 'consultation' | 'registered'
}

export function CustomerTable({ customers, type }: CustomerTableProps) {
  const router = useRouter()

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>연락처</TableHead>
            <TableHead>예약일시</TableHead>
            <TableHead>종목</TableHead>
            <TableHead>예약목적</TableHead>
            <TableHead>상담상태</TableHead>
            <TableHead>등록상태</TableHead>
            <TableHead>작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(customers as ConsultationCustomer[]).map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>
                {format(new Date(customer.appointmentDate), 'yyyy-MM-dd HH:mm', { locale: ko })}
              </TableCell>
              <TableCell>{customer.sport}</TableCell>
              <TableCell>{customer.appointmentPurpose}</TableCell>
              <TableCell>{getStatusBadge(customer.consultationStatus)}</TableCell>
              <TableCell>{getStatusBadge(customer.registrationStatus)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/customers/consultation/${customer.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {/* 수정 모달 열기 */}}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {/* 메시지 발송 */}}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  // 등록 고객 테이블
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>연락처</TableHead>
          <TableHead>가입일</TableHead>
          <TableHead>회원권</TableHead>
          <TableHead>만료일</TableHead>
          <TableHead>담당 트레이너</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(customers as RegisteredCustomer[]).map((customer) => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">{customer.name}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell>
              {format(new Date(customer.joinDate), 'yyyy-MM-dd', { locale: ko })}
            </TableCell>
            <TableCell>{customer.membershipType}</TableCell>
            <TableCell>
              {format(new Date(customer.membershipExpiry), 'yyyy-MM-dd', { locale: ko })}
            </TableCell>
            <TableCell>{customer.trainer?.name || '미배정'}</TableCell>
            <TableCell>{getStatusBadge(customer.status)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/customers/registered/${customer.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {/* 수정 모달 열기 */}}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
