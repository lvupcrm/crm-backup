import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 상품 생성/수정 스키마
const productSchema = z.object({
  productName: z.string().min(1, '상품명은 필수입니다'),
  description: z.string().optional(),
  price: z.number().min(0, '가격은 0 이상이어야 합니다'),
  validityPeriod: z.number().min(1, '유효기간은 1일 이상이어야 합니다'),
  branchId: z.string().optional(),
  isActive: z.boolean().default(true),
});

// GET: 상품 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const branchId = searchParams.get('branchId');
    const isActive = searchParams.get('isActive');

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    if (branchId) {
      where.branchId = branchId;
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          branch: {
            select: { id: true, name: true },
          },
          _count: {
            select: { payments: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });

  } catch (error) {
    console.error('상품 목록 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: '상품 목록을 불러오는데 실패했습니다',
    }, { status: 500 });
  }
}

// POST: 상품 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = productSchema.parse(body);

    const product = await prisma.product.create({
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
      message: '상품이 성공적으로 등록되었습니다',
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: '입력 데이터가 올바르지 않습니다',
        details: error.errors,
      }, { status: 400 });
    }

    console.error('상품 생성 오류:', error);
    return NextResponse.json({
      success: false,
      error: '상품 등록에 실패했습니다',
    }, { status: 500 });
  }
}