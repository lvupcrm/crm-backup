import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 메시지 템플릿 생성 스키마
const messageTemplateSchema = z.object({
  templateName: z.string().min(1, '템플릿명은 필수입니다'),
  channel: z.enum(['알림톡', 'SMS'], { required_error: '채널은 필수입니다' }),
  templateCode: z.string().optional(),
  content: z.string().min(1, '메시지 내용은 필수입니다'),
  variables: z.array(z.string()).default([]),
  status: z.string().default('승인대기'),
});

// 캠페인 생성 스키마
const campaignSchema = z.object({
  campaignName: z.string().min(1, '캠페인명은 필수입니다'),
  description: z.string().optional(),
  sendCondition: z.string().min(1, '발송조건은 필수입니다'),
  templateId: z.string().min(1, '템플릿은 필수입니다'),
  isActive: z.boolean().default(true),
});

// 일정 메시지 생성 스키마
const scheduledMessageSchema = z.object({
  recipientPhone: z.string().min(10, '올바른 전화번호를 입력해주세요'),
  templateId: z.string().min(1, '템플릿은 필수입니다'),
  scheduledAt: z.string().refine((date) => !isNaN(Date.parse(date)), '올바른 날짜를 입력해주세요'),
  sendStatus: z.string().default('대기'),
});

// GET: 메시지 관련 데이터 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'templates' | 'campaigns' | 'scheduled' | 'logs'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    if (type === 'templates') {
      const where = search
        ? {
            OR: [
              { templateName: { contains: search, mode: 'insensitive' as const } },
              { content: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      const [templates, total] = await Promise.all([
        prisma.messageTemplate.findMany({
          where,
          skip,
          take: limit,
          include: {
            _count: {
              select: { campaigns: true, scheduledMessages: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.messageTemplate.count({ where }),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          templates,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });

    } else if (type === 'campaigns') {
      const where = search
        ? {
            OR: [
              { campaignName: { contains: search, mode: 'insensitive' as const } },
              { description: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      const [campaigns, total] = await Promise.all([
        prisma.campaign.findMany({
          where,
          skip,
          take: limit,
          include: {
            template: {
              select: { id: true, templateName: true, channel: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.campaign.count({ where }),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          campaigns,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });

    } else if (type === 'scheduled') {
      const where = search
        ? {
            recipientPhone: { contains: search, mode: 'insensitive' as const },
          }
        : {};

      const [scheduledMessages, total] = await Promise.all([
        prisma.scheduledMessage.findMany({
          where,
          skip,
          take: limit,
          include: {
            template: {
              select: { id: true, templateName: true, channel: true },
            },
          },
          orderBy: { scheduledAt: 'desc' },
        }),
        prisma.scheduledMessage.count({ where }),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          scheduledMessages,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });

    } else if (type === 'logs') {
      // 발송 로그 조회 (scheduledMessage에서 발송완료/실패된 것들)
      const where = {
        sendStatus: { in: ['성공', '실패'] },
        ...(search && {
          recipientPhone: { contains: search, mode: 'insensitive' as const },
        }),
      };

      const [logs, total] = await Promise.all([
        prisma.scheduledMessage.findMany({
          where,
          skip,
          take: limit,
          include: {
            template: {
              select: { id: true, templateName: true, channel: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.scheduledMessage.count({ where }),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          logs,
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
      error: '올바른 타입을 지정해주세요 (templates | campaigns | scheduled | logs)',
    }, { status: 400 });

  } catch (error) {
    console.error('메시지 데이터 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: '데이터를 불러오는데 실패했습니다',
    }, { status: 500 });
  }
}

// POST: 메시지 관련 데이터 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'template') {
      const validatedData = messageTemplateSchema.parse(data);
      
      const template = await prisma.messageTemplate.create({
        data: validatedData,
      });

      return NextResponse.json({
        success: true,
        data: template,
        message: '메시지 템플릿이 성공적으로 등록되었습니다',
      });

    } else if (type === 'campaign') {
      const validatedData = campaignSchema.parse(data);
      
      const campaign = await prisma.campaign.create({
        data: validatedData,
        include: {
          template: {
            select: { id: true, templateName: true, channel: true },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: campaign,
        message: '캠페인이 성공적으로 등록되었습니다',
      });

    } else if (type === 'scheduled') {
      const validatedData = scheduledMessageSchema.parse(data);
      
      const scheduledMessage = await prisma.scheduledMessage.create({
        data: {
          ...validatedData,
          scheduledAt: new Date(validatedData.scheduledAt),
        },
        include: {
          template: {
            select: { id: true, templateName: true, channel: true },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: scheduledMessage,
        message: '메시지가 성공적으로 예약되었습니다',
      });
    }

    return NextResponse.json({
      success: false,
      error: '올바른 타입을 지정해주세요 (template | campaign | scheduled)',
    }, { status: 400 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: '입력 데이터가 올바르지 않습니다',
        details: error.errors,
      }, { status: 400 });
    }

    console.error('메시지 데이터 생성 오류:', error);
    return NextResponse.json({
      success: false,
      error: '데이터 등록에 실패했습니다',
    }, { status: 500 });
  }
}