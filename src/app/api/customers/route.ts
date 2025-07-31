import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 상담고객 생성 스키마
const consultationCustomerSchema = z.object({
  name: z.string().min(1, '이름은 필수입니다'),
  phone: z.string().min(10, '올바른 전화번호를 입력해주세요'),
  appointmentDate: z.string().refine((date) => !isNaN(Date.parse(date)), '올바른 날짜를 입력해주세요'),
  inquiryChannel: z.string().min(1, '문의경로는 필수입니다'),
  sport: z.string().min(1, '종목은 필수입니다'),
  appointmentPurpose: z.string().min(1, '예약목적은 필수입니다'),
  consultationStatus: z.string().default('미상담'),
  registrationStatus: z.string().default('미등록'),
  managerId: z.string().optional(),
  memo: z.string().optional(),
});

// 등록회원 생성 스키마
const registeredCustomerSchema = z.object({
  name: z.string().min(1, '이름은 필수입니다'),
  phone: z.string().min(10, '올바른 전화번호를 입력해주세요'),
  joinDate: z.string().refine((date) => !isNaN(Date.parse(date)), '올바른 날짜를 입력해주세요'),
  membershipType: z.string().min(1, '멤버십 타입은 필수입니다'),
  membershipExpiry: z.string().refine((date) => !isNaN(Date.parse(date)), '올바른 날짜를 입력해주세요'),
  trainerId: z.string().optional(),
  branchId: z.string().min(1, '지점은 필수입니다'),
  status: z.string().default('활동'),
  memo: z.string().optional(),
});

// GET: 고객 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'consultation' | 'registered'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    if (type === 'consultation') {
      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { phone: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      const [customers, total] = await Promise.all([
        prisma.consultationCustomer.findMany({
          where,
          skip,
          take: limit,
          include: {
            manager: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.consultationCustomer.count({ where }),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          customers,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } else if (type === 'registered') {
      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { phone: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      const [customers, total] = await Promise.all([
        prisma.registeredCustomer.findMany({
          where,
          skip,
          take: limit,
          include: {
            trainer: {
              select: { id: true, name: true },
            },
            branch: {
              select: { id: true, name: true },
            },
            payments: {
              orderBy: { paymentDate: 'desc' },
              take: 1,
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.registeredCustomer.count({ where }),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          customers,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: '올바른 타입을 지정해주세요 (consultation | registered)',
    }, { status: 400 });

  } catch (error) {
    console.error('고객 목록 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: '고객 목록을 불러오는데 실패했습니다',
    }, { status: 500 });
  }
}

// POST: 고객 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...customerData } = body;

    if (type === 'consultation') {
      const validatedData = consultationCustomerSchema.parse(customerData);
      
      const customer = await prisma.consultationCustomer.create({
        data: {
          ...validatedData,
          appointmentDate: new Date(validatedData.appointmentDate),
        },
        include: {
          manager: {
            select: { id: true, name: true },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: customer,
        message: '상담고객이 성공적으로 등록되었습니다',
      });

    } else if (type === 'registered') {
      const validatedData = registeredCustomerSchema.parse(customerData);
      
      const customer = await prisma.registeredCustomer.create({
        data: {
          ...validatedData,
          joinDate: new Date(validatedData.joinDate),
          membershipExpiry: new Date(validatedData.membershipExpiry),
        },
        include: {
          trainer: {
            select: { id: true, name: true },
          },
          branch: {
            select: { id: true, name: true },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: customer,
        message: '등록회원이 성공적으로 등록되었습니다',
      });
    }

    return NextResponse.json({
      success: false,
      error: '올바른 타입을 지정해주세요 (consultation | registered)',
    }, { status: 400 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: '입력 데이터가 올바르지 않습니다',
        details: error.errors,
      }, { status: 400 });
    }

    console.error('고객 생성 오류:', error);
    return NextResponse.json({
      success: false,
      error: '고객 등록에 실패했습니다',
    }, { status: 500 });
  }
}