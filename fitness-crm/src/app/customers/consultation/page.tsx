"use client"

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
      setNotification({ message: `${updatedCustomer.name} 고객 정보가 수정되었습니다.`, type: 'success' });
      setTimeout(() => { setNotification(null); }, 3000);
      setEditingId(null);
    } else {
      const newCustomer = { ...form, id: crypto.randomUUID(), notificationStatus: '미발송' };
      setCustomers((prev) => [ ...prev, newCustomer ]);
      const existingConsultationCustomers = JSON.parse(localStorage.getItem('consultationCustomers') || '[]');
      localStorage.setItem('consultationCustomers', JSON.stringify([...existingConsultationCustomers, newCustomer]));
      setNotification({ message: `${newCustomer.name} 고객이 상담고객으로 등록되었습니다.`, type: 'success' });
      setTimeout(() => { setNotification(null); }, 3000);
    }
    setForm(initialForm);
  };

  const handleEdit = (id: string) => {
    const customer = customers.find((c) => c.id === id);
    if (customer) {
      setForm({ ...customer, memo: customer.memo ?? '' });
      setEditingId(id);
      setOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
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
    const existingRegisteredCustomers = JSON.parse(localStorage.getItem('registeredCustomers') || '[]');
    localStorage.setItem('registeredCustomers', JSON.stringify([...existingRegisteredCustomers, newRegisteredCustomer]));
    setForm(initialForm);
    setShowNewConsultationModal(false);
    setCompletedCustomer(null);
    setNotification({ message: `${completedCustomer.name} 고객이 신규등록 고객으로 등록되었습니다. 신규등록 고객 페이지로 이동합니다.`, type: 'success' });
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
      const updatedCustomer = { ...customer, consultationStatus: '상담완료' };
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
      const existingConsultationCustomers = JSON.parse(localStorage.getItem('consultationCustomers') || '[]');
      const updatedConsultationCustomers = existingConsultationCustomers.map((c: any) => 
        c.id === id ? updatedCustomer : c
      );
      localStorage.setItem('consultationCustomers', JSON.stringify(updatedConsultationCustomers));
      const existingUnregisteredCustomers = JSON.parse(localStorage.getItem('unregisteredCustomers') || '[]');
      const customerExists = existingUnregisteredCustomers.some((c: any) => c.id === id);
      if (!customerExists) {
        localStorage.setItem('unregisteredCustomers', JSON.stringify([...existingUnregisteredCustomers, updatedCustomer]));
      }
      setNotification({ message: `${customer.name} 고객의 상담이 완료되었습니다. 미등록 고객 페이지로 이동합니다.`, type: 'success' });
      setTimeout(() => {
        setNotification(null);
        router.push('/customers/unregistered');
      }, 3000);
    } else {
      const updatedCustomer = { ...customer, consultationStatus: '상담완료' };
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
      const existingConsultationCustomers = JSON.parse(localStorage.getItem('consultationCustomers') || '[]');
      const updatedConsultationCustomers = existingConsultationCustomers.map((c: any) => 
        c.id === id ? updatedCustomer : c
      );
      localStorage.setItem('consultationCustomers', JSON.stringify(updatedConsultationCustomers));
      setCompletedCustomer(customer);
      setShowNewConsultationModal(true);
      setNotification({ message: `${customer.name} 고객의 상담이 완료되었습니다. 신규상담 폼이 열립니다.`, type: 'success' });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">상담 고객 관리</h1>

      {/* 고객 추가/수정 다이얼로그 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">고객 추가</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? '고객 수정' : '고객 추가'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="name">이름</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">전화번호</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="appointmentDate">예약일</Label>
              <Input
                type="date"
                id="appointmentDate"
                name="appointmentDate"
                value={form.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="inquiryChannel">문의 채널</Label>
              <Select value={form.inquiryChannel} onValueChange={handleChange} name="inquiryChannel" required>
                <SelectTrigger>
                  <SelectValue placeholder="문의 채널 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전화">전화</SelectItem>
                  <SelectItem value="카카오톡">카카오톡</SelectItem>
                  <SelectItem value="카카오페이">카카오페이</SelectItem>
                  <SelectItem value="웹사이트">웹사이트</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sport">운동 종목</Label>
              <Select value={form.sport} onValueChange={handleChange} name="sport" required>
                <SelectTrigger>
                  <SelectValue placeholder="운동 종목 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="헬스">헬스</SelectItem>
                  <SelectItem value="요가">요가</SelectItem>
                  <SelectItem value="필라테스">필라테스</SelectItem>
                  <SelectItem value="크로스핏">크로스핏</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="appointmentPurpose">예약 목적</Label>
              <Select value={form.appointmentPurpose} onValueChange={handleChange} name="appointmentPurpose" required>
                <SelectTrigger>
                  <SelectValue placeholder="예약 목적 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="상담">상담</SelectItem>
                  <SelectItem value="체험">체험</SelectItem>
                  <SelectItem value="등록">등록</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="consultationStatus">상담 상태</Label>
              <Select value={form.consultationStatus} onValueChange={(value) => handleStatusChange(editingId || '', 'consultationStatus', value)} name="consultationStatus" required>
                <SelectTrigger>
                  <SelectValue placeholder="상담 상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="미상담">미상담</SelectItem>
                  <SelectItem value="상담완료">상담완료</SelectItem>
                  <SelectItem value="노쇼">노쇼</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="registrationStatus">등록 상태</Label>
              <Select value={form.registrationStatus} onValueChange={(value) => handleStatusChange(editingId || '', 'registrationStatus', value)} name="registrationStatus" required>
                <SelectTrigger>
                  <SelectValue placeholder="등록 상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="미등록">미등록</SelectItem>
                  <SelectItem value="등록완료">등록완료</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notificationStatus">알림 상태</Label>
              <Select value={form.notificationStatus} onValueChange={(value) => handleStatusChange(editingId || '', 'notificationStatus', value)} name="notificationStatus" required>
                <SelectTrigger>
                  <SelectValue placeholder="알림 상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="미발송">미발송</SelectItem>
                  <SelectItem value="1차 알림톡 발송">1차 알림톡 발송</SelectItem>
                  <SelectItem value="2차 알림톡 발송">2차 알림톡 발송</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="memo">메모</Label>
              <Input
                type="text"
                id="memo"
                name="memo"
                value={form.memo}
                onChange={handleChange}
              />
            </div>
            <Button type="submit">{editingId ? '수정' : '추가'}</Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                취소
              </Button>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* 고객 목록 */}
      <div className="grid gap-4 mb-4">
        <h2 className="text-xl font-semibold">고객 목록</h2>
        <div className="flex items-center gap-2 mb-2">
          <Button onClick={handlePrevDate} disabled={new Date(date) < new Date()}>이전 날짜</Button>
          <Button onClick={handleToday}>오늘</Button>
          <Button onClick={handleNextDate} disabled={new Date(date) > new Date()}>다음 날짜</Button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Calendar
            onChange={setDate}
            value={parseISO(date)}
            onClickDay={() => setOpen(true)}
            tileContent={({ date }) => renderEventsForDate(date)}
            className="crm-calendar"
          />
        </div>
      </div>

      {/* 대시보드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">오늘의 상담</h3>
          <p>{todayConsults.length}건</p>
          <p>총 상담 시간: {todayConsults.reduce((sum, c) => sum + (parseISO(c.appointmentDate).getHours() - 8) * 60 + (parseISO(c.appointmentDate).getMinutes() - 30), 0)}분</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">이번 주 상담</h3>
          <p>{weekConsults.length}건</p>
          <p>총 상담 시간: {weekConsults.reduce((sum, c) => sum + (parseISO(c.appointmentDate).getHours() - 8) * 60 + (parseISO(c.appointmentDate).getMinutes() - 30), 0)}분</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">미상담 고객</h3>
          <p>{notConsulted.length}건</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">상담 완료 고객</h3>
          <p>{consulted.length}건</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">등록 완료 고객</h3>
          <p>{registered.length}건</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">미등록 고객</h3>
          <p>{notRegistered.length}건</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">이번 달 상담</h3>
          <p>{monthConsults.length}건</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">노쇼 고객</h3>
          <p>{noshow.length}건</p>
        </div>
      </div>

      {/* 상담 성공률 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-bold mb-2">상담 성공률</h3>
        <p>총 상담 건수: {totalConsults}건</p>
        <p>상담 성공률: {successRate}%</p>
      </div>

      {/* 고객 목록 테이블 */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">고객 목록</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  전화번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  예약일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  문의 채널
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  운동 종목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  예약 목적
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상담 상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  등록 상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  알림 상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  메모
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  행동
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(parseISO(customer.appointmentDate), 'yyyy-MM-dd')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.inquiryChannel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.sport}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.appointmentPurpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.consultationStatus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.registrationStatus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.notificationStatus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.memo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(customer.id)}>수정</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(customer.id)}>삭제</Button>
                    {customer.consultationStatus === '미상담' && (
                      <Button variant="outline" size="sm" onClick={() => handleCompleteConsult(customer.id)}>상담 완료</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 신규상담 폼 */}
      {showNewConsultationModal && completedCustomer && (
        <Dialog open={showNewConsultationModal} onOpenChange={setShowNewConsultationModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>신규 상담 폼</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleNewConsultationSubmit} className="grid gap-4">
              <div>
                <Label htmlFor="newConsultationName">이름</Label>
                <Input
                  type="text"
                  id="newConsultationName"
                  name="name"
                  value={completedCustomer.name}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="newConsultationPhone">전화번호</Label>
                <Input
                  type="tel"
                  id="newConsultationPhone"
                  name="phone"
                  value={completedCustomer.phone}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="newConsultationAppointmentDate">예약일</Label>
                <Input
                  type="date"
                  id="newConsultationAppointmentDate"
                  name="appointmentDate"
                  value={form.appointmentDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newConsultationInquiryChannel">문의 채널</Label>
                <Select value={form.inquiryChannel} onValueChange={handleChange} name="inquiryChannel" required>
                  <SelectTrigger>
                    <SelectValue placeholder="문의 채널 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="전화">전화</SelectItem>
                    <SelectItem value="카카오톡">카카오톡</SelectItem>
                    <SelectItem value="카카오페이">카카오페이</SelectItem>
                    <SelectItem value="웹사이트">웹사이트</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="newConsultationSport">운동 종목</Label>
                <Select value={form.sport} onValueChange={handleChange} name="sport" required>
                  <SelectTrigger>
                    <SelectValue placeholder="운동 종목 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="헬스">헬스</SelectItem>
                    <SelectItem value="요가">요가</SelectItem>
                    <SelectItem value="필라테스">필라테스</SelectItem>
                    <SelectItem value="크로스핏">크로스핏</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="newConsultationAppointmentPurpose">예약 목적</Label>
                <Select value={form.appointmentPurpose} onValueChange={handleChange} name="appointmentPurpose" required>
                  <SelectTrigger>
                    <SelectValue placeholder="예약 목적 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="상담">상담</SelectItem>
                    <SelectItem value="체험">체험</SelectItem>
                    <SelectItem value="등록">등록</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="newConsultationMemo">메모</Label>
                <Input
                  type="text"
                  id="newConsultationMemo"
                  name="memo"
                  value={form.memo}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit">신규 상담 등록</Button>
              <Button type="button" variant="outline" onClick={() => setShowNewConsultationModal(false)}>
                취소
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* 알림 */}
      {notification && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 p-3 rounded-lg text-white ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
} 