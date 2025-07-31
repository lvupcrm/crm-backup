import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/customers/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    consultationCustomer: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('/api/customers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/customers', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/customers');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('로그인이 필요합니다');
    });

    it('should return customers when authenticated', async () => {
      const mockSession = {
        user: { id: '1', email: 'test@example.com' }
      };
      const mockCustomers = [
        {
          id: '1',
          name: '홍길동',
          phone: '010-1234-5678',
          appointmentDate: new Date(),
          inquiryChannel: '네이버',
          sport: '헬스',
          appointmentPurpose: '상담',
          consultationStatus: '미상담',
          registrationStatus: '미등록',
        }
      ];

      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.consultationCustomer.findMany.mockResolvedValue(mockCustomers);

      const request = new NextRequest('http://localhost:3000/api/customers');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockCustomers);
    });
  });

  describe('POST /api/customers', () => {
    it('should create a new customer when valid data is provided', async () => {
      const mockSession = {
        user: { id: '1', email: 'test@example.com' }
      };
      const customerData = {
        name: '김영희',
        phone: '010-9876-5432',
        appointmentDate: '2024-02-15T10:00:00Z',
        inquiryChannel: '인스타그램',
        sport: '요가',
        appointmentPurpose: '체험',
        consultationStatus: '미상담',
        registrationStatus: '미등록',
      };
      const mockCreatedCustomer = { id: '2', ...customerData };

      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.consultationCustomer.create.mockResolvedValue(mockCreatedCustomer);

      const request = new NextRequest('http://localhost:3000/api/customers', {
        method: 'POST',
        body: JSON.stringify(customerData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe(customerData.name);
    });

    it('should return 400 for invalid data', async () => {
      const mockSession = {
        user: { id: '1', email: 'test@example.com' }
      };
      const invalidData = {
        name: '', // Invalid: empty name
        phone: '123', // Invalid: too short
      };

      mockGetServerSession.mockResolvedValue(mockSession);

      const request = new NextRequest('http://localhost:3000/api/customers', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('유효하지 않은 데이터입니다');
    });
  });
});