'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2 } from 'lucide-react'

export function BranchSettings() {
  const [branches, setBranches] = useState([
    { id: '1', name: '강남점', address: '서울시 강남구', phone: '02-1234-5678' },
    { id: '2', name: '홍대점', address: '서울시 마포구', phone: '02-2345-6789' },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">지점 목록</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          지점 추가
        </Button>
      </div>

      <div className="grid gap-4">
        {branches.map((branch) => (
          <Card key={branch.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{branch.name}</CardTitle>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>주소</Label>
                  <p className="text-sm text-gray-600">{branch.address}</p>
                </div>
                <div>
                  <Label>연락처</Label>
                  <p className="text-sm text-gray-600">{branch.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 