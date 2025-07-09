'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BranchSettings } from '@/components/settings/BranchSettings'
import { UserSettings } from '@/components/settings/UserSettings'
import { RoleSettings } from '@/components/settings/RoleSettings'
import { SystemSettings } from '@/components/settings/SystemSettings'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">설정</h1>
        <p className="text-gray-600 mt-2">시스템 설정을 관리합니다</p>
      </div>

      <Tabs defaultValue="branch" className="space-y-4">
        <TabsList>
          <TabsTrigger value="branch">지점 관리</TabsTrigger>
          <TabsTrigger value="user">사용자 관리</TabsTrigger>
          <TabsTrigger value="role">역할 관리</TabsTrigger>
          <TabsTrigger value="system">시스템 설정</TabsTrigger>
        </TabsList>

        <TabsContent value="branch">
          <Card>
            <CardHeader>
              <CardTitle>지점 관리</CardTitle>
              <CardDescription>
                지점 정보를 추가하고 관리합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BranchSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>사용자 관리</CardTitle>
              <CardDescription>
                직원 계정을 추가하고 권한을 설정합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="role">
          <Card>
            <CardHeader>
              <CardTitle>역할 관리</CardTitle>
              <CardDescription>
                사용자 역할과 권한을 설정합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>시스템 설정</CardTitle>
              <CardDescription>
                전체 시스템 설정을 관리합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SystemSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
