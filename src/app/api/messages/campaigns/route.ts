import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { campaignSchema } from '@/lib/schemas';
import { getServerSession } from 'next-auth';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const where: Record<string, unknown> = {};
    if (isActive !== null) where.isActive = isActive === 'true';

    const campaigns = await prisma.campaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        template: {
          select: {
            templateName: true,
            channel: true,
            status: true
          }
        },
        _count: {
          select: { template: { select: { scheduledMessages: true } } }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: campaigns
    });
  } catch (error) {
    console.error('Campaign fetch error:', error);
    return NextResponse.json(
      { success: false, error: '캠페인 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = campaignSchema.parse(body);

    // 템플릿 유효성 검증
    const template = await prisma.messageTemplate.findUnique({
      where: { id: validatedData.templateId }
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 템플릿입니다' },
        { status: 404 }
      );
    }

    if (template.status !== '승인완료') {
      return NextResponse.json(
        { success: false, error: '승인된 템플릿만 캠페인에 사용할 수 있습니다' },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: validatedData,
      include: {
        template: {
          select: {
            templateName: true,
            channel: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: campaign
    }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 데이터입니다', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { success: false, error: '캠페인 생성에 실패했습니다' },
      { status: 500 }
    );
  }
}