import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateProductSchema = z.object({
  productName: z.string().min(1, '상품명은 필수입니다').optional(),
  description: z.string().optional(),
  price: z.number().min(0, '가격은 0 이상이어야 합니다').optional(),
  validityPeriod: z.number().min(1, '유효기간은 1일 이상이어야 합니다').optional(),
  branchId: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET: 개별 상품 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        branch: {
          select: { id: true, name: true },
        },
        payments: {
          include: {
            customer: {
              select: { id: true, name: true, phone: true },
            },
          },
          orderBy: { paymentDate: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({
        success: false,
        error: '상품을 찾을 수 없습니다',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error('상품 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: '상품 정보를 불러오는데 실패했습니다',
    }, { status: 500 });
  }
}

// PUT: 상품 정보 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);

    const product = await prisma.product.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        branch: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: '상품 정보가 성공적으로 수정되었습니다',
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: '입력 데이터가 올바르지 않습니다',
        details: error.errors,
      }, { status: 400 });
    }

    console.error('상품 수정 오류:', error);
    return NextResponse.json({
      success: false,
      error: '상품 정보 수정에 실패했습니다',
    }, { status: 500 });
  }
}

// DELETE: 상품 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 결제 내역이 있는 경우 삭제 제한
    const paymentCount = await prisma.payment.count({
      where: { productId: params.id },
    });

    if (paymentCount > 0) {
      return NextResponse.json({
        success: false,
        error: '결제 내역이 있는 상품은 삭제할 수 없습니다. 비활성화를 권장합니다.',
      }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: '상품이 삭제되었습니다',
    });

  } catch (error) {
    console.error('상품 삭제 오류:', error);
    return NextResponse.json({
      success: false,
      error: '상품 삭제에 실패했습니다',
    }, { status: 500 });
  }
}