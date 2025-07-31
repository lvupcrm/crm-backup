import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 통계 데이터 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'dashboard' | 'customers' | 'revenue' | 'messages'
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const branchId = searchParams.get('branchId');

    // 기본 날짜 범위 설정 (최근 30일)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    if (type === 'dashboard') {
      // 대시보드 기본 통계
      const [
        totalConsultationCustomers,
        totalRegisteredCustomers,
        newConsultationCustomers,
        newRegisteredCustomers,
        totalRevenue,
        recentRevenue,
        activeMemberships,
        expiringMemberships,
      ] = await Promise.all([
        // 전체 상담고객 수
        prisma.consultationCustomer.count({
          where: branchId ? { manager: { branchId } } : undefined,
        }),
        
        // 전체 등록회원 수
        prisma.registeredCustomer.count({
          where: branchId ? { branchId } : undefined,
        }),
        
        // 신규 상담고객 수 (기간)
        prisma.consultationCustomer.count({
          where: {
            createdAt: { gte: start, lte: end },
            ...(branchId && { manager: { branchId } }),
          },
        }),
        
        // 신규 등록회원 수 (기간)
        prisma.registeredCustomer.count({
          where: {
            joinDate: { gte: start, lte: end },
            ...(branchId && { branchId }),
          },
        }),
        
        // 전체 매출
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: branchId ? { customer: { branchId } } : undefined,
        }),
        
        // 기간별 매출
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            paymentDate: { gte: start, lte: end },
            ...(branchId && { customer: { branchId } }),
          },
        }),
        
        // 활성 회원 수
        prisma.registeredCustomer.count({
          where: {
            status: '활동',
            ...(branchId && { branchId }),
          },
        }),
        
        // 만료 예정 회원 수 (30일 이내)
        prisma.registeredCustomer.count({
          where: {
            membershipExpiry: {
              gte: new Date(),
              lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            status: '활동',
            ...(branchId && { branchId }),
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          customers: {
            totalConsultation: totalConsultationCustomers,
            totalRegistered: totalRegisteredCustomers,
            newConsultation: newConsultationCustomers,
            newRegistered: newRegisteredCustomers,
          },
          revenue: {
            total: totalRevenue._sum.amount || 0,
            recent: recentRevenue._sum.amount || 0,
          },
          memberships: {
            active: activeMemberships,
            expiring: expiringMemberships,
          },
        },
      });

    } else if (type === 'customers') {
      // 고객 관련 상세 통계
      const [
        consultationByStatus,
        registeredByStatus,
        consultationByChannel,
        monthlyNewCustomers,
      ] = await Promise.all([
        // 상담고객 상태별 분포
        prisma.consultationCustomer.groupBy({
          by: ['consultationStatus'],
          _count: true,
          where: branchId ? { manager: { branchId } } : undefined,
        }),
        
        // 등록회원 상태별 분포
        prisma.registeredCustomer.groupBy({
          by: ['status'],
          _count: true,
          where: branchId ? { branchId } : undefined,
        }),
        
        // 문의경로별 분포
        prisma.consultationCustomer.groupBy({
          by: ['inquiryChannel'],
          _count: true,
          where: {
            createdAt: { gte: start, lte: end },
            ...(branchId && { manager: { branchId } }),
          },
        }),
        
        // 월별 신규 고객 추이 (최근 6개월)
        prisma.$queryRaw`
          SELECT 
            DATE_TRUNC('month', "joinDate") as month,
            COUNT(*) as count
          FROM "RegisteredCustomer"
          WHERE "joinDate" >= ${new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)}
          ${branchId ? prisma.$queryRaw`AND "branchId" = ${branchId}` : prisma.$queryRaw``}
          GROUP BY DATE_TRUNC('month', "joinDate")
          ORDER BY month DESC
        `,
      ]);

      return NextResponse.json({
        success: true,
        data: {
          consultationByStatus,
          registeredByStatus,
          consultationByChannel,
          monthlyNewCustomers,
        },
      });

    } else if (type === 'revenue') {
      // 매출 관련 상세 통계
      const [
        monthlyRevenue,
        revenueByProduct,
        paymentMethods,
        topCustomers,
      ] = await Promise.all([
        // 월별 매출 추이 (최근 12개월)
        prisma.$queryRaw`
          SELECT 
            DATE_TRUNC('month', "paymentDate") as month,
            SUM(amount) as revenue,
            COUNT(*) as transactions
          FROM "Payment" p
          JOIN "RegisteredCustomer" c ON p."customerId" = c.id
          WHERE "paymentDate" >= ${new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000)}
          ${branchId ? prisma.$queryRaw`AND c."branchId" = ${branchId}` : prisma.$queryRaw``}
          GROUP BY DATE_TRUNC('month', "paymentDate")
          ORDER BY month DESC
        `,
        
        // 상품별 매출
        prisma.payment.groupBy({
          by: ['productId'],
          _sum: { amount: true },
          _count: true,
          where: {
            paymentDate: { gte: start, lte: end },
            ...(branchId && { customer: { branchId } }),
          },
          orderBy: { _sum: { amount: 'desc' } },
          take: 10,
        }),
        
        // 결제수단별 분포
        prisma.payment.groupBy({
          by: ['paymentMethod'],
          _sum: { amount: true },
          _count: true,
          where: {
            paymentDate: { gte: start, lte: end },
            ...(branchId && { customer: { branchId } }),
          },
        }),
        
        // 고액 결제 고객 TOP 10
        prisma.payment.groupBy({
          by: ['customerId'],
          _sum: { amount: true },
          where: {
            paymentDate: { gte: start, lte: end },
            ...(branchId && { customer: { branchId } }),
          },
          orderBy: { _sum: { amount: 'desc' } },
          take: 10,
        }),
      ]);

      // 상품 정보와 고객 정보 추가로 조회
      const [productsInfo, customersInfo] = await Promise.all([
        prisma.product.findMany({
          where: {
            id: { in: revenueByProduct.map(p => p.productId) },
          },
          select: { id: true, productName: true },
        }),
        prisma.registeredCustomer.findMany({
          where: {
            id: { in: topCustomers.map(c => c.customerId) },
          },
          select: { id: true, name: true, phone: true },
        }),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          monthlyRevenue,
          revenueByProduct: revenueByProduct.map(p => ({
            ...p,
            product: productsInfo.find(prod => prod.id === p.productId),
          })),
          paymentMethods,
          topCustomers: topCustomers.map(c => ({
            ...c,
            customer: customersInfo.find(cust => cust.id === c.customerId),
          })),
        },
      });

    } else if (type === 'messages') {
      // 메시지 관련 통계
      const [
        templateStats,
        campaignStats,
        messageStats,
        monthlyMessageStats,
      ] = await Promise.all([
        // 템플릿 상태별 분포
        prisma.messageTemplate.groupBy({
          by: ['status'],
          _count: true,
        }),
        
        // 활성 캠페인 수
        prisma.campaign.count({
          where: { isActive: true },
        }),
        
        // 메시지 발송 상태별 분포
        prisma.scheduledMessage.groupBy({
          by: ['sendStatus'],
          _count: true,
          where: {
            createdAt: { gte: start, lte: end },
          },
        }),
        
        // 월별 메시지 발송 추이
        prisma.$queryRaw`
          SELECT 
            DATE_TRUNC('month', "scheduledAt") as month,
            COUNT(*) as count,
            COUNT(CASE WHEN "sendStatus" = '성공' THEN 1 END) as success,
            COUNT(CASE WHEN "sendStatus" = '실패' THEN 1 END) as failed
          FROM "ScheduledMessage"
          WHERE "scheduledAt" >= ${new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)}
          GROUP BY DATE_TRUNC('month', "scheduledAt")
          ORDER BY month DESC
        `,
      ]);

      return NextResponse.json({
        success: true,
        data: {
          templates: templateStats,
          activeCampaigns: campaignStats,
          messages: messageStats,
          monthlyMessages: monthlyMessageStats,
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: '올바른 타입을 지정해주세요 (dashboard | customers | revenue | messages)',
    }, { status: 400 });

  } catch (error) {
    console.error('통계 데이터 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: '통계 데이터를 불러오는데 실패했습니다',
    }, { status: 500 });
  }
}