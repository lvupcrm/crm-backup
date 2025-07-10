"use client"

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Overview } from '@/components/dashboard/Overview'
import { RecentCustomers } from '@/components/dashboard/RecentCustomers'
import { Button } from '@/components/ui/button'
import { Users, UserPlus, CreditCard, TrendingUp, Download } from 'lucide-react'
import * as React from 'react'

// Dummy export helpers (실제 구현 필요)
function exportSectionToExcel(section: string) {
  alert(`${section} 데이터를 엑셀로 내보냅니다.`)
}

function BranchStats() {
  // TODO: 실제 데이터 fetch/가공
  const data = [
    { name: '둔전점', active: 120, revenue: 12000000, growth: 8.2 },
    { name: '본점', active: 90, revenue: 9000000, growth: 5.1 },
  ]
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>지점별 현황</CardTitle>
        <Button size="sm" variant="outline" onClick={() => exportSectionToExcel('지점별 현황')}><Download className="w-4 h-4 mr-1" />엑셀로 내보내기</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">지점명</th>
                <th className="p-2">활성 회원</th>
                <th className="p-2">매출</th>
                <th className="p-2">성장률</th>
              </tr>
            </thead>
            <tbody>
              {data.map((b) => (
                <tr key={b.name} className="border-b">
                  <td className="p-2 font-medium">{b.name}</td>
                  <td className="p-2">{b.active}</td>
                  <td className="p-2">{b.revenue.toLocaleString()}원</td>
                  <td className="p-2">{b.growth}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function TrainerStats() {
  // TODO: 실제 데이터 fetch/가공
  const data = [
    { name: '김트레이너', assigned: 40, retention: 92 },
    { name: '박트레이너', assigned: 35, retention: 88 },
  ]
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>트레이너별 실적</CardTitle>
        <Button size="sm" variant="outline" onClick={() => exportSectionToExcel('트레이너별 실적')}><Download className="w-4 h-4 mr-1" />엑셀로 내보내기</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">트레이너명</th>
                <th className="p-2">담당 회원</th>
                <th className="p-2">회원 유지율</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t) => (
                <tr key={t.name} className="border-b">
                  <td className="p-2 font-medium">{t.name}</td>
                  <td className="p-2">{t.assigned}</td>
                  <td className="p-2">{t.retention}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductStats() {
  // TODO: 실제 데이터 fetch/가공
  const data = [
    { name: '헬스 1개월', sold: 80, revenue: 1600000 },
    { name: 'PT 10회', sold: 25, revenue: 2500000 },
  ]
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>상품별 판매</CardTitle>
        <Button size="sm" variant="outline" onClick={() => exportSectionToExcel('상품별 판매')}><Download className="w-4 h-4 mr-1" />엑셀로 내보내기</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">상품명</th>
                <th className="p-2">판매수</th>
                <th className="p-2">총 매출</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.name} className="border-b">
                  <td className="p-2 font-medium">{p.name}</td>
                  <td className="p-2">{p.sold}</td>
                  <td className="p-2">{p.revenue.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default function StatisticsPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => Promise.resolve({
      totalMembers: 210,
      newRegistrations: 12,
      monthlyRevenue: 32000000,
      conversionRate: 38.2,
    }),
  })

  const statCards = [
    {
      title: '전체 회원수',
      value: stats?.totalMembers || 0,
      description: '전월 대비 +12%',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: '신규 등록',
      value: stats?.newRegistrations || 0,
      description: '이번 달 신규 가입',
      icon: UserPlus,
      color: 'text-green-600',
    },
    {
      title: '월 매출',
      value: `${(stats?.monthlyRevenue || 0).toLocaleString()}원`,
      description: '전월 대비 +8%',
      icon: CreditCard,
      color: 'text-purple-600',
    },
    {
      title: '전환율',
      value: `${stats?.conversionRate || 0}%`,
      description: '상담 → 등록 전환율',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">통계</h1>
        <p className="text-gray-600 mt-2">센터 운영 현황을 한눈에 확인하세요</p>
      </div>
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">대시보드</TabsTrigger>
          <TabsTrigger value="branch">지점별 현황</TabsTrigger>
          <TabsTrigger value="trainer">트레이너별 실적</TabsTrigger>
          <TabsTrigger value="product">상품별 판매</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>매출 추이</CardTitle>
                <CardDescription>최근 12개월 매출 현황</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>최근 가입 회원</CardTitle>
                <CardDescription>최근 7일간 신규 등록 회원</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentCustomers />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="branch" className="space-y-4">
          <BranchStats />
        </TabsContent>
        <TabsContent value="trainer" className="space-y-4">
          <TrainerStats />
        </TabsContent>
        <TabsContent value="product" className="space-y-4">
          <ProductStats />
        </TabsContent>
      </Tabs>
    </div>
  )
}