'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { CustomerTable } from '@/components/customers/CustomerTable'
import { RegisteredCustomer } from '@/lib/types'
import { X } from 'lucide-react'

export default function RegisteredCustomersPage() {
  const [searchParams, setSearchParams] = useState({
    startDate: format(subDays(new Date(), 365), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    staff: 'all',
    membershipType: 'all',
    searchTerm: ''
  })

  const [showNewRegistrationModal, setShowNewRegistrationModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<RegisteredCustomer | null>(null)
  const [showDetailPanel, setShowDetailPanel] = useState(false)
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
    registrationDate: '',
    membershipType: '',
    paymentMethod: '',
    trainer: '',
    memberNumber: '',
    recommendedBy: '',
    birthDate: '',
    address: '',
    memo: '',
  })

  const { data: customers, isLoading } = useQuery({
    queryKey: ['registered-customers', searchParams],
    queryFn: async () => {
      // home 페이지의 등록 고객 데이터를 사용
      const stored = localStorage.getItem('registeredCustomers');
      if (stored) {
        const allCustomers = JSON.parse(stored);
        
        // 검색 필터링 적용
        let filteredCustomers = allCustomers;
        
        // 날짜 필터링
        if (searchParams.startDate && searchParams.endDate) {
          filteredCustomers = filteredCustomers.filter((customer: any) => {
            const registrationDate = new Date(customer.registrationDate || customer.appointmentDate);
            const startDate = new Date(searchParams.startDate);
            const endDate = new Date(searchParams.endDate);
            return registrationDate >= startDate && registrationDate <= endDate;
          });
        }
        
        // 담당자 필터링
        if (searchParams.staff && searchParams.staff !== 'all') {
          filteredCustomers = filteredCustomers.filter((customer: any) => 
            customer.managerId === searchParams.staff
          );
        }
        
        // 회원권 종류 필터링
        if (searchParams.membershipType && searchParams.membershipType !== 'all') {
          filteredCustomers = filteredCustomers.filter((customer: any) => 
            customer.membershipType === searchParams.membershipType
          );
        }
        
        // 텍스트 검색
        if (searchParams.searchTerm) {
          const searchLower = searchParams.searchTerm.toLowerCase();
          filteredCustomers = filteredCustomers.filter((customer: any) =>
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

  const handleNewRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 신규등록 고객 localStorage에 추가
    const existingRegisteredCustomers = JSON.parse(localStorage.getItem('registeredCustomers') || '[]')
    const newRegisteredCustomer = {
      ...form,
      id: crypto.randomUUID(),
      consultationStatus: '상담완료',
      registrationStatus: '등록완료',
      notificationStatus: '미발송',
    }
    localStorage.setItem('registeredCustomers', JSON.stringify([...existingRegisteredCustomers, newRegisteredCustomer]))

    setShowNewRegistrationModal(false)
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
      registrationDate: '',
      membershipType: '',
      paymentMethod: '',
      trainer: '',
      memberNumber: '',
      recommendedBy: '',
      birthDate: '',
      address: '',
      memo: '',
    })
  }

  const handleDetailView = (customer: RegisteredCustomer) => {
    setSelectedCustomer(customer)
    setShowDetailPanel(true)
  }

  return (
    <div className={`space-y-6 transition-all duration-300 ${showDetailPanel ? 'mr-1/2' : ''}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">신규 등록 고객 관리</h1>
      </div>

      {/* 날짜 네비게이션 + 검색 + 신규등록고객추가 버튼 한 줄 배치 */}
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
              handleDateRangeChange(filter as any);
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
        
        <Dialog open={showNewRegistrationModal} onOpenChange={setShowNewRegistrationModal}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowNewRegistrationModal(true)} className="bg-green-600 hover:bg-green-700">
              신규 등록 고객 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>신규등록</DialogTitle>
            </DialogHeader>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleNewRegistrationSubmit}>
              {/* 기본 정보 */}
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
              <div className="flex flex-col gap-1">
                <Label htmlFor="registrationDate">등록일</Label>
                <Input 
                  id="registrationDate" 
                  name="registrationDate" 
                  type="date" 
                  value={form.registrationDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="membershipType">회원권 종류</Label>
                <select 
                  id="membershipType" 
                  name="membershipType" 
                  value={form.membershipType} 
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
                <Label htmlFor="paymentMethod">결제 방법</Label>
                <select 
                  id="paymentMethod" 
                  name="paymentMethod" 
                  value={form.paymentMethod} 
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
                <Label htmlFor="trainer">담당 트레이너</Label>
                <select 
                  id="trainer" 
                  name="trainer" 
                  value={form.trainer} 
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
                <Label htmlFor="memberNumber">회원번호</Label>
                <Input 
                  id="memberNumber" 
                  name="memberNumber" 
                  placeholder="회원번호" 
                  value={form.memberNumber} 
                  onChange={handleChange} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="recommendedBy">추천회원</Label>
                <Input 
                  id="recommendedBy" 
                  name="recommendedBy" 
                  placeholder="추천회원" 
                  value={form.recommendedBy} 
                  onChange={handleChange} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="birthDate">생년월일</Label>
                <Input 
                  id="birthDate" 
                  name="birthDate" 
                  type="date" 
                  value={form.birthDate} 
                  onChange={handleChange} 
                />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <Label htmlFor="address">주소</Label>
                <Input 
                  id="address" 
                  name="address" 
                  placeholder="주소" 
                  value={form.address} 
                  onChange={handleChange} 
                />
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
                <Button type="submit" className="bg-green-600 hover:bg-green-700">신규등록 완료</Button>
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
            type="registered"
            onDetailView={handleDetailView}
          />
        )}
      </div>

      {/* 상세보기 사이드패널 */}
      {showDetailPanel && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-1/2 bg-white shadow-xl flex flex-col ml-auto">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">고객 상세정보</h2>
              <div className="flex items-center space-x-2">
                <Button onClick={() => setShowDetailPanel(false)} variant="outline" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 내용 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
                            <div className="space-y-4">
                {/* 기본 정보 카드 */}
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">기본 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">이름:</span>
                      <span className="font-medium">{selectedCustomer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">연락처:</span>
                      <span className="font-medium">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">생년월일:</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">주소:</span>
                      <span className="font-medium">-</span>
                    </div>
                  </div>
                </div>

                {/* 등록 정보 카드 */}
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">등록 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">등록일:</span>
                      <span className="font-medium">
                        {selectedCustomer.joinDate ? format(new Date(selectedCustomer.joinDate), 'yyyy-MM-dd', { locale: ko }) : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">회원권 종류:</span>
                      <span className="font-medium">{selectedCustomer.membershipType || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">결제 방법:</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">담당 트레이너:</span>
                      <span className="font-medium">{selectedCustomer.trainerId || '미배정'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">회원번호:</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">추천회원:</span>
                      <span className="font-medium">-</span>
                    </div>
                  </div>
                </div>

                {/* 상담 정보 카드 */}
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">상담 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">예약일시:</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">문의경로:</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">종목:</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">예약목적:</span>
                      <span className="font-medium">-</span>
                    </div>
                  </div>
                </div>

                {/* 메모 카드 */}
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">메모</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700">{selectedCustomer.memo || '메모가 없습니다.'}</p>
                  </div>
                </div>

                {/* 상태 정보 카드 */}
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">상태 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">상담상태:</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">등록상태:</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">알림상태:</span>
                      <span className="font-medium">-</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
