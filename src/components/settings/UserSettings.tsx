'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2 } from 'lucide-react'

export function UserSettings() {
  const [users, setUsers] = useState([
    { id: '1', name: '김매니저', email: 'manager@fitness.com', role: '매니저', branch: '강남점' },
    { id: '2', name: '박트레이너', email: 'trainer@fitness.com', role: '트레이너', branch: '홍대점' },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">사용자 목록</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          사용자 추가
        </Button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{user.name}</CardTitle>
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>이메일</Label>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div>
                  <Label>역할</Label>
                  <p className="text-sm text-gray-600">{user.role}</p>
                </div>
                <div>
                  <Label>지점</Label>
                  <p className="text-sm text-gray-600">{user.branch}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 