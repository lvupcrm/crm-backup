import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 상담고객 수정 스키마
const updateConsultationCustomerSchema = z.object({
  name: z.string().min(1, '이름은 필수입니다').optional(),
  phone: z.string().min(10, '올바른 전화번호를 입력해주세요').optional(),
  appointmentDate: z.string().refine((date) => !isNaN(Date.parse(date)), '올바른 날짜를 입력해주세요').optional(),
  inquiryChannel: z.string().min(1, '문의경로는 필수입니다').optional(),
  sport: z.string().min(1, '종목은 필수입니다').optional(),
  appointmentPurpose: z.string().min(1, '예약목적은 필수입니다').optional(),
  consultationStatus: z.string().optional(),
  registrationStatus: z.string().optional(),
  managerId: z.string().optional(),
  memo: z.string().optional(),
});

// 등록회원 수정 스키마
const updateRegisteredCustomerSchema = z.object({
  name: z.string().min(1, '이름은 필수입니다').optional(),
  phone: z.string().min(10, '올바른 전화번호를 입력해주세요').optional(),
  joinDate: z.string().refine((date) => !isNaN(Date.parse(date)), '올바른 날짜를 입력해주세요').optional(),
  membershipType: z.string().min(1, '멤버십 타입은 필수입니다').optional(),
  membershipExpiry: z.string().refine((date) => !isNaN(Date.parse(date)), '올바른 날짜를 입력해주세요').optional(),
  trainerId: z.string().optional(),
  branchId: z.string().min(1, '지점은 필수입니다').optional(),
  status: z.string().optional(),
  memo: z.string().optional(),
});

// GET: 개별 고객 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'consultation' | 'registered'

    if (type === 'consultation') {
      const customer = await prisma.consultationCustomer.findUnique({
        where: { id: params.id },
        include: {
          manager: {
            select: { id: true, name: true },
          },
        },
      });

      if (!customer) {
        return NextResponse.json({
          success: false,
          error: '고객을 찾을 수 없습니다',
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: customer,
      });

    } else if (type === 'registered') {
      const customer = await prisma.registeredCustomer.findUnique({
        where: { id: params.id },
        include: {
          trainer: {
            select: { id: true, name: true },
          },
          branch: {
            select: { id: true, name: true },
          },
          payments: {
            include: {
              product: {
                select: { id: true, productName: true },
              },
            },
            orderBy: { paymentDate: 'desc' },
          },
        },
      });

      if (!customer) {
        return NextResponse.json({
          success: false,
          error: '고객을 찾을 수 없습니다',
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: customer,
      });
    }

    return NextResponse.json({
      success: false,
      error: '올바른 타입을 지정해주세요 (consultation | registered)',
    }, { status: 400 });

  } catch (error) {
    console.error('고객 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: '고객 정보를 불러오는데 실패했습니다',
    }, { status: 500 });
  }
}

// PUT: 고객 정보 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { type, ...customerData } = body;

    if (type === 'consultation') {
      const validatedData = updateConsultationCustomerSchema.parse(customerData);
      
      const updateData: any = { ...validatedData };
      if (validatedData.appointmentDate) {
        updateData.appointmentDate = new Date(validatedData.appointmentDate);
      }

      const customer = await prisma.consultationCustomer.update({
        where: { id: params.id },
        data: updateData,
        include: {
          manager: {
            select: { id: true, name: true },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: customer,
        message: '상담고객 정보가 성공적으로 수정되었습니다',
      });

    } else if (type === 'registered') {
      const validatedData = updateRegisteredCustomerSchema.parse(customerData);
      
      const updateData: any = { ...validatedData };
      if (validatedData.joinDate) {
        updateData.joinDate = new Date(validatedData.joinDate);
      }
      if (validatedData.membershipExpiry) {
        updateData.membershipExpiry = new Date(validatedData.membershipExpiry);
      }

      const customer = await prisma.registeredCustomer.update({
        where: { id: params.id },
        data: updateData,
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
        message: '등록회원 정보가 성공적으로 수정되었습니다',
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

    console.error('고객 수정 오류:', error);
    return NextResponse.json({
      success: false,
      error: '고객 정보 수정에 실패했습니다',
    }, { status: 500 });
  }
}

// DELETE: 고객 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'consultation' | 'registered'

    if (type === 'consultation') {
      await prisma.consultationCustomer.delete({
        where: { id: params.id },
      });

      return NextResponse.json({
        success: true,
        message: '상담고객이 삭제되었습니다',
      });

    } else if (type === 'registered') {
      // 결제 내역이 있는 경우 삭제 제한
      const paymentCount = await prisma.payment.count({
        where: { customerId: params.id },
      });

      if (paymentCount > 0) {
        return NextResponse.json({
          success: false,
          error: '결제 내역이 있는 고객은 삭제할 수 없습니다',
        }, { status: 400 });
      }

      await prisma.registeredCustomer.delete({
        where: { id: params.id },
      });

      return NextResponse.json({
        success: true,
        message: '등록회원이 삭제되었습니다',
      });
    }

    return NextResponse.json({
      success: false,
      error: '올바른 타입을 지정해주세요 (consultation | registered)',
    }, { status: 400 });

  } catch (error) {
    console.error('고객 삭제 오류:', error);
    return NextResponse.json({
      success: false,
      error: '고객 삭제에 실패했습니다',
    }, { status: 500 });
  }
}