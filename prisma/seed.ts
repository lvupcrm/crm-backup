import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // 1. 역할(Role) 시드 데이터
  const adminRole = await prisma.role.upsert({
    where: { name: '관리자' },
    update: {},
    create: {
      name: '관리자',
      permissions: {
        customers: { view: true, create: true, edit: true, delete: true },
        messages: { view: true, create: true, edit: true, delete: true, send: true },
        products: { view: true, create: true, edit: true, delete: true },
        statistics: { view: true },
        settings: { view: true, edit: true }
      }
    }
  });

  const trainerRole = await prisma.role.upsert({
    where: { name: '트레이너' },
    update: {},
    create: {
      name: '트레이너',
      permissions: {
        customers: { view: true, create: true, edit: true, delete: false },
        messages: { view: true, create: false, edit: false, delete: false, send: true },
        products: { view: true, create: false, edit: false, delete: false },
        statistics: { view: true },
        settings: { view: false, edit: false }
      }
    }
  });

  const staffRole = await prisma.role.upsert({
    where: { name: '직원' },
    update: {},
    create: {
      name: '직원',
      permissions: {
        customers: { view: true, create: true, edit: true, delete: false },
        messages: { view: true, create: false, edit: false, delete: false, send: false },
        products: { view: true, create: false, edit: false, delete: false },
        statistics: { view: false },
        settings: { view: false, edit: false }
      }
    }
  });

  // 2. 지점(Branch) 시드 데이터
  const mainBranch = await prisma.branch.upsert({
    where: { name: '본점' },
    update: {},
    create: {
      name: '본점',
      address: '서울시 강남구 테헤란로 123',
      phone: '02-1234-5678'
    }
  });

  const gangnamBranch = await prisma.branch.upsert({
    where: { name: '강남점' },
    update: {},
    create: {
      name: '강남점',
      address: '서울시 강남구 역삼동 456',
      phone: '02-2345-6789'
    }
  });

  // 3. 사용자(User) 시드 데이터
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@fitness.com' },
    update: {},
    create: {
      email: 'admin@fitness.com',
      password: hashedPassword,
      name: '시스템 관리자',
      phone: '010-1234-5678',
      roleId: adminRole.id,
      branchId: mainBranch.id
    }
  });

  const trainerUser = await prisma.user.upsert({
    where: { email: 'trainer@fitness.com' },
    update: {},
    create: {
      email: 'trainer@fitness.com',
      password: hashedPassword,
      name: '김트레이너',
      phone: '010-2345-6789',
      roleId: trainerRole.id,
      branchId: mainBranch.id
    }
  });

  // 4. 상품(Product) 시드 데이터
  const membership3m = await prisma.product.upsert({
    where: { productName: '3개월 회원권' },
    update: {},
    create: {
      productName: '3개월 회원권',
      description: '헬스장 3개월 이용권',
      price: 150000,
      validityPeriod: 90,
      branchId: mainBranch.id
    }
  });

  const membership6m = await prisma.product.upsert({
    where: { productName: '6개월 회원권' },
    update: {},
    create: {
      productName: '6개월 회원권',
      description: '헬스장 6개월 이용권 (10% 할인)',
      price: 270000,
      validityPeriod: 180,
      branchId: mainBranch.id
    }
  });

  const pt10 = await prisma.product.upsert({
    where: { productName: 'PT 10회' },
    update: {},
    create: {
      productName: 'PT 10회',
      description: '개인 트레이닝 10회권',
      price: 500000,
      validityPeriod: 60,
      branchId: mainBranch.id
    }
  });

  // 5. 메시지 템플릿(MessageTemplate) 시드 데이터
  const welcomeTemplate = await prisma.messageTemplate.upsert({
    where: { templateName: '신규회원 환영 메시지' },
    update: {},
    create: {
      templateName: '신규회원 환영 메시지',
      channel: '알림톡',
      templateCode: 'WELCOME_NEW_MEMBER',
      content: '안녕하세요 {{이름}}님! 저희 {{지점명}}에 가입해주셔서 감사합니다. 건강한 운동 생활을 응원하겠습니다!',
      variables: ['{{이름}}', '{{지점명}}'],
      status: '승인완료'
    }
  });

  const expiryTemplate = await prisma.messageTemplate.upsert({
    where: { templateName: '만료 안내 메시지' },
    update: {},
    create: {
      templateName: '만료 안내 메시지',
      channel: 'SMS',
      templateCode: 'MEMBERSHIP_EXPIRY',
      content: '{{이름}}님의 회원권이 {{만료일}}에 만료됩니다. 연장 문의: {{연락처}}',
      variables: ['{{이름}}', '{{만료일}}', '{{연락처}}'],
      status: '승인완료'
    }
  });

  // 6. 캠페인(Campaign) 시드 데이터
  const welcomeCampaign = await prisma.campaign.upsert({
    where: { campaignName: '신규회원 자동 안내' },
    update: {},
    create: {
      campaignName: '신규회원 자동 안내',
      description: '신규 회원 등록 시 자동으로 환영 메시지 발송',
      sendCondition: '신규회원 등록 시',
      templateId: welcomeTemplate.id,
      isActive: true
    }
  });

  // 7. 상담고객(ConsultationCustomer) 시드 데이터
  await prisma.consultationCustomer.createMany({
    data: [
      {
        name: '홍길동',
        phone: '010-1111-1111',
        appointmentDate: new Date('2024-02-01T10:00:00'),
        inquiryChannel: '네이버',
        sport: '헬스',
        appointmentPurpose: '상담',
        consultationStatus: '미상담',
        registrationStatus: '미등록',
        managerId: adminUser.id,
        memo: '다이어트 목적으로 문의'
      },
      {
        name: '김영희',
        phone: '010-2222-2222',
        appointmentDate: new Date('2024-02-02T14:00:00'),
        inquiryChannel: '인스타그램',
        sport: '요가',
        appointmentPurpose: '체험',
        consultationStatus: '상담완료',
        registrationStatus: '등록완료',
        managerId: trainerUser.id,
        memo: '요가 체험 후 등록'
      }
    ],
    skipDuplicates: true
  });

  // 8. 등록회원(RegisteredCustomer) 시드 데이터
  const registeredCustomer = await prisma.registeredCustomer.create({
    data: {
      name: '이철수',
      phone: '010-3333-3333',
      joinDate: new Date('2024-01-15'),
      membershipType: '6개월 회원권',
      membershipExpiry: new Date('2024-07-15'),
      trainerId: trainerUser.id,
      branchId: mainBranch.id,
      status: '활동',
      memo: '근력 운동 집중'
    }
  });

  // 9. 결제(Payment) 시드 데이터
  await prisma.payment.create({
    data: {
      customerId: registeredCustomer.id,
      productId: membership6m.id,
      amount: 270000,
      paymentMethod: '카드',
      paymentDate: new Date('2024-01-15'),
      memo: '신규 회원 6개월권 구매'
    }
  });

  console.log('Database seeding completed successfully!');
  console.log('Default admin login: admin@fitness.com / Admin123!');
  console.log('Default trainer login: trainer@fitness.com / Admin123!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });