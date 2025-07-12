'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CustomerTable } from '@/components/customers/CustomerTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CustomerForm } from '@/components/customers/CustomerForm'
import { api } from '@/lib/api/client'
import { ConsultationFormData } from '@/lib/types'

export default function ConsultationCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: customers, isLoading } = useQuery({
    queryKey: ['consultation-customers', searchTerm],
    queryFn: () => api.getConsultationCustomers(searchTerm),
  })

  const createMutation = useMutation({
    mutationFn: (formData: any) => {
      // Convert string date to Date object
      const data: ConsultationFormData = {
        ...formData,
        appointmentDate: new Date(formData.appointmentDate),
      }
      return api.createConsultationCustomer(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultation-customers'] })
      setIsCreateModalOpen(false)
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">상담 고객 관리</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          신규 상담 등록
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="이름, 연락처로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : (
          <CustomerTable
            customers={customers || []}
            type="consultation"
          />
        )}
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>신규 상담 고객 등록</DialogTitle>
          </DialogHeader>
          <CustomerForm
            type="consultation"
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}