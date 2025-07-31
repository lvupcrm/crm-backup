import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { apiMonitor } from '@/lib/api-monitor';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다' }, { status: 401 });
    }

    // 관리자 권한 확인 (실제 구현에서는 세션에서 권한 확인)
    // if (session.user.role !== '관리자') {
    //   return NextResponse.json({ success: false, error: '권한이 없습니다' }, { status: 403 });
    // }

    const { searchParams } = new URL(request.url);
    const route = searchParams.get('route');
    const method = searchParams.get('method');
    const limit = parseInt(searchParams.get('limit') || '100');

    // API 메트릭 조회
    const metrics = apiMonitor.getMetrics(route || undefined, method || undefined, limit);
    const stats = apiMonitor.getStats(route || undefined, method || undefined);
    const alerts = apiMonitor.checkAlerts();

    // 최근 1시간 동안의 트렌드 데이터
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentMetrics = metrics.filter(m => 
      new Date(m.timestamp).getTime() > oneHourAgo
    );

    // 시간대별 요청 수 집계 (5분 단위)
    const timeSlots = new Map<string, { requests: number; errors: number; avgDuration: number }>();
    
    recentMetrics.forEach(metric => {
      const timeSlot = new Date(metric.timestamp);
      timeSlot.setMinutes(Math.floor(timeSlot.getMinutes() / 5) * 5, 0, 0); // 5분 단위로 반올림
      const key = timeSlot.toISOString();
      
      const existing = timeSlots.get(key) || { requests: 0, errors: 0, avgDuration: 0 };
      existing.requests++;
      if (metric.status >= 400) existing.errors++;
      existing.avgDuration = (existing.avgDuration * (existing.requests - 1) + metric.duration) / existing.requests;
      
      timeSlots.set(key, existing);
    });

    // 라우트별 통계
    const routeStats = new Map<string, { requests: number; errors: number; avgDuration: number }>();
    
    recentMetrics.forEach(metric => {
      const existing = routeStats.get(metric.route) || { requests: 0, errors: 0, avgDuration: 0 };
      existing.requests++;
      if (metric.status >= 400) existing.errors++;
      existing.avgDuration = (existing.avgDuration * (existing.requests - 1) + metric.duration) / existing.requests;
      
      routeStats.set(metric.route, existing);
    });

    // 상위 5개 라우트
    const topRoutes = Array.from(routeStats.entries())
      .sort((a, b) => b[1].requests - a[1].requests)
      .slice(0, 5)
      .map(([route, stats]) => ({
        route,
        requests: stats.requests,
        errors: stats.errors,
        errorRate: Math.round((stats.errors / stats.requests) * 100 * 100) / 100,
        avgDuration: Math.round(stats.avgDuration),
      }));

    // 느린 요청 상위 10개
    const slowRequests = recentMetrics
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10)
      .map(metric => ({
        route: metric.route,
        method: metric.method,
        duration: metric.duration,
        status: metric.status,
        timestamp: metric.timestamp,
      }));

    return NextResponse.json({
      success: true,
      data: {
        // 전체 통계
        overview: stats,
        
        // 알림
        alerts,
        
        // 시계열 데이터 (차트용)
        timeSeries: Array.from(timeSlots.entries())
          .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
          .map(([timestamp, data]) => ({
            timestamp,
            requests: data.requests,
            errors: data.errors,
            errorRate: Math.round((data.errors / data.requests) * 100 * 100) / 100,
            avgDuration: Math.round(data.avgDuration),
          })),
        
        // 라우트 통계
        topRoutes,
        
        // 성능 이슈
        slowRequests,
        
        // 메타데이터
        metadata: {
          totalMetrics: metrics.length,
          timeRange: {
            start: recentMetrics[0]?.timestamp,
            end: recentMetrics[recentMetrics.length - 1]?.timestamp,
          },
          filters: {
            route: route || 'all',
            method: method || 'all',
            limit,
          },
        },
      },
    });

  } catch (error) {
    console.error('Metrics fetch error:', error);
    return NextResponse.json(
      { success: false, error: '메트릭 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}