'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Save } from 'lucide-react'

export function SystemSettings() {
  const [settings, setSettings] = useState({
    companyName: 'Fitness CRM',
    contactEmail: 'admin@fitness.com',
    contactPhone: '02-1234-5678',
    autoBackup: true,
    emailNotifications: true,
    smsNotifications: false,
  })

  const handleSave = () => {
    // 설정 저장 로직
    if (process.env.NODE_ENV === 'development') {
      console.log('설정 저장:', settings);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">시스템 설정</h3>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          저장
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="companyName">회사명</Label>
            <Input
              id="companyName"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="contactEmail">연락처 이메일</Label>
            <Input
              id="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="contactPhone">연락처 전화번호</Label>
            <Input
              id="contactPhone"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>자동 백업</Label>
              <p className="text-sm text-gray-600">매일 자동으로 데이터를 백업합니다</p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>이메일 알림</Label>
              <p className="text-sm text-gray-600">중요한 이벤트를 이메일로 알림받습니다</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>SMS 알림</Label>
              <p className="text-sm text-gray-600">긴급한 사항을 SMS로 알림받습니다</p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 