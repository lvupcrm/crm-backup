import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiMonitor } from '@/lib/api-monitor';

export async function GET(_request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // 데이터베이스 연결 확인
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - dbStart;

    // 시스템 메모리 정보
    const memoryUsage = process.memoryUsage();
    
    // CPU 사용률 (간단한 측정)
    const cpuStart = process.cpuUsage();
    await new Promise(resolve => setTimeout(resolve, 100));
    const cpuEnd = process.cpuUsage(cpuStart);
    const cpuPercent = (cpuEnd.user + cpuEnd.system) / 1000 / 100; // 대략적인 CPU 사용률

    // API 성능 통계
    const apiStats = apiMonitor.getStats();
    const alerts = apiMonitor.checkAlerts();

    // 응답 시간 계산
    const responseTime = Date.now() - startTime;

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime,
      
      // 데이터베이스 상태
      database: {
        status: 'connected',
        latency: dbLatency,
      },
      
      // 시스템 리소스
      system: {
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100, // MB
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100, // MB
          usage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
          rss: Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100, // MB
        },
        cpu: {
          usage: Math.round(cpuPercent * 100) / 100,
        },
      },
      
      // API 성능 통계
      api: apiStats ? {
        totalRequests: apiStats.totalRequests,
        avgResponseTime: apiStats.avgDuration,
        errorRate: apiStats.errorRate,
        p95ResponseTime: apiStats.p95Duration,
      } : null,
      
      // 경고/알림
      alerts: alerts.map(alert => ({
        type: alert.type,
        message: alert.message,
        severity: alert.severity,
      })),
      
      // 추가 메트릭
      metrics: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        environment: process.env.NODE_ENV,
      },
    };

    // 상태 판단
    let overallStatus = 'healthy';
    if (dbLatency > 1000 || cpuPercent > 80 || (memoryUsage.heapUsed / memoryUsage.heapTotal) > 0.9) {
      overallStatus = 'degraded';
    }
    if (alerts.some(alert => alert.severity === 'critical')) {
      overallStatus = 'unhealthy';
    }

    healthData.status = overallStatus;

    return NextResponse.json({
      success: true,
      data: healthData,
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      success: false,
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    }, { status: 503 });
  }
}