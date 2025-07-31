import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/customers/route';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    consultationCustomer: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    registeredCustomer: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock NextAuth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('/api/customers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('상담 고객 목록을 정상적으로 반환한다', async () => {
      const mockCustomers = [
        {
          id: '1',
          name: '김철수',
          phone: '010-1234-5678',
          createdAt: new Date(),
        },
      ];

      mockPrisma.consultationCustomer.findMany.mockResolvedValue(mockCustomers);
      mockPrisma.consultationCustomer.count.mockResolvedValue(1);

      const request = new NextRequest('http://localhost/api/customers?type=consultation');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].name).toBe('김철수');
    });

    it('등록 고객 목록을 정상적으로 반환한다', async () => {
      const mockCustomers = [
        {
          id: '1',
          name: '이영희',
          phone: '010-9876-5432',
          createdAt: new Date(),
        },
      ];

      mockPrisma.registeredCustomer.findMany.mockResolvedValue(mockCustomers);
      mockPrisma.registeredCustomer.count.mockResolvedValue(1);

      const request = new NextRequest('http://localhost/api/customers?type=registered');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].name).toBe('이영희');
    });

    it('검색 조건이 적용된다', async () => {
      const request = new NextRequest('http://localhost/api/customers?type=consultation&search=김철수');
      await GET(request);

      expect(mockPrisma.consultationCustomer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { name: { contains: '김철수' } },
              { phone: { contains: '김철수' } },
            ]),
          }),
        })
      );
    });

    it('페이지네이션이 올바르게 적용된다', async () => {
      const request = new NextRequest('http://localhost/api/customers?type=consultation&page=2&limit=10');
      await GET(request);

      expect(mockPrisma.consultationCustomer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      );
    });
  });

  describe('POST', () => {
    it('상담 고객을 정상적으로 생성한다', async () => {
      const newCustomer = {
        name: '홍길동',
        phone: '010-1111-2222',
        desiredService: '개인 트레이닝',
        consultationDate: '2024-01-15',
        notes: '상담 내용',
      };

      const createdCustomer = {
        id: '1',
        ...newCustomer,
        createdAt: new Date(),
      };

      mockPrisma.consultationCustomer.create.mockResolvedValue(createdCustomer);

      const request = new NextRequest('http://localhost/api/customers', {
        method: 'POST',
        body: JSON.stringify({ type: 'consultation', ...newCustomer }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('홍길동');
    });

    it('잘못된 데이터로 생성 시 오류를 반환한다', async () => {
      const invalidData = {
        name: '', // 빈 이름
        phone: 'invalid-phone',
      };

      const request = new NextRequest('http://localhost/api/customers', {
        method: 'POST',
        body: JSON.stringify({ type: 'consultation', ...invalidData }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('유효성 검증');
    });

    it('데이터베이스 오류 시 500 오류를 반환한다', async () => {
      mockPrisma.consultationCustomer.create.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost/api/customers', {
        method: 'POST',
        body: JSON.stringify({
          type: 'consultation',
          name: '테스트',
          phone: '010-1234-5678',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('서버 오류가 발생했습니다');
    });
  });
});