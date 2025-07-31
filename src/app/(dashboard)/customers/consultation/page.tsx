'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CustomerTable } from '@/components/customers/CustomerTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ConsultationCustomer } from '@prisma/client'

export default function ConsultationCustomersPage() {
  const [searchParams, setSearchParams] = useState({
    startDate: format(subDays(new Date(), 365), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    staff: 'all',
    searchTerm: ''
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [form, setForm] = useState({
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
  })
  const queryClient = useQueryClient()

  const { data: customers, isLoading } = useQuery({
    queryKey: ['consultation-customers', searchParams],
    queryFn: async () => {
      // home 페이지의 상담 고객 데이터를 사용
      const stored = localStorage.getItem('consultationCustomers');
      if (stored) {
        const allCustomers = JSON.parse(stored);
        
        // 검색 필터링 적용
        let filteredCustomers = allCustomers;
        
        // 날짜 필터링
        if (searchParams.startDate && searchParams.endDate) {
          filteredCustomers = filteredCustomers.filter((customer: ConsultationCustomer) => {
            const appointmentDate = new Date(customer.appointmentDate);
            const startDate = new Date(searchParams.startDate);
            const endDate = new Date(searchParams.endDate);
            return appointmentDate >= startDate && appointmentDate <= endDate;
          });
        }
        
        // 담당자 필터링
        if (searchParams.staff && searchParams.staff !== 'all') {
          filteredCustomers = filteredCustomers.filter((customer: ConsultationCustomer) => 
            customer.managerId === searchParams.staff
          );
        }
        
        // 텍스트 검색
        if (searchParams.searchTerm) {
          const searchLower = searchParams.searchTerm.toLowerCase();
          filteredCustomers = filteredCustomers.filter((customer: ConsultationCustomer) =>
            customer.name?.toLowerCase().includes(searchLower) ||
            customer.phone?.includes(searchParams.searchTerm) ||
            customer.memo?.toLowerCase().includes(searchLower)
          );
        }
        
        return filteredCustomers;
      }
      return [];
    },
  })


  const handleDateRangeChange = (type: 'all' | 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'lastMonth') => {
    const today = new Date()
    let startDate: Date
    let endDate: Date

    switch (type) {
      case 'all':
        // 전체 기간 (과거 1년 ~ 오늘)
        startDate = subDays(today, 365)
        endDate = today
        break
      case 'today':
        startDate = today
        endDate = today
        break
      case 'yesterday':
        startDate = subDays(today, 1)
        endDate = subDays(today, 1)
        break
      case 'thisWeek':
        startDate = startOfWeek(today, { weekStartsOn: 1 })
        endDate = endOfWeek(today, { weekStartsOn: 1 })
        break
      case 'thisMonth':
        startDate = startOfMonth(today)
        endDate = endOfMonth(today)
        break
      case 'lastMonth':
        startDate = startOfMonth(subDays(startOfMonth(today), 1))
        endDate = endOfMonth(subDays(startOfMonth(today), 1))
        break
    }

    setSearchParams(prev => ({
      ...prev,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    }))
  }

  const handleSearch = () => {
    // 검색 로직은 이미 useQuery에서 처리됨
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 상담 고객 localStorage에 추가
    const existingConsultationCustomers = JSON.parse(localStorage.getItem('consultationCustomers') || '[]')
    const newConsultationCustomer = {
      ...form,
      id: crypto.randomUUID(),
    }
    localStorage.setItem('consultationCustomers', JSON.stringify([...existingConsultationCustomers, newConsultationCustomer]))

    setForm({
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
    })
    setIsCreateModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">상담 고객 관리</h1>
      </div>

      {/* 날짜 네비게이션 + 검색 + 상담고객추가 버튼 한 줄 배치 */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <button
            className="border border-gray-300 rounded bg-gray-100 text-gray-900 w-10 h-10 flex items-center justify-center text-sm font-medium hover:bg-gray-200 transition-colors p-2"
            aria-label="이전날짜"
            onClick={() => handleDateRangeChange('yesterday')}
            type="button"
          >
            ◀
          </button>
          <div className="border border-gray-300 rounded bg-gray-100 text-gray-900 h-10 w-40 text-center text-sm font-medium flex items-center justify-center p-2">
            {format(new Date(searchParams.startDate), 'yyyy-MM-dd', { locale: ko })} ~ {format(new Date(searchParams.endDate), 'yyyy-MM-dd', { locale: ko })}
          </div>
          <select 
            value="all" 
            onChange={(e) => {
              const filter = e.target.value;
              handleDateRangeChange(filter as 'all' | 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'lastMonth');
            }}
            className="border border-gray-300 rounded bg-gray-100 text-gray-900 h-10 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체</option>
            <option value="today">오늘</option>
            <option value="thisWeek">이번주</option>
            <option value="lastWeek">지난주</option>
            <option value="thisMonth">이번달</option>
            <option value="lastMonth">지난달</option>
          </select>
          <button
            className="border border-gray-300 rounded bg-gray-100 text-gray-900 w-10 h-10 flex items-center justify-center text-sm font-medium hover:bg-gray-200 transition-colors p-2"
            aria-label="다음날짜"
            onClick={() => handleDateRangeChange('today')}
            type="button"
          >
            ▶
          </button>
          
          {/* 검색 필드 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="이름, 연락처로 검색"
              value={searchParams.searchTerm}
              onChange={(e) => setSearchParams(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="pl-10 w-64"
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            검색
          </Button>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateModalOpen(true)}>상담 고객 추가</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>상담 고객 등록</DialogTitle>
            </DialogHeader>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1">
                <Label htmlFor="name">이름</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="이름" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="phone">연락처</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  placeholder="연락처" 
                  value={form.phone} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="appointmentDate">예약일시</Label>
                <Input 
                  id="appointmentDate" 
                  name="appointmentDate" 
                  type="datetime-local" 
                  value={form.appointmentDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="inquiryChannel">문의경로</Label>
                <select 
                  id="inquiryChannel" 
                  name="inquiryChannel" 
                  value={form.inquiryChannel} 
                  onChange={handleChange} 
                  className="border rounded p-2"
                  required
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
                <Label htmlFor="sport">종목</Label>
                <select 
                  id="sport" 
                  name="sport" 
                  value={form.sport} 
                  onChange={handleChange} 
                  className="border rounded p-2"
                  required
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
                <Label htmlFor="appointmentPurpose">예약목적</Label>
                <select 
                  id="appointmentPurpose" 
                  name="appointmentPurpose" 
                  value={form.appointmentPurpose} 
                  onChange={handleChange} 
                  className="border rounded p-2"
                  required
                >
                  <option value="">선택</option>
                  <option value="상담">상담</option>
                  <option value="체험">체험</option>
                  <option value="등록">등록</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <Label htmlFor="memo">메모</Label>
                <Input 
                  id="memo" 
                  name="memo" 
                  placeholder="메모" 
                  value={form.memo} 
                  onChange={handleChange} 
                />
              </div>
              <div className="md:col-span-2 flex gap-2 justify-end mt-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">상담 고객 등록</Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">취소</Button>
                </DialogClose>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>



      {/* 테이블 영역 */}
      <div className="overflow-x-auto rounded shadow bg-white">
        {isLoading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : (
          <CustomerTable
            customers={customers || []}
            type="consultation"
          />
        )}
      </div>


    </div>
  )
}