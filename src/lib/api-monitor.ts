import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

interface PerformanceMetrics {
  route: string;
  method: string;
  duration: number;
  status: number;
  timestamp: string;
  memoryUsage?: NodeJS.MemoryUsage;
}

class APIMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 1000; // 메모리 사용량 제한

  // API 호출 모니터링 래퍼
  withMonitoring(
    handler: (req: NextRequest) => Promise<NextResponse>
  ) {
    return async (req: NextRequest): Promise<NextResponse> => {
      const startTime = Date.now();
      const startMemory = process.memoryUsage();
      
      try {
        // 요청 로깅
        logger.apiRequest(req);

        // 실제 핸들러 실행
        const response = await handler(req);
        const duration = Date.now() - startTime;
        const endMemory = process.memoryUsage();

        // 성능 메트릭 수집
        this.recordMetric({
          route: new URL(req.url).pathname,
          method: req.method,
          duration,
          status: response.status,
          timestamp: new Date().toISOString(),
          memoryUsage: {
            rss: endMemory.rss - startMemory.rss,
            heapUsed: endMemory.heapUsed - startMemory.heapUsed,
            heapTotal: endMemory.heapTotal - startMemory.heapTotal,
            external: endMemory.external - startMemory.external,
            arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers,
          }
        });

        // 응답 로깅
        logger.apiResponse(req.method, req.url, response.status, duration);

        // 성능 경고
        if (duration > 2000) {
          logger.warn(`Slow API response: ${req.method} ${req.url}`, {
            duration,
            status: response.status,
          });
        }

        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        
        // 에러 로깅
        logger.apiError(req, error as Error);

        // 에러 메트릭 기록
        this.recordMetric({
          route: new URL(req.url).pathname,
          method: req.method,
          duration,
          status: 500,
          timestamp: new Date().toISOString(),
        });

        // 에러 응답 반환
        return NextResponse.json(
          { 
            success: false, 
            error: process.env.NODE_ENV === 'development' 
              ? (error as Error).message 
              : '서버 오류가 발생했습니다' 
          },
          { status: 500 }
        );
      }
    };
  }

  private recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // 메트릭 개수 제한 (메모리 누수 방지)
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  // 메트릭 조회
  getMetrics(route?: string, method?: string, limit: number = 100): PerformanceMetrics[] {
    let filtered = this.metrics;

    if (route) {
      filtered = filtered.filter(m => m.route === route);
    }

    if (method) {
      filtered = filtered.filter(m => m.method === method);
    }

    return filtered.slice(-limit);
  }

  // 성능 통계 계산
  getStats(route?: string, method?: string) {
    const metrics = this.getMetrics(route, method, this.maxMetrics);
    
    if (metrics.length === 0) {
      return null;
    }

    const durations = metrics.map(m => m.duration);
    const statuses = metrics.map(m => m.status);

    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);
    
    // P95 계산
    const sortedDurations = durations.sort((a, b) => a - b);
    const p95Index = Math.floor(sortedDurations.length * 0.95);
    const p95Duration = sortedDurations[p95Index] || 0;

    // 에러율 계산
    const errorCount = statuses.filter(s => s >= 400).length;
    const errorRate = (errorCount / metrics.length) * 100;

    return {
      totalRequests: metrics.length,
      avgDuration: Math.round(avgDuration),
      maxDuration,
      minDuration,
      p95Duration,
      errorRate: Math.round(errorRate * 100) / 100,
      errorCount,
      timeRange: {
        start: metrics[0]?.timestamp,
        end: metrics[metrics.length - 1]?.timestamp,
      }
    };
  }

  // 알람 조건 체크
  checkAlerts(): Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' | 'critical' }> {
    const alerts: Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' | 'critical' }> = [];
    const recentMetrics = this.getMetrics(undefined, undefined, 100);
    
    if (recentMetrics.length < 10) return alerts; // 충분한 데이터가 없으면 스킵

    // 최근 5분간 에러율 체크
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const recentErrors = recentMetrics.filter(m => 
      new Date(m.timestamp).getTime() > fiveMinutesAgo && m.status >= 400
    );
    const recentTotal = recentMetrics.filter(m => 
      new Date(m.timestamp).getTime() > fiveMinutesAgo
    );
    
    if (recentTotal.length > 0) {
      const errorRate = (recentErrors.length / recentTotal.length) * 100;
      
      if (errorRate > 20) {
        alerts.push({
          type: 'high_error_rate',
          message: `높은 에러율 감지: ${errorRate.toFixed(1)}% (최근 5분)`,
          severity: 'critical'
        });
      } else if (errorRate > 10) {
        alerts.push({
          type: 'moderate_error_rate',
          message: `에러율 증가: ${errorRate.toFixed(1)}% (최근 5분)`,
          severity: 'high'
        });
      }
    }

    // 응답 시간 체크
    const recentDurations = recentTotal.map(m => m.duration);
    const avgDuration = recentDurations.reduce((a, b) => a + b, 0) / recentDurations.length;
    
    if (avgDuration > 3000) {
      alerts.push({
        type: 'slow_response',
        message: `평균 응답 시간 증가: ${avgDuration.toFixed(0)}ms (최근 5분)`,
        severity: 'high'
      });
    } else if (avgDuration > 2000) {
      alerts.push({
        type: 'moderate_slow_response',
        message: `응답 시간 주의: ${avgDuration.toFixed(0)}ms (최근 5분)`,
        severity: 'medium'
      });
    }

    return alerts;
  }

  // 메트릭 리셋
  clearMetrics(): void {
    this.metrics = [];
    logger.info('API metrics cleared');
  }
}

export const apiMonitor = new APIMonitor();