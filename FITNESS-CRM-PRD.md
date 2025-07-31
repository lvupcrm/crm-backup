# 🏋️‍♀️ Fitness CRM System - PRD (Product Requirements Document)

## 📋 개요

### 프로젝트 정보
- **제품명**: Fitness CRM System
- **버전**: v0.1.0
- **개발 언어**: TypeScript
- **프레임워크**: Next.js 15.3.5 (React 19)
- **데이터베이스**: PostgreSQL (Prisma ORM)
- **인증**: NextAuth.js v4
- **UI 라이브러리**: Radix UI + Tailwind CSS v4

### 목적 및 목표
피트니스 센터/체육관 운영을 위한 통합 CRM 시스템으로, 고객 관리부터 메시지 발송, 캠페인 관리까지 원스톱 서비스를 제공합니다.

## 🎯 핵심 기능

### 1. 고객관리
- **상담 고객**: 방문 예약 및 상담 관리
- **미등록 고객**: 상담 후 등록 대기 고객
- **등록 고객**: 회원가입 완료 고객 관리

### 2. 메시지 관리
- **템플릿 시스템**: 알림톡/SMS 템플릿 생성 및 관리
- **단체 메시지**: 대량 메시지 발송
- **발송 내역**: 메시지 발송 이력 조회

### 3. 캠페인 관리
- **자동화 캠페인**: 조건별 자동 메시지 발송
- **성과 분석**: 캠페인 효과 측정
- **템플릿 기반**: 사전 정의된 템플릿 활용

### 4. 상품/결제 관리
- **상품 등록**: 회원권, PT 등 상품 관리
- **결제 내역**: 고객별 결제 이력

### 5. 통계 및 분석
- **매출 분석**: 기간별 매출 현황
- **고객 분석**: 등록/이탈 고객 통계

## 🏗️ 시스템 아키텍처

### 기술 스택
```
Frontend: Next.js 15 (App Router) + React 19 + TypeScript
Styling: Tailwind CSS v4 + Radix UI Components
State Management: Zustand + TanStack Query
Backend: Next.js API Routes
Database: PostgreSQL + Prisma ORM
Authentication: NextAuth.js
Charts: Recharts
Date Picker: React DatePicker + React Calendar
```

### 데이터베이스 스키마
```
📊 주요 엔티티:
- User (사용자/직원)
- Role (권한)
- Branch (지점)
- ConsultationCustomer (상담 고객)
- RegisteredCustomer (등록 고객)
- Product (상품)
- Payment (결제)
- MessageTemplate (메시지 템플릿)
- Campaign (캠페인)
- ScheduledMessage (예약 메시지)
```

## 📱 사용자 인터페이스

### 라우팅 구조
```
/ (대시보드)
├── /customers/
│   ├── /consultation - 상담 고객
│   ├── /unregistered - 미등록 고객
│   └── /registered - 등록 고객
├── /messages/
│   ├── /templates/ - 템플릿 관리
│   ├── /bulk - 단체 메시지
│   └── /logs - 발송 내역
├── /campaigns/
│   ├── /create - 캠페인 생성
│   ├── / - 캠페인 목록
│   ├── /examples - 예시 목록
│   └── /performance - 성과 분석
├── /products/ - 상품 관리
├── /statistics/ - 통계
└── /settings/ - 설정
```

### 주요 컴포넌트
- **Sidebar**: 메인 네비게이션 (접을 수 있는 서브메뉴)
- **Header**: 상단 헤더
- **Dashboard Cards**: 주요 지표 카드
- **Data Tables**: 고객/캠페인 목록 테이블
- **Forms**: 고객/캠페인 등록 폼
- **Charts**: 통계 차트 (Recharts)

## 🔐 권한 관리

### 사용자 역할
- **관리자**: 전체 기능 접근
- **지점장**: 해당 지점 고객 관리
- **직원/트레이너**: 담당 고객 관리

### 권한 시스템
- Role 기반 권한 관리 (JSON 형태)
- Branch 단위 데이터 분리
- NextAuth.js 세션 기반 인증

## 💬 메시지 시스템

### 채널 지원
- **알림톡**: 카카오 알림톡 발송
- **SMS**: 문자메시지 발송

### 템플릿 시스템
- 변수 치환: `{{이름}}`, `{{날짜}}` 등
- 승인 프로세스: 승인대기 → 승인완료 → 반려
- 카테고리별 분류

### 캠페인 유형
- **신규**: 신규 고객 대상
- **리마인드**: 기존 고객 리마인드
- **소프트랜딩**: 이탈 고객 복귀
- **미등록**: 상담 후 미등록 고객

## 📊 통계 및 성과 분석

### 주요 지표
- **고객 현황**: 신규/활동/휴면/이탈 고객 수
- **매출 현황**: 기간별 매출 추이
- **캠페인 성과**: 발송 성공률, 전환율
- **지점별 성과**: 다중 지점 운영시 지점별 비교

### 차트 유형
- Line Chart: 시계열 데이터
- Bar Chart: 카테고리별 비교
- Pie Chart: 비율 데이터
- Table: 상세 데이터 목록

## 🚀 개발 로드맵

### Phase 1 (현재 구현된 기능)
- ✅ 기본 UI/UX 구조
- ✅ 고객 관리 기본 기능
- ✅ 메시지 템플릿 시스템
- ✅ 캠페인 관리 UI
- ✅ 데이터베이스 스키마

### Phase 2 (개발 예정)
- 🔄 실제 메시지 발송 연동
- 🔄 결제 시스템 연동
- 🔄 고급 통계 기능
- 🔄 모바일 반응형 최적화

### Phase 3 (향후 계획)
- 📋 API 문서화
- 📋 테스트 코드 작성
- 📋 배포 자동화
- 📋 성능 최적화

## 🔧 기술적 특징

### 성능 최적화
- **Next.js App Router**: 서버 컴포넌트 활용
- **TanStack Query**: 데이터 캐싱 및 상태 관리
- **Zustand**: 경량 전역 상태 관리
- **Prisma**: 타입 안전한 데이터베이스 쿼리

### 코드 품질
- **TypeScript**: 전체 프로젝트 타입 안전성
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅 (추가 권장)

### 보안
- **NextAuth.js**: 안전한 인증 시스템
- **Prisma**: SQL Injection 방지
- **환경변수**: 민감 정보 보호

## 📝 사용 시나리오

### 고객 등록 프로세스
1. 방문 예약 → 상담 고객 등록
2. 상담 완료 → 상담 상태 업데이트
3. 회원가입 → 등록 고객으로 전환
4. 첫 결제 → 상품/결제 정보 등록

### 캠페인 발송 프로세스
1. 템플릿 생성 → 승인 요청
2. 캠페인 설정 → 발송 조건 정의
3. 자동 발송 → 조건 만족시 자동 실행
4. 성과 분석 → 발송 결과 확인

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: Blue (사이드바, 버튼)
- **Secondary**: Gray (배경, 테두리)
- **Success**: Green (성공 상태)
- **Warning**: Yellow (경고)
- **Error**: Red (오류)

### 컴포넌트 라이브러리
- **Radix UI**: 접근성 좋은 기본 컴포넌트
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **Lucide Icons**: 일관된 아이콘 세트

## 📞 연락처 및 지원

### 개발팀
- **개발자**: [개발자 정보]
- **PM**: [PM 정보]
- **디자이너**: [디자이너 정보]

### 기술 지원
- **저장소**: Git Repository
- **이슈 트래킹**: GitHub Issues
- **문서**: README.md + 이 PRD

---

*이 문서는 Fitness CRM System의 핵심 요구사항과 기능을 정의합니다. 추가 기능이나 변경사항은 팀 협의를 통해 업데이트됩니다.*