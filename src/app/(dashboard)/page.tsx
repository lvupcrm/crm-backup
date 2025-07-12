'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">대시보드</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>총 고객 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">전체 등록 고객</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>상담 대기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">상담 예정 고객</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>이번 달 매출</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩0</div>
            <p className="text-xs text-muted-foreground">월간 매출</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>활성 제품</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">판매 중인 제품</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>빠른 액션</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => router.push('/customers/consultation')}
              className="w-full justify-start"
            >
              상담 고객 관리
            </Button>
            <Button 
              onClick={() => router.push('/customers/registered')}
              className="w-full justify-start"
            >
              등록 고객 관리
            </Button>
            <Button 
              onClick={() => router.push('/products')}
              className="w-full justify-start"
            >
              제품 관리
            </Button>
            <Button 
              onClick={() => router.push('/messages/templates')}
              className="w-full justify-start"
            >
              메시지 템플릿
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              아직 활동 내역이 없습니다.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
