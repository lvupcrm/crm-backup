'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, Trash2 } from 'lucide-react'

export function RoleSettings() {
  const [roles, setRoles] = useState([
    {
      id: '1',
      name: '관리자',
      permissions: {
        customers: { view: true, create: true, edit: true, delete: true },
        messages: { view: true, create: true, edit: true, delete: true, send: true },
        products: { view: true, create: true, edit: true, delete: true },
        statistics: { view: true },
        settings: { view: true, edit: true },
      }
    },
    {
      id: '2',
      name: '매니저',
      permissions: {
        customers: { view: true, create: true, edit: true, delete: false },
        messages: { view: true, create: true, edit: true, delete: false, send: true },
        products: { view: true, create: false, edit: false, delete: false },
        statistics: { view: true },
        settings: { view: false, edit: false },
      }
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">역할 목록</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          역할 추가
        </Button>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{role.name}</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">고객 관리</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch checked={role.permissions.customers.view} />
                      <span className="text-sm">조회</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={role.permissions.customers.create} />
                      <span className="text-sm">생성</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={role.permissions.customers.edit} />
                      <span className="text-sm">수정</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={role.permissions.customers.delete} />
                      <span className="text-sm">삭제</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 