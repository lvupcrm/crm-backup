'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { X, Save, User, Phone, Calendar, MapPin, Target, MessageSquare } from 'lucide-react';

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

interface ConsultationRecordPanelProps {
  customer: ConsultationCustomer;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationRecordPanel({ customer, isOpen, onClose }: ConsultationRecordPanelProps) {
  const [consultationRecord, setConsultationRecord] = useState(customer.memo || '');

  useEffect(() => {
    setConsultationRecord(customer.memo || '');
  }, [customer]);

  const handleSave = () => {
    // localStorage에서 고객 정보 업데이트
    const stored = localStorage.getItem('consultationCustomers');
    if (stored) {
      const customers = JSON.parse(stored);
      const updatedCustomers = customers.map((c: ConsultationCustomer) => 
        c.id === customer.id ? { ...c, memo: consultationRecord } : c
      );
      localStorage.setItem('consultationCustomers', JSON.stringify(updatedCustomers));
    }

    // 성공 메시지 표시
    alert('상담기록이 저장되었습니다.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* 사이드 패널 */}
      <div className="w-1/2 bg-white shadow-xl flex flex-col ml-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">상담기록</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 고객 정보 카드 */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">고객 정보</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <Label className="text-xs text-gray-600">이름</Label>
                  <div className="font-medium">{customer.name}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <Label className="text-xs text-gray-600">연락처</Label>
                  <div className="font-medium">{customer.phone}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <Label className="text-xs text-gray-600">예약일시</Label>
                  <div className="font-medium">{customer.appointmentDate.replace('T', ' ')}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <Label className="text-xs text-gray-600">문의경로</Label>
                  <div className="font-medium">{customer.inquiryChannel}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Target className="w-4 h-4 text-gray-500" />
                <div>
                  <Label className="text-xs text-gray-600">종목</Label>
                  <div className="font-medium">{customer.sport}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <div>
                  <Label className="text-xs text-gray-600">예약목적</Label>
                  <div className="font-medium">{customer.appointmentPurpose}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* 상담기록 메모장 */}
          <Card className="p-4 flex-1">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">상담기록</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="consultationRecord" className="text-sm text-gray-600">
                  상담 내용을 기록해주세요
                </Label>
                <textarea
                  id="consultationRecord"
                  value={consultationRecord}
                  onChange={(e) => setConsultationRecord(e.target.value)}
                  className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="상담 내용, 고객 요구사항, 다음 상담 계획 등을 자유롭게 기록해주세요..."
                />
              </div>
              <div className="text-xs text-gray-500">
                * 상담기록은 자동으로 저장되지 않습니다. 저장 버튼을 눌러주세요.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 