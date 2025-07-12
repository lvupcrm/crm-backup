'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, Edit, Save, Trash2, Calendar, Phone, Mail, User, CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface RegisteredCustomer {
  id: string
  name: string
  phone: string
  email?: string
  joinDate: string
  membershipType: string
  membershipExpiry: string
  trainerId?: string
  trainer?: {
    id: string
    name: string
  }
  branchId: string
  branch?: {
    id: string
    name: string
  }
  status: string
  memo?: string
  createdAt: string
  updatedAt: string
}

export default function RegisteredCustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState<RegisteredCustomer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<RegisteredCustomer>>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const customerId = params.id as string

  useEffect(() => {
    const loadCustomer = () => {
      try {
        const customers = JSON.parse(localStorage.getItem('registeredCustomers') || '[]')
        const foundCustomer = customers.find((c: RegisteredCustomer) => c.id === customerId)
        
        if (foundCustomer) {
          setCustomer(foundCustomer)
          setEditForm(foundCustomer)
        } else {
          router.push('/customers/registered')
        }
      } catch (error) {
        console.error('고객 정보 로드 실패:', error)
        router.push('/customers/registered')
      } finally {
        setIsLoading(false)
      }
    }

    if (customerId) {
      loadCustomer()
    }
  }, [customerId, router])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!customer) return

    try {
      const customers = JSON.parse(localStorage.getItem('registeredCustomers') || '[]')
      const updatedCustomers = customers.map((c: RegisteredCustomer) =>
        c.id === customerId ? { ...c, ...editForm, updatedAt: new Date().toISOString() } : c
      )
      
      localStorage.setItem('registeredCustomers', JSON.stringify(updatedCustomers))
      setCustomer({ ...customer, ...editForm, updatedAt: new Date().toISOString() })
      setIsEditing(false)
    } catch (error) {
      console.error('고객 정보 업데이트 실패:', error)
    }
  }

  const handleDelete = () => {
    if (!customer) return

    try {
      const customers = JSON.parse(localStorage.getItem('registeredCustomers') || '[]')
      const filteredCustomers = customers.filter((c: RegisteredCustomer) => c.id !== customerId)
      
      localStorage.setItem('registeredCustomers', JSON.stringify(filteredCustomers))
      router.push('/customers/registered')
    } catch (error) {
      console.error('고객 삭제 실패:', error)
    }
  }

  const handleInputChange = (field: keyof RegisteredCustomer, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  const isMembershipExpired = () => {
    if (!customer) return false
    return new Date(customer.membershipExpiry) < new Date()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">고객을 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </Button>
          <h1 className="text-2xl font-bold">등록 고객 상세</h1>
        </div>
        
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <Button onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                수정
              </Button>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>고객 삭제</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>정말로 이 고객을 삭제하시겠습니까?</p>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                        취소
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        삭제
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>기본 정보</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editForm.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-600">{customer.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">연락처</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editForm.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-600 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {customer.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-600 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {customer.email || '-'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinDate">가입일</Label>
              {isEditing ? (
                <Input
                  id="joinDate"
                  type="date"
                  value={editForm.joinDate ? editForm.joinDate.split('T')[0] : ''}
                  onChange={(e) => handleInputChange('joinDate', e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(new Date(customer.joinDate), 'PPP', { locale: ko })}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>멤버십 정보</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="membershipType">멤버십 종류</Label>
              {isEditing ? (
                <Input
                  id="membershipType"
                  value={editForm.membershipType || ''}
                  onChange={(e) => handleInputChange('membershipType', e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-600">{customer.membershipType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="membershipExpiry">만료일</Label>
              {isEditing ? (
                <Input
                  id="membershipExpiry"
                  type="date"
                  value={editForm.membershipExpiry ? editForm.membershipExpiry.split('T')[0] : ''}
                  onChange={(e) => handleInputChange('membershipExpiry', e.target.value)}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">
                    {format(new Date(customer.membershipExpiry), 'PPP', { locale: ko })}
                  </p>
                  {isMembershipExpired() && (
                    <Badge variant="destructive">만료됨</Badge>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>상태</Label>
              {isEditing ? (
                <select
                  value={editForm.status || ''}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="활동">활동</option>
                  <option value="만료">만료</option>
                  <option value="휴면">휴면</option>
                </select>
              ) : (
                <Badge 
                  variant={
                    customer.status === '활동' ? 'default' : 
                    customer.status === '만료' ? 'destructive' : 'secondary'
                  }
                >
                  {customer.status}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label>지점</Label>
              <p className="text-sm text-gray-600">
                {customer.branch?.name || '지점 정보 없음'}
              </p>
            </div>

            <div className="space-y-2">
              <Label>담당 트레이너</Label>
              <p className="text-sm text-gray-600">
                {customer.trainer?.name || '담당 트레이너 없음'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">메모</Label>
            {isEditing ? (
              <Textarea
                id="memo"
                value={editForm.memo || ''}
                onChange={(e) => handleInputChange('memo', e.target.value)}
                rows={4}
              />
            ) : (
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {customer.memo || '메모가 없습니다.'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>시스템 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>생성일</span>
            <span>{format(new Date(customer.createdAt), 'PPP p', { locale: ko })}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>수정일</span>
            <span>{format(new Date(customer.updatedAt), 'PPP p', { locale: ko })}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
