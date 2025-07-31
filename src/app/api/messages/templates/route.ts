import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { messageTemplateSchema } from '@/lib/schemas';
import { getServerSession } from 'next-auth';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const channel = searchParams.get('channel');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (channel) where.channel = channel;

    const templates = await prisma.messageTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { campaigns: true, scheduledMessages: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Template fetch error:', error);
    return NextResponse.json(
      { success: false, error: '템플릿 조회에 실패했습니다' },
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
    const validatedData = messageTemplateSchema.parse(body);

    const template = await prisma.messageTemplate.create({
      data: {
        ...validatedData,
        status: '승인대기'
      }
    });

    return NextResponse.json({
      success: true,
      data: template
    }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 데이터입니다', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Template creation error:', error);
    return NextResponse.json(
      { success: false, error: '템플릿 생성에 실패했습니다' },
      { status: 500 }
    );
  }
}