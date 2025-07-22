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
import { format, isSameDay, parseISO, compareAsc, startOfDay, endOfDay, startOfWeek, endOfWeek, isWithinInterval, startOfMonth, endOfMonth, isAfter } from 'date-fns';
import { User2, CalendarDays, CheckCircle2, UserPlus, UserX, Ban } from 'lucide-react';
import { Select } from '@/components/ui/select';
import ConsultationRecordPanel from '@/components/customers/ConsultationRecordPanel';

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
  registrationDate: '',
  membershipType: '',
  paymentMethod: '',
  trainer: '',
  memberNumber: '',
  recommendedBy: '',
  birthDate: '',
  address: '',
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
  const [showConsultationRecord, setShowConsultationRecord] = useState(false);
  const [selectedCustomerForRecord, setSelectedCustomerForRecord] = useState<ConsultationCustomer | null>(null);
  const [showCompletionOptions, setShowCompletionOptions] = useState(false);
  const [selectedCustomerForCompletion, setSelectedCustomerForCompletion] = useState<ConsultationCustomer | null>(null);
  const [showNewRegistrationModal, setShowNewRegistrationModal] = useState(false);
  const [dateFilter, setDateFilter] = useState('today');

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
      ...initialForm,
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
    
    switch(dateFilter) {
      case 'week':
        // 이전 주로 이동
        d.setDate(d.getDate() - 7);
        break;
      case 'lastWeek':
        // 이전 주로 이동
        d.setDate(d.getDate() - 7);
        break;
      case 'month':
        // 이전 달로 이동
        d.setMonth(d.getMonth() - 1);
        break;
      case 'lastMonth':
        // 이전 달로 이동
        d.setMonth(d.getMonth() - 1);
        break;
      default:
        // 하루 전으로 이동
        d.setDate(d.getDate() - 1);
    }
    
    setDate(d.toISOString().slice(0, 10));
  };
  
  const handleNextDate = () => {
    const d = new Date(date);
    
    switch(dateFilter) {
      case 'week':
        // 다음 주로 이동
        d.setDate(d.getDate() + 7);
        break;
      case 'lastWeek':
        // 다음 주로 이동
        d.setDate(d.getDate() + 7);
        break;
      case 'month':
        // 다음 달로 이동
        d.setMonth(d.getMonth() + 1);
        break;
      case 'lastMonth':
        // 다음 달로 이동
        d.setMonth(d.getMonth() + 1);
        break;
      default:
        // 하루 후로 이동
        d.setDate(d.getDate() + 1);
    }
    
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

  // 대시보드 카드용 통계 계산 (날짜 필터에 따른 동적 계산)
  const today = new Date();
  const selectedDate = parseISO(date);
  
  // 기간 계산 함수
  const getPeriodRange = () => {
    const selectedDate = parseISO(date);
    
    switch(dateFilter) {
      case 'week':
        // 이번주는 선택된 날짜 기준으로 계산 (이전/다음 버튼 작동을 위해)
        const startOfWeek = new Date(selectedDate);
        // 월요일(1)부터 시작하도록 조정 (일요일=0, 월요일=1)
        const dayOfWeek = selectedDate.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 일요일이면 6일 전, 아니면 (요일-1)일 전
        startOfWeek.setDate(selectedDate.getDate() - daysToMonday);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // 월요일 + 6일 = 일요일
        return { start: startOfWeek, end: endOfWeek };
      case 'lastWeek':
        // 지난주는 선택된 날짜 기준으로 계산
        const startOfLastWeek = new Date(selectedDate);
        // 지난주 월요일부터 시작하도록 조정
        const dayOfWeekLast = selectedDate.getDay();
        const daysToLastMonday = dayOfWeekLast === 0 ? 13 : dayOfWeekLast + 6; // 일요일이면 13일 전, 아니면 (요일+6)일 전
        startOfLastWeek.setDate(selectedDate.getDate() - daysToLastMonday);
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // 월요일 + 6일 = 일요일
        return { start: startOfLastWeek, end: endOfLastWeek };
      case 'month':
        const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        return { start: startOfMonth, end: endOfMonth };
      case 'lastMonth':
        const startOfLastMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
        const endOfLastMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0);
        return { start: startOfLastMonth, end: endOfLastMonth };
      default: // today
        return { start: selectedDate, end: selectedDate };
    }
  };
  
  const periodRange = getPeriodRange();
  
  // 상담 건수 (기간 내 전체 상담)
  const totalConsults = customers.filter(c => 
    c.appointmentDate && 
    isWithinInterval(parseISO(c.appointmentDate), periodRange)
  );
  
  // 오늘 상담 (필터에 따라 계산 방식 변경)
  const todayConsults = customers.filter(c => {
    if (!c.appointmentDate) return false;
    
    switch(dateFilter) {
      case 'week':
      case 'lastWeek':
      case 'month':
      case 'lastMonth':
        // 기간 누적 상담건
        return isWithinInterval(parseISO(c.appointmentDate), periodRange);
      default:
        // 선택된 날짜만 (오늘 필터일 때)
        return isSameDay(parseISO(c.appointmentDate), selectedDate);
    }
  });
  
  // 남은 상담 (필터에 따라 계산 방식 변경)
  const notConsulted = customers.filter(c => {
    if (!c.appointmentDate) return false;
    
    switch(dateFilter) {
      case 'week':
      case 'lastWeek':
      case 'month':
      case 'lastMonth':
        // 기간 내 상담완료되지 않은 누적건
        return isWithinInterval(parseISO(c.appointmentDate), periodRange) && 
               c.consultationStatus !== '상담완료';
      default:
        // 선택된 날짜 이후 + 선택된 날짜 중 미완료 상담도 포함 (오늘 필터일 때)
        return (
          (isSameDay(parseISO(c.appointmentDate), selectedDate) || isAfter(parseISO(c.appointmentDate), selectedDate)) &&
          c.consultationStatus !== '상담완료'
        );
    }
  });
  
  // 상담 완료 (기간 내 예약 중, 상담완료 처리된 건수)
  const consulted = customers.filter(c => 
    c.appointmentDate && 
    isWithinInterval(parseISO(c.appointmentDate), periodRange) && 
    c.consultationStatus === '상담완료'
  );
  
  // 노쇼 (기간 내 예약 중, '상담 노쇼'로 처리된 건수)
  const noshow = customers.filter(c => 
    c.appointmentDate && 
    isWithinInterval(parseISO(c.appointmentDate), periodRange) && 
    c.consultationStatus === '노쇼'
  );
  
  // 신규 등록 (기간 내 예약 중, 상담완료 후 '신규등록'으로 처리된 건수)
  const registered = customers.filter(c => 
    c.appointmentDate && 
    isWithinInterval(parseISO(c.appointmentDate), periodRange) && 
    c.consultationStatus === '상담완료' && // 상담완료된 건만
    c.registrationStatus === '등록완료'
  );
  
  // 미등록 (기간 내 예약 중, 상담완료 후 '미등록'으로 처리된 건수)
  const notRegistered = customers.filter(c => 
    c.appointmentDate && 
    isWithinInterval(parseISO(c.appointmentDate), periodRange) && 
    c.consultationStatus === '상담완료' && // 상담완료된 건만
    c.registrationStatus === '미등록'
  );

  // 상담 성공률 계산: 신규등록 ÷ 상담완료 × 100 (기간 내 상담완료 중 신규등록의 비율)
  const successRate = consulted.length > 0 ? ((registered.length / consulted.length) * 100).toFixed(1) : '0.0';

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

    setSelectedCustomerForCompletion(customer);
    setShowCompletionOptions(true);
  };

  // 상담완료 옵션 핸들러들
  const handleNewRegistration = () => {
    if (!selectedCustomerForCompletion) return;

    setShowCompletionOptions(false);
    setShowNewRegistrationModal(true);
  };

  const handleUnregistered = () => {
    if (!selectedCustomerForCompletion) return;

    // 미등록 고객 localStorage에 추가
    const existingUnregisteredCustomers = JSON.parse(localStorage.getItem('unregisteredCustomers') || '[]');
    const updatedCustomer = {
      ...selectedCustomerForCompletion,
      consultationStatus: '상담완료',
      registrationStatus: '미등록',
    };
    localStorage.setItem('unregisteredCustomers', JSON.stringify([...existingUnregisteredCustomers, updatedCustomer]));

    // 현재 고객 목록에서 제거
    setCustomers(prev => prev.filter(c => c.id !== selectedCustomerForCompletion.id));
    
    // 상담고객 페이지 localStorage에서도 제거
    const existingConsultationCustomers = JSON.parse(localStorage.getItem('consultationCustomers') || '[]');
    const updatedConsultationCustomers = existingConsultationCustomers.filter((c: any) => c.id !== selectedCustomerForCompletion.id);
    localStorage.setItem('consultationCustomers', JSON.stringify(updatedConsultationCustomers));

    setShowCompletionOptions(false);
    setSelectedCustomerForCompletion(null);

    // 알림 표시
    setNotification({ 
      message: `${selectedCustomerForCompletion.name} 고객이 미등록 고객으로 등록되었습니다.`, 
      type: 'success' 
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleNoShow = () => {
    if (!selectedCustomerForCompletion) return;

    // 노쇼 고객 localStorage에 추가
    const existingNoShowCustomers = JSON.parse(localStorage.getItem('noShowCustomers') || '[]');
    const noShowCustomer = {
      ...selectedCustomerForCompletion,
      consultationStatus: '노쇼',
      registrationStatus: '미등록',
    };
    localStorage.setItem('noShowCustomers', JSON.stringify([...existingNoShowCustomers, noShowCustomer]));

    // 현재 고객 목록에서 제거
    setCustomers(prev => prev.filter(c => c.id !== selectedCustomerForCompletion.id));
    
    // 상담고객 페이지 localStorage에서도 제거
    const existingConsultationCustomers = JSON.parse(localStorage.getItem('consultationCustomers') || '[]');
    const updatedConsultationCustomers = existingConsultationCustomers.filter((c: any) => c.id !== selectedCustomerForCompletion.id);
    localStorage.setItem('consultationCustomers', JSON.stringify(updatedConsultationCustomers));

    setShowCompletionOptions(false);
    setSelectedCustomerForCompletion(null);

    // 알림 표시
    setNotification({ 
      message: `${selectedCustomerForCompletion.name} 고객이 노쇼로 처리되었습니다.`, 
      type: 'success' 
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // 신규등록 폼 제출 핸들러
  const handleNewRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerForCompletion) return;

    // 신규등록 고객 localStorage에 추가
    const existingRegisteredCustomers = JSON.parse(localStorage.getItem('registeredCustomers') || '[]');
    const newRegisteredCustomer = {
      ...selectedCustomerForCompletion,
      id: crypto.randomUUID(),
      consultationStatus: '상담완료',
      registrationStatus: '등록완료',
      notificationStatus: '미발송',
      registrationDate: form.registrationDate,
      membershipType: form.membershipType,
      paymentMethod: form.paymentMethod,
      trainer: form.trainer,
      memberNumber: form.memberNumber,
      recommendedBy: form.recommendedBy,
      birthDate: form.birthDate,
      address: form.address,
      memo: form.memo,
    };
    localStorage.setItem('registeredCustomers', JSON.stringify([...existingRegisteredCustomers, newRegisteredCustomer]));

    // 현재 고객 목록에서 제거
    setCustomers(prev => prev.filter(c => c.id !== selectedCustomerForCompletion.id));
    
    // 상담고객 페이지 localStorage에서도 제거
    const existingConsultationCustomers = JSON.parse(localStorage.getItem('consultationCustomers') || '[]');
    const updatedConsultationCustomers = existingConsultationCustomers.filter((c: any) => c.id !== selectedCustomerForCompletion.id);
    localStorage.setItem('consultationCustomers', JSON.stringify(updatedConsultationCustomers));

    setShowNewRegistrationModal(false);
    setSelectedCustomerForCompletion(null);
    setForm(initialForm);

    // 알림 표시
    setNotification({ 
      message: `${selectedCustomerForCompletion.name} 고객이 신규등록 고객으로 등록되었습니다.`, 
      type: 'success' 
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // 상담기록 핸들러
  const handleConsultationRecord = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setSelectedCustomerForRecord(customer);
      setShowConsultationRecord(true);
    }
  };

  return (
    <div className={`space-y-6 transition-all duration-300 ${showConsultationRecord ? 'mr-1/2' : ''}`}>
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
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px] cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/customers/consultation')}>
          <CalendarDays className="w-6 h-6 text-blue-600" />
          <div>
            <div className="text-xl font-bold text-gray-900">{todayConsults.length}</div>
            <div className="text-gray-500 text-xs font-medium">
              {dateFilter === 'week' ? '이번주 상담' : 
               dateFilter === 'lastWeek' ? '지난주 상담' :
               dateFilter === 'month' ? '이번달 상담' : 
               dateFilter === 'lastMonth' ? '지난달 상담' : '오늘 상담'}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px] cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/customers/consultation')}>
          <CalendarDays className="w-6 h-6 text-gray-400" />
          <div>
            <div className="text-xl font-bold text-gray-900">{notConsulted.length}</div>
            <div className="text-gray-500 text-xs font-medium">
              {dateFilter === 'week' ? '이번주 남은상담' : 
               dateFilter === 'lastWeek' ? '지난주 남은상담' :
               dateFilter === 'month' ? '이번달 남은상담' : 
               dateFilter === 'lastMonth' ? '지난달 남은상담' : '남은 상담'}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px] cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/customers/consultation')}>
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <div>
            <div className="text-xl font-bold text-gray-900">{consulted.length}</div>
            <div className="text-gray-500 text-xs font-medium">
              {dateFilter === 'week' ? '이번주 상담완료' : 
               dateFilter === 'lastWeek' ? '지난주 상담완료' :
               dateFilter === 'month' ? '이번달 상담완료' : 
               dateFilter === 'lastMonth' ? '지난달 상담완료' : '상담완료'}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px] cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/customers/consultation')}>
          <Ban className="w-6 h-6 text-rose-600" />
          <div>
            <div className="text-xl font-bold text-gray-900">{noshow.length}</div>
            <div className="text-gray-500 text-xs font-medium">
              {dateFilter === 'week' ? '이번주 노쇼' : 
               dateFilter === 'lastWeek' ? '지난주 노쇼' :
               dateFilter === 'month' ? '이번달 노쇼' : 
               dateFilter === 'lastMonth' ? '지난달 노쇼' : '상담 노쇼'}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px] cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/customers/registered')}>
          <UserPlus className="w-6 h-6 text-indigo-600" />
          <div>
            <div className="text-xl font-bold text-gray-900">{registered.length}</div>
            <div className="text-gray-500 text-xs font-medium">
              {dateFilter === 'week' ? '이번주 신규등록' : 
               dateFilter === 'lastWeek' ? '지난주 신규등록' :
               dateFilter === 'month' ? '이번달 신규등록' : 
               dateFilter === 'lastMonth' ? '지난달 신규등록' : '신규 등록'}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px] cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/customers/unregistered')}>
          <UserX className="w-6 h-6 text-red-500" />
          <div>
            <div className="text-xl font-bold text-gray-900">{notRegistered.length}</div>
            <div className="text-gray-500 text-xs font-medium">
              {dateFilter === 'week' ? '이번주 미등록' : 
               dateFilter === 'lastWeek' ? '지난주 미등록' :
               dateFilter === 'month' ? '이번달 미등록' : 
               dateFilter === 'lastMonth' ? '지난달 미등록' : '미등록'}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-3 flex items-center gap-3 min-w-[120px]">
          <CheckCircle2 className="w-6 h-6 text-blue-600" />
          <div>
            <div className="text-xl font-bold text-gray-900">{successRate}%</div>
            <div className="text-gray-500 text-xs font-medium">
              {dateFilter === 'week' ? '이번주 성공률' : 
               dateFilter === 'lastWeek' ? '지난주 성공률' :
               dateFilter === 'month' ? '이번달 성공률' : 
               dateFilter === 'lastMonth' ? '지난달 성공률' : '상담 성공률'}
            </div>
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
          <div className="border border-gray-300 rounded bg-gray-100 text-gray-900 h-10 w-40 text-center text-sm font-medium flex items-center justify-center p-2">
            {dateFilter === 'today' ? 
              parseISO(date).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) :
              dateFilter === 'week' ? 
                `${periodRange.start.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}~${periodRange.end.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}` :
              dateFilter === 'lastWeek' ? 
                `${periodRange.start.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}~${periodRange.end.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}` :
              dateFilter === 'month' ? 
                `${periodRange.start.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit' })}.${periodRange.start.getDate().toString().padStart(2, '0')}~${periodRange.end.getDate().toString().padStart(2, '0')}` :
              dateFilter === 'lastMonth' ? 
                `${periodRange.start.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit' })}.${periodRange.start.getDate().toString().padStart(2, '0')}~${periodRange.end.getDate().toString().padStart(2, '0')}` :
              parseISO(date).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
            }
          </div>

          <select 
            value={dateFilter} 
            onChange={(e) => {
              const filter = e.target.value;
              setDateFilter(filter);
              
              const today = new Date();
              const startOfWeek = new Date(today);
              startOfWeek.setDate(today.getDate() - today.getDay());
              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setDate(startOfWeek.getDate() + 6);
              
              const startOfLastWeek = new Date(today);
              startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
              const endOfLastWeek = new Date(startOfLastWeek);
              endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
              
              const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
              const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
              
              const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
              const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
              
              switch(filter) {
                case 'today':
                  setDate(getTodayStr());
                  break;
                case 'week':
                  setDate(startOfWeek.toISOString().split('T')[0]);
                  break;
                case 'lastWeek':
                  setDate(startOfLastWeek.toISOString().split('T')[0]);
                  break;
                case 'month':
                  setDate(startOfMonth.toISOString().split('T')[0]);
                  break;
                case 'lastMonth':
                  setDate(startOfLastMonth.toISOString().split('T')[0]);
                  break;
              }
            }}
            className="border border-gray-300 rounded bg-gray-100 text-gray-900 h-10 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">오늘</option>
            <option value="week">이번주</option>
            <option value="lastWeek">지난주</option>
            <option value="month">이번달</option>
            <option value="lastMonth">지난달</option>
          </select>
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
              <th className="p-3">알림톡 발송 여부</th>
              <th className="p-3">상담기록</th>
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
                  {c.notificationStatus === '1차 알림톡 발송' ? (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">1차 알림톡 발송</span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-700">미발송</span>
                  )}
                </td>
                <td className="p-3 align-middle">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleConsultationRecord(c.id)}
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
                      onClick={() => handleCompleteConsult(c.id)}
                    >
                      상담완료
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
                <td colSpan={8} className="text-center p-8 text-gray-500">등록된 상담 고객이 없습니다.</td>
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

      {/* 상담완료 옵션 팝업 */}
      <Dialog open={showCompletionOptions} onOpenChange={setShowCompletionOptions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>상담완료 처리</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              {selectedCustomerForCompletion?.name} 고객의 상담완료 처리를 선택해주세요.
            </p>
            <div className="grid grid-cols-1 gap-3">
              <Button 
                onClick={handleNewRegistration}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                신규등록
              </Button>
              <Button 
                onClick={handleUnregistered}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                미등록
              </Button>
              <Button 
                onClick={handleNoShow}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                상담 노쇼
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 신규등록 팝업 */}
      <Dialog open={showNewRegistrationModal} onOpenChange={setShowNewRegistrationModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>신규등록</DialogTitle>
          </DialogHeader>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleNewRegistrationSubmit}>
            {/* 기존 상담 고객 정보 (자동 입력, 수정 불가) */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-reg-name">이름</Label>
              <Input 
                id="new-reg-name" 
                name="name" 
                placeholder="이름" 
                value={selectedCustomerForCompletion?.name || ''} 
                disabled 
                className="bg-gray-100"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-reg-phone">연락처</Label>
              <Input 
                id="new-reg-phone" 
                name="phone" 
                placeholder="연락처" 
                value={selectedCustomerForCompletion?.phone || ''} 
                disabled 
                className="bg-gray-100"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-reg-appointmentDate">예약일시</Label>
              <Input 
                id="new-reg-appointmentDate" 
                name="appointmentDate" 
                placeholder="예약일시" 
                value={selectedCustomerForCompletion?.appointmentDate?.replace('T', ' ') || ''} 
                disabled 
                className="bg-gray-100"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-reg-inquiryChannel">문의경로</Label>
              <Input 
                id="new-reg-inquiryChannel" 
                name="inquiryChannel" 
                placeholder="문의경로" 
                value={selectedCustomerForCompletion?.inquiryChannel || ''} 
                disabled 
                className="bg-gray-100"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-reg-sport">종목</Label>
              <Input 
                id="new-reg-sport" 
                name="sport" 
                placeholder="종목" 
                value={selectedCustomerForCompletion?.sport || ''} 
                disabled 
                className="bg-gray-100"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="new-reg-memo">상담기록</Label>
              <Input 
                id="new-reg-memo" 
                name="memo" 
                placeholder="상담기록" 
                value={selectedCustomerForCompletion?.memo || ''} 
                disabled 
                className="bg-gray-100"
              />
            </div>
            
            {/* 신규등록 추가 정보 (입력 필요) */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-reg-registrationDate">등록일</Label>
              <Input 
                id="new-reg-registrationDate" 
                name="registrationDate" 
                type="date" 
                value={form.registrationDate || ''} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-reg-membershipType">회원권 종류</Label>
              <select 
                id="new-reg-membershipType" 
                name="membershipType" 
                value={form.membershipType || ''} 
                onChange={handleChange} 
                className="border rounded p-2"
                required
              >
                <option value="">선택</option>
                <option value="1개월">1개월</option>
                <option value="3개월">3개월</option>
                <option value="6개월">6개월</option>
                <option value="12개월">12개월</option>
                <option value="PT 10회">PT 10회</option>
                <option value="PT 20회">PT 20회</option>
                <option value="PT 30회">PT 30회</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-reg-paymentMethod">결제방법</Label>
              <select 
                id="new-reg-paymentMethod" 
                name="paymentMethod" 
                value={form.paymentMethod || ''} 
                onChange={handleChange} 
                className="border rounded p-2"
                required
              >
                <option value="">선택</option>
                <option value="현금">현금</option>
                <option value="카드">카드</option>
                <option value="계좌이체">계좌이체</option>
                <option value="카카오페이">카카오페이</option>
                <option value="네이버페이">네이버페이</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-reg-trainer">담당 트레이너</Label>
              <select 
                id="new-reg-trainer" 
                name="trainer" 
                value={form.trainer || ''} 
                onChange={handleChange} 
                className="border rounded p-2"
              >
                <option value="">선택</option>
                <option value="김트레이너">김트레이너</option>
                <option value="이트레이너">이트레이너</option>
                <option value="박트레이너">박트레이너</option>
                <option value="최트레이너">최트레이너</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-reg-memberNumber">회원번호</Label>
              <Input 
                id="new-reg-memberNumber" 
                name="memberNumber" 
                placeholder="회원번호" 
                value={form.memberNumber || ''} 
                onChange={handleChange} 
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-reg-recommendedBy">추천회원</Label>
              <Input 
                id="new-reg-recommendedBy" 
                name="recommendedBy" 
                placeholder="추천회원" 
                value={form.recommendedBy || ''} 
                onChange={handleChange} 
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-reg-birthDate">생년월일</Label>
              <Input 
                id="new-reg-birthDate" 
                name="birthDate" 
                type="date" 
                value={form.birthDate || ''} 
                onChange={handleChange} 
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <Label htmlFor="new-reg-address">주소</Label>
              <Input 
                id="new-reg-address" 
                name="address" 
                placeholder="주소" 
                value={form.address || ''} 
                onChange={handleChange} 
              />
            </div>
            <div className="md:col-span-2 flex gap-2 justify-end mt-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">신규등록 완료</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">취소</Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 상담기록 사이드 패널 */}
      {selectedCustomerForRecord && (
        <ConsultationRecordPanel
          customer={selectedCustomerForRecord}
          isOpen={showConsultationRecord}
          onClose={() => {
            setShowConsultationRecord(false);
            setSelectedCustomerForRecord(null);
          }}
        />
      )}
    </div>
  );
} 