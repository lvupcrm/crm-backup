'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-crm.css'; // 커스텀 캘린더 스타일 추가
import { format, isSameDay, parseISO, compareAsc, startOfDay, endOfDay, startOfWeek, endOfWeek, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { User2, CalendarDays, CheckCircle2, UserPlus, UserX, Ban } from 'lucide-react';
import { Select } from '@/components/ui/select';

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
  notificationStatus: string; // '1차 알림톡 발송' | '미발송'
  memo?: string;
}

const initialForm = {
  name: '',
  phone: '',
  appointmentDate: '',
  inquiryChannel: '',
  sport: '',
  appointmentPurpose: '',
  consultationStatus: '미상담',
  registrationStatus: '미등록',
  notificationStatus: '미발송',
  memo: '',
};

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

// 예약목적별 뱃지 색상 매핑 함수
function getPurposeBadgeClass(purpose: string) {
  switch (purpose) {
    case '상담': return 'bg-blue-100 text-blue-700';
    case '체험': return 'bg-green-100 text-green-700';
    case '등록': return 'bg-purple-100 text-purple-700';
    default: return 'bg-gray-200 text-gray-700';
  }
}

export default function CrmHome() {
  const router = useRouter();
  const [customers, setCustomers] = useState<ConsultationCustomer[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(getTodayStr());
  const [showMine, setShowMine] = useState(false);
  const [showIncomplete, setShowIncomplete] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [showNewConsultationModal, setShowNewConsultationModal] = useState(false);
  const [completedCustomer, setCompletedCustomer] = useState<ConsultationCustomer | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('consultationCustomers');
    if (stored) {
      // notificationStatus 필드가 없는 기존 데이터 보정
      const arr = JSON.parse(stored).map((c: any) => ({
        notificationStatus: 'notificationStatus' in c ? c.notificationStatus : '미발송',
        ...c,
      }));
      setCustomers(arr);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('consultationCustomers', JSON.stringify(customers));
  }, [customers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updatedCustomer = { ...form, id: editingId, notificationStatus: form.notificationStatus ?? '미발송' };
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingId ? updatedCustomer : c))
      );
      
      // 상담고객 페이지 localStorage 업데이트
      const existingConsultationCustomers = JSON.parse(localStorage.getItem('consultationCustomers') || '[]');
      const updatedConsultationCustomers = existingConsultationCustomers.map((c: any) => 
        c.id === editingId ? updatedCustomer : c
      );
      localStorage.setItem('consultationCustomers', JSON.stringify(updatedConsultationCustomers));
      
      // 수정 성공 알림 표시
      setNotification({ 
        message: `${updatedCustomer.name} 고객 정보가 수정되었습니다.`, 
        type: 'success' 
      });
      
      // 3초 후 알림 제거
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      setEditingId(null);
    } else {
      const newCustomer = { ...form, id: crypto.randomUUID(), notificationStatus: '미발송' };
      setCustomers((prev) => [
        ...prev,
        newCustomer,
      ]);
      
      // 상담고객 페이지 localStorage에 새 고객 추가
      const existingConsultationCustomers = JSON.parse(localStorage.getItem('consultationCustomers') || '[]');
      localStorage.setItem('consultationCustomers', JSON.stringify([...existingConsultationCustomers, newCustomer]));
      
      // 성공 알림 표시
      setNotification({ 
        message: `${newCustomer.name} 고객이 상담고객으로 등록되었습니다.`, 
        type: 'success' 
      });
      
      // 3초 후 알림 제거
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
    setForm(initialForm);
  };

  const handleEdit = (id: string) => {
    const customer = customers.find((c) => c.id === id);
    if (customer) {
      setForm({
        ...customer,
        memo: customer.memo ?? '',
      });
      setEditingId(id);
      setOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    
    // 상담고객 페이지 localStorage에서도 삭제
    const existingConsultationCustomers = JSON.parse(localStorage.getItem('consultationCustomers') || '[]');
    const filteredConsultationCustomers = existingConsultationCustomers.filter((c: any) => c.id !== id);
    localStorage.setItem('consultationCustomers', JSON.stringify(filteredConsultationCustomers));
    
    if (editingId === id) {
      setForm(initialForm);
      setEditingId(null);
    }
  };

  // 날짜 네비게이션 핸들러
  const handlePrevDate = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    setDate(d.toISOString().slice(0, 10));
  };
  const handleNextDate = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    setDate(d.toISOString().slice(0, 10));
  };
  const handleToday = () => setDate(getTodayStr());

  // 캘린더 일정 렌더링: 날짜별 상담고객 시간순 정렬
  function renderEventsForDate(date: Date) {
    const events = customers
      .filter(c => c.appointmentDate && isSameDay(parseISO(c.appointmentDate), date))
      .sort((a, b) => compareAsc(parseISO(a.appointmentDate), parseISO(b.appointmentDate)));
    return events.map((event, idx) => (
      <div key={event.id + idx} className="crm-calendar-event flex items-center gap-1 mb-1">
        <span className="mr-1 text-xs text-gray-500">{format(parseISO(event.appointmentDate), 'HH:mm')}</span>
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getPurposeBadgeClass(event.appointmentPurpose)}`}>{event.name}</span>
      </div>
    ));
  }

  // 대시보드 카드용 통계 계산
  const today = new Date();
  const todayConsults = customers.filter(c => c.appointmentDate && isSameDay(parseISO(c.appointmentDate), today));
  const weekConsults = customers.filter(c => c.appointmentDate && isWithinInterval(parseISO(c.appointmentDate), { start: startOfWeek(today, { weekStartsOn: 0 }), end: endOfWeek(today, { weekStartsOn: 0 }) }));
  const notConsulted = customers.filter(c => c.consultationStatus === '미상담');
  const consulted = customers.filter(c => c.consultationStatus === '상담완료');
  const registered = customers.filter(c => c.registrationStatus === '등록완료');
  const notRegistered = customers.filter(c => c.registrationStatus === '미등록');
  const monthConsults = customers.filter(c => c.appointmentDate && isWithinInterval(parseISO(c.appointmentDate), { start: startOfMonth(today), end: endOfMonth(today) }));
  const noshow = customers.filter(c => c.consultationStatus === '노쇼');

  // 상담 성공률 계산
  const totalConsults = consulted.length + notConsulted.length + noshow.length;
  const successRate = totalConsults > 0 ? ((consulted.length / totalConsults) * 100).toFixed(1) : '0.0';

  // Home 화면에서 표시할 고객 목록 (상담완료된 고객 제외)
  const displayCustomers = customers.filter(c => c.consultationStatus !== '상담완료');

  // 상담상태/등록상태 인라인 변경 핸들러
  const handleStatusChange = (id: string, field: 'consultationStatus' | 'registrationStatus', value: string) => {
    const updatedCustomer = { ...customers.find(c => c.id === id)!, [field]: value };
    setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
    
    // 상담고객 페이지 localStorage 업데이트
    const existingConsultationCustomers = JSON.parse(localStorage.getItem('consultationCustomers') || '[]');
    const updatedConsultationCustomers = existingConsultationCustomers.map((c: any) => 
      c.id === id ? updatedCustomer : c
    );
    localStorage.setItem('consultationCustomers', JSON.stringify(updatedConsultationCustomers));
  };

  // 신규상담 폼 제출 핸들러
  const handleNewConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completedCustomer) return;

    // 기존 고객 정보를 기반으로 새로운 등록완료 고객 생성
    const newRegisteredCustomer = {
      ...initialForm,
      id: crypto.randomUUID(),
      name: completedCustomer.name,
      phone: completedCustomer.phone,
      appointmentDate: form.appointmentDate,
      inquiryChannel: form.inquiryChannel,
      sport: form.sport,
      appointmentPurpose: form.appointmentPurpose,
      consultationStatus: '미상담',
      registrationStatus: '등록완료',
      notificationStatus: '미발송',
      memo: form.memo,
    };

    // 신규등록 고객 localStorage에 추가
    const existingRegisteredCustomers = JSON.parse(localStorage.getItem('registeredCustomers') || '[]');
    localStorage.setItem('registeredCustomers', JSON.stringify([...existingRegisteredCustomers, newRegisteredCustomer]));

    // 폼 초기화 및 모달 닫기
    setForm(initialForm);
    setShowNewConsultationModal(false);
    setCompletedCustomer(null);

    // 성공 알림 표시
    setNotification({ 
      message: `${completedCustomer.name} 고객이 신규등록 고객으로 등록되었습니다. 신규등록 고객 페이지로 이동합니다.`, 
      type: 'success' 
    });
    
    // 3초 후 알림 제거 및 페이지 이동
    setTimeout(() => {
      setNotification(null);
      router.push('/customers/registered');
    }, 3000);
  };

  // 상담완료 버튼 핸들러
  const handleCompleteConsult = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;

    if (customer.registrationStatus === '미등록') {
      // 미등록 고객: 상담완료로 변경하고 미등록 페이지에 업데이트
      const updatedCustomer = { ...customer, consultationStatus: '상담완료' };
      
      setCustomers(prev => prev.map(c => 
        c.id === id ? updatedCustomer : c
      ));
      
      // 상담고객 페이지 localStorage 업데이트
      const existingConsultationCustomers = JSON.parse(localStorage.getItem('consultationCustomers') || '[]');
      const updatedConsultationCustomers = existingConsultationCustomers.map((c: any) => 
        c.id === id ? updatedCustomer : c
      );
      localStorage.setItem('consultationCustomers', JSON.stringify(updatedConsultationCustomers));
      
      // 미등록 고객 localStorage에 추가
      const existingUnregisteredCustomers = JSON.parse(localStorage.getItem('unregisteredCustomers') || '[]');
      const customerExists = existingUnregisteredCustomers.some((c: any) => c.id === id);
      
      if (!customerExists) {
        localStorage.setItem('unregisteredCustomers', JSON.stringify([...existingUnregisteredCustomers, updatedCustomer]));
      }
      
      // 알림 표시
      setNotification({ 
        message: `${customer.name} 고객의 상담이 완료되었습니다. 미등록 고객 페이지로 이동합니다.`, 
        type: 'success' 
      });
      
      // 3초 후 알림 제거 및 페이지 이동
      setTimeout(() => {
        setNotification(null);
        router.push('/customers/unregistered');
      }, 3000);
    } else {
      // 등록완료 고객: 상담완료로 변경하고 신규상담 폼 표시
      const updatedCustomer = { ...customer, consultationStatus: '상담완료' };
      setCustomers(prev => prev.map(c => 
        c.id === id ? updatedCustomer : c
      ));
      
      // 상담고객 페이지 localStorage 업데이트
      const existingConsultationCustomers = JSON.parse(localStorage.getItem('consultationCustomers') || '[]');
      const updatedConsultationCustomers = existingConsultationCustomers.map((c: any) => 
        c.id === id ? updatedCustomer : c
      );
      localStorage.setItem('consultationCustomers', JSON.stringify(updatedConsultationCustomers));
      
      // 완료된 고객 정보 저장하고 신규상담 폼 표시
      setCompletedCustomer(customer);
      setShowNewConsultationModal(true);
      
      // 알림 표시
      setNotification({ 
        message: `${customer.name} 고객의 상담이 완료되었습니다. 신규상담 폼이 열립니다.`, 
        type: 'success' 
      });
      
      // 3초 후 알림 제거
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 알림 표시 */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-blue-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}
      {/* 대시보드 카드 */}
      <div className="flex gap-3 mb-8">
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px]">
          <CalendarDays className="w-6 h-6 text-purple-600" />
          <div>
            <div className="text-xl font-bold text-gray-900">{monthConsults.length}</div>
            <div className="text-gray-500 text-xs font-medium">이번달 상담</div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px]">
          <CalendarDays className="w-6 h-6 text-blue-600" />
          <div>
            <div className="text-xl font-bold text-gray-900">{todayConsults.length}</div>
            <div className="text-gray-500 text-xs font-medium">오늘 상담</div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px]">
          <CalendarDays className="w-6 h-6 text-gray-400" />
          <div>
            <div className="text-xl font-bold text-gray-900">{notConsulted.length}</div>
            <div className="text-gray-500 text-xs font-medium">남은 상담</div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px]">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <div>
            <div className="text-xl font-bold text-gray-900">{consulted.length}</div>
            <div className="text-gray-500 text-xs font-medium">상담완료</div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px]">
          <Ban className="w-6 h-6 text-rose-600" />
          <div>
            <div className="text-xl font-bold text-gray-900">{noshow.length}</div>
            <div className="text-gray-500 text-xs font-medium">상담 노쇼</div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px]">
          <UserPlus className="w-6 h-6 text-indigo-600" />
          <div>
            <div className="text-xl font-bold text-gray-900">{registered.length}</div>
            <div className="text-gray-500 text-xs font-medium">신규 등록</div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px]">
          <UserX className="w-6 h-6 text-red-500" />
          <div>
            <div className="text-xl font-bold text-gray-900">{notRegistered.length}</div>
            <div className="text-gray-500 text-xs font-medium">미등록</div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px]">
          <CheckCircle2 className="w-6 h-6 text-blue-600" />
          <div>
            <div className="text-xl font-bold text-gray-900">{successRate}%</div>
            <div className="text-gray-500 text-xs font-medium">상담 성공률</div>
          </div>
        </div>
      </div>
      {/* 날짜 네비게이션 + 상담고객추가 버튼 한 줄 배치 (카드 아래로 이동) */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <button
            className="border border-gray-300 rounded bg-gray-100 text-gray-900 w-10 h-10 flex items-center justify-center text-sm font-medium hover:bg-gray-200 transition-colors p-2"
            aria-label="이전날짜"
            onClick={handlePrevDate}
            type="button"
          >
            ◀
          </button>
          <input
            type="date"
            className="border border-gray-300 rounded bg-gray-100 text-gray-900 h-10 w-40 text-center text-sm font-medium focus:outline-none p-2"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ minWidth: 120 }}
          />
          <button
            className="border border-gray-300 rounded bg-gray-100 text-gray-900 h-10 px-4 text-sm font-medium hover:bg-gray-200 transition-colors p-2"
            onClick={handleToday}
            type="button"
          >
            오늘
          </button>
          <button
            className="border border-gray-300 rounded bg-gray-100 text-gray-900 w-10 h-10 flex items-center justify-center text-sm font-medium hover:bg-gray-200 transition-colors p-2"
            aria-label="다음날짜"
            onClick={handleNextDate}
            type="button"
          >
            ▶
          </button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setForm(initialForm); setEditingId(null); }}>상담 고객 추가</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingId ? '상담 고객 수정' : '상담 고객 등록'}</DialogTitle>
            </DialogHeader>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { handleSubmit(e); setOpen(false); }}>
              <div className="flex flex-col gap-1">
                <Label htmlFor="name">이름</Label>
                <Input id="name" name="name" placeholder="이름" value={form.name} onChange={handleChange} required />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="phone">연락처</Label>
                <Input id="phone" name="phone" placeholder="연락처" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="appointmentDate">예약일시</Label>
                <Input id="appointmentDate" name="appointmentDate" type="datetime-local" value={form.appointmentDate} onChange={handleChange} required />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="inquiryChannel">문의경로</Label>
                <select id="inquiryChannel" name="inquiryChannel" value={form.inquiryChannel} onChange={handleChange} className="border rounded p-2">
                  <option value="">선택</option>
                  <option value="전화">전화</option>
                  <option value="카카오톡">카카오톡</option>
                  <option value="방문">방문</option>
                  <option value="지인소개">지인소개</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="sport">종목</Label>
                <select id="sport" name="sport" value={form.sport} onChange={handleChange} className="border rounded p-2">
                  <option value="">선택</option>
                  <option value="PT">PT</option>
                  <option value="필라테스">필라테스</option>
                  <option value="요가">요가</option>
                  <option value="GX">GX</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="appointmentPurpose">예약목적</Label>
                <select id="appointmentPurpose" name="appointmentPurpose" value={form.appointmentPurpose} onChange={handleChange} className="border rounded p-2">
                  <option value="">선택</option>
                  <option value="상담">상담</option>
                  <option value="체험">체험</option>
                  <option value="등록">등록</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="registrationStatus">등록상태</Label>
                <select id="registrationStatus" name="registrationStatus" value={form.registrationStatus} onChange={handleChange} className="border rounded p-2">
                  <option value="미등록">미등록</option>
                  <option value="등록완료">등록완료</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <Label htmlFor="memo">메모</Label>
                <Input id="memo" name="memo" placeholder="메모" value={form.memo} onChange={handleChange} />
              </div>
              <div className="md:col-span-2 flex gap-2 justify-end mt-2">
                <Button type="submit">{editingId ? '수정' : '등록'}</Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">취소</Button>
                </DialogClose>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* 신규상담 모달 */}
      <Dialog open={showNewConsultationModal} onOpenChange={setShowNewConsultationModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>신규 상담 등록</DialogTitle>
          </DialogHeader>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { handleNewConsultationSubmit(e); }}>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-name">이름</Label>
              <Input 
                id="new-name" 
                name="name" 
                placeholder="이름" 
                value={completedCustomer?.name || ''} 
                disabled 
                className="bg-gray-100"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-phone">연락처</Label>
              <Input 
                id="new-phone" 
                name="phone" 
                placeholder="연락처" 
                value={completedCustomer?.phone || ''} 
                disabled 
                className="bg-gray-100"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-appointmentDate">예약일시</Label>
              <Input 
                id="new-appointmentDate" 
                name="appointmentDate" 
                type="datetime-local" 
                value={form.appointmentDate} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-inquiryChannel">문의경로</Label>
              <select 
                id="new-inquiryChannel" 
                name="inquiryChannel" 
                value={form.inquiryChannel} 
                onChange={handleChange} 
                className="border rounded p-2"
              >
                <option value="">선택</option>
                <option value="전화">전화</option>
                <option value="카카오톡">카카오톡</option>
                <option value="방문">방문</option>
                <option value="지인소개">지인소개</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-sport">종목</Label>
              <select 
                id="new-sport" 
                name="sport" 
                value={form.sport} 
                onChange={handleChange} 
                className="border rounded p-2"
              >
                <option value="">선택</option>
                <option value="PT">PT</option>
                <option value="필라테스">필라테스</option>
                <option value="요가">요가</option>
                <option value="GX">GX</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-appointmentPurpose">예약목적</Label>
              <select 
                id="new-appointmentPurpose" 
                name="appointmentPurpose" 
                value={form.appointmentPurpose} 
                onChange={handleChange} 
                className="border rounded p-2"
              >
                <option value="">선택</option>
                <option value="상담">상담</option>
                <option value="체험">체험</option>
                <option value="등록">등록</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <Label htmlFor="new-memo">메모</Label>
              <Input 
                id="new-memo" 
                name="memo" 
                placeholder="메모" 
                value={form.memo} 
                onChange={handleChange} 
              />
            </div>
            <div className="md:col-span-2 flex gap-2 justify-end mt-2">
              <Button type="submit">신규 상담 등록</Button>
              <DialogClose asChild>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setForm(initialForm);
                    setCompletedCustomer(null);
                  }}
                >
                  취소
                </Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* 필터 제거됨 */}
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-400 text-white">
              <th className="p-3">이름</th>
              <th className="p-3">연락처</th>
              <th className="p-3">예약일시</th>
              <th className="p-3">문의경로</th>
              <th className="p-3">종목</th>
              <th className="p-3">예약목적</th>
              <th className="p-3">등록상태</th>
              <th className="p-3">알림톡 발송 여부</th>
              <th className="p-3">메모</th>
              <th className="p-3">작업</th>
            </tr>
          </thead>
          <tbody>
            {displayCustomers.map((c, idx) => (
              <tr key={c.id} className={"border-b" + (idx % 2 === 1 ? " bg-gray-50" : "") }>
                <td className="p-3 align-middle">{c.name}</td>
                <td className="p-3 align-middle">{c.phone}</td>
                <td className="p-3 align-middle">{c.appointmentDate?.replace('T', ' ')}</td>
                <td className="p-3 align-middle">{c.inquiryChannel}</td>
                <td className="p-3 align-middle">{c.sport}</td>
                <td className="p-3 align-middle">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPurposeBadgeClass(c.appointmentPurpose)}`}>{c.appointmentPurpose || '기타'}</span>
                </td>
                <td className="p-3 align-middle">
                  <select
                    className="border rounded px-3 py-1 text-sm min-w-[90px]"
                    value={c.registrationStatus}
                    onChange={e => handleStatusChange(c.id, 'registrationStatus', e.target.value)}
                  >
                    <option value="미등록">미등록</option>
                    <option value="등록완료">등록완료</option>
                  </select>
                </td>
                <td className="p-3 align-middle">
                  {c.notificationStatus === '1차 알림톡 발송' ? (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">1차 알림톡 발송</span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-700">미발송</span>
                  )}
                </td>
                <td className="p-3 align-middle">{c.memo}</td>
                <td className="p-3 align-middle">
                  <div className="flex gap-2 items-center">
                    <Button 
                      size="sm" 
                      variant="default" 
                      className={`${c.registrationStatus === '미등록' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`} 
                      onClick={() => handleCompleteConsult(c.id)}
                    >
                      {c.registrationStatus === '미등록' ? '상담완료 (미등록)' : '상담완료 (신규상담)'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(c.id)}>
                      수정
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>
                      삭제
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {displayCustomers.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center p-8 text-gray-500">등록된 상담 고객이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* 상담 스케줄표(캘린더) */}
      <div className="mt-8">
        <div className="mb-2 text-lg font-bold text-gray-800">상담 스케줄표</div>
        <div className="w-full min-w-0 max-w-none px-0">
          <Calendar
            className="w-full border border-gray-300 rounded bg-gray-100 p-2 text-gray-900 font-medium"
            calendarType="gregory"
            locale="ko-KR"
            tileContent={({ date, view }) => view === 'month' ? renderEventsForDate(date) : null}
            tileClassName={({ date, view }) =>
              'rounded text-center hover:bg-gray-200 transition-colors cursor-pointer'
            }
          />
        </div>
      </div>
    </div>
  );
} 