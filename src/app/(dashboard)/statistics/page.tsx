'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Overview } from '@/components/dashboard/Overview'
import { RecentCustomers } from '@/components/dashboard/RecentCustomers'
import { api } from '@/lib/api/client'
import { Users, UserPlus, CreditCard, TrendingUp } from 'lucide-react'

export default function StatisticsPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api.getDashboardStats,
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
        <h1 className="text-3xl font-bold text-gray-800">통계 대시보드</h1>
        <p className="text-gray-600 mt-2">센터 운영 현황을 한눈에 확인하세요</p>
      </div>

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

      <Tabs defaultValue="branch" className="space-y-4">
        <TabsList>
          <TabsTrigger value="branch">지점별 현황</TabsTrigger>
          <TabsTrigger value="trainer">트레이너별 실적</TabsTrigger>
          <TabsTrigger value="product">상품별 판매</TabsTrigger>
        </TabsList>
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