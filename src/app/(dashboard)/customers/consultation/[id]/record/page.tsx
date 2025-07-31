'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, User, Phone, Calendar, MapPin, Target, MessageSquare } from 'lucide-react';

interface ConsultationCustomer {
  id: string;
  name: string;
  phone: string;
  appointmentDate: string;
  inquiryChannel: string;
  sport: string;
  appointmentPurpose: string;
  consultationStatus: string;
  registrationStatus: string;
  notificationStatus: string;
  memo?: string;
}

export default function ConsultationRecordPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;
  
  const [customer, setCustomer] = useState<ConsultationCustomer | null>(null);
  const [consultationRecord, setConsultationRecord] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 고객 정보 가져오기
    const stored = localStorage.getItem('consultationCustomers');
    if (stored) {
      const customers = JSON.parse(stored);
      const foundCustomer = customers.find((c: ConsultationCustomer) => c.id === customerId);
      if (foundCustomer) {
        setCustomer(foundCustomer);
        // 기존 메모가 있으면 상담기록으로 설정
        setConsultationRecord(foundCustomer.memo || '');
      }
    }
    setIsLoading(false);
  }, [customerId]);

  const handleSave = () => {
    if (!customer) return;

    // localStorage에서 고객 정보 업데이트
    const stored = localStorage.getItem('consultationCustomers');
    if (stored) {
      const customers = JSON.parse(stored);
      const updatedCustomers = customers.map((c: ConsultationCustomer) => 
        c.id === customerId ? { ...c, memo: consultationRecord } : c
      );
      localStorage.setItem('consultationCustomers', JSON.stringify(updatedCustomers));
    }

    // 성공 메시지 표시 (실제로는 toast나 notification 사용)
    alert('상담기록이 저장되었습니다.');
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">고객 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">상담기록</h1>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          저장
        </Button>
      </div>

      {/* 고객 정보 카드 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">고객 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-500" />
            <div>
              <Label className="text-sm text-gray-600">이름</Label>
              <div className="font-medium">{customer.name}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-500" />
            <div>
              <Label className="text-sm text-gray-600">연락처</Label>
              <div className="font-medium">{customer.phone}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <Label className="text-sm text-gray-600">예약일시</Label>
              <div className="font-medium">{customer.appointmentDate.replace('T', ' ')}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-500" />
            <div>
              <Label className="text-sm text-gray-600">문의경로</Label>
              <div className="font-medium">{customer.inquiryChannel}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-gray-500" />
            <div>
              <Label className="text-sm text-gray-600">종목</Label>
              <div className="font-medium">{customer.sport}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-gray-500" />
            <div>
              <Label className="text-sm text-gray-600">예약목적</Label>
              <div className="font-medium">{customer.appointmentPurpose}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 상담기록 메모장 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">상담기록</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="consultationRecord" className="text-sm text-gray-600">
              상담 내용을 기록해주세요
            </Label>
            <textarea
              id="consultationRecord"
              value={consultationRecord}
              onChange={(e) => setConsultationRecord(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="상담 내용, 고객 요구사항, 다음 상담 계획 등을 자유롭게 기록해주세요..."
            />
          </div>
          <div className="text-sm text-gray-500">
            * 상담기록은 자동으로 저장되지 않습니다. 저장 버튼을 눌러주세요.
          </div>
        </div>
      </Card>
    </div>
  );
} 