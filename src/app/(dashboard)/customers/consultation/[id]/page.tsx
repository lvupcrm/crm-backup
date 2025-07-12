'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConsultationCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  appointmentDate: string;
  inquiryChannel: string;
  sport: string;
  appointmentPurpose: string;
  consultationStatus: string;
  registrationStatus: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ConsultationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<ConsultationCustomer | null>(null);

  useEffect(() => {
    // 실제로는 API에서 데이터를 가져와야 함. 예시는 localStorage 사용
    const customers = JSON.parse(localStorage.getItem('consultationCustomers') || '[]');
    const found = customers.find((c: ConsultationCustomer) => c.id === params.id);
    setCustomer(found || null);
  }, [params.id]);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div>상담 고객 정보를 찾을 수 없습니다.</div>
        <Button onClick={() => router.back()} className="mt-4">뒤로가기</Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{customer.name} 상담 상세</CardTitle>
        </CardHeader>
        <CardContent>
          <div>연락처: {customer.phone}</div>
          <div>이메일: {customer.email || '-'}</div>
          <div>상담일: {customer.appointmentDate}</div>
          <div>문의 채널: {customer.inquiryChannel}</div>
          <div>운동 종목: {customer.sport}</div>
          <div>상담 목적: {customer.appointmentPurpose}</div>
          <div>상담 상태: {customer.consultationStatus}</div>
          <div>등록 상태: {customer.registrationStatus}</div>
          <div>메모: {customer.memo || '-'}</div>
        </CardContent>
      </Card>
      <Button onClick={() => router.back()} className="mt-4">뒤로가기</Button>
    </div>
  );
}
