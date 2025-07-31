# 🎨 디자인 시스템 - Fitness CRM

## 📋 목차
- [디자인 토큰](#디자인-토큰)
- [컬러 팔레트](#컬러-팔레트)
- [타이포그래피](#타이포그래피)
- [간격 시스템](#간격-시스템)
- [컴포넌트 라이브러리](#컴포넌트-라이브러리)
- [아이콘 시스템](#아이콘-시스템)
- [반응형 가이드라인](#반응형-가이드라인)
- [접근성 가이드라인](#접근성-가이드라인)

---

## 디자인 토큰

### 기본 토큰 구조
```typescript
// Design Tokens Structure
interface DesignTokens {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  shadows: ShadowScale;
  borderRadius: BorderRadiusScale;
  breakpoints: BreakpointScale;
}

// 토큰 네이밍 컨벤션
// {category}-{property}-{variant}-{state}
// 예: color-primary-600, spacing-md, shadow-lg
```

### 브랜드 아이덴티티
```typescript
const brandTokens = {
  // 주 브랜드 컬러
  primary: '#2563eb',      // Blue-600
  secondary: '#6b7280',    // Gray-500
  accent: '#16a34a',       // Green-600
  
  // 브랜드 폰트
  fontFamily: {
    primary: 'Inter, system-ui, sans-serif',
    heading: 'Inter, system-ui, sans-serif'
  },
  
  // 브랜드 보이스
  tone: 'professional, friendly, efficient',
  personality: 'trustworthy, modern, helpful'
};
```

---

## 컬러 팔레트

### 메인 컬러 시스템
```css
/* Primary Colors - Blue */
:root {
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;  /* Main Primary */
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
  --color-primary-950: #172554;
}

/* Secondary Colors - Gray */
:root {
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;   /* Main Secondary */
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;   /* Main Dark */
  --color-gray-950: #030712;
}
```

### 시멘틱 컬러
```css
/* Success Colors - Green */
:root {
  --color-success-50: #f0fdf4;
  --color-success-100: #dcfce7;
  --color-success-200: #bbf7d0;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;  /* Main Success */
  --color-success-700: #15803d;
}

/* Warning Colors - Yellow */
:root {
  --color-warning-50: #fefce8;
  --color-warning-100: #fef3c7;
  --color-warning-400: #fbbf24;
  --color-warning-500: #f59e0b;  /* Main Warning */
  --color-warning-600: #d97706;
}

/* Error Colors - Red */
:root {
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;    /* Main Error */
  --color-error-700: #b91c1c;
}
```

### 특수 컬러
```css
/* Kakao Brand Color */
:root {
  --color-kakao-yellow: #ffe812;
  --color-kakao-brown: #3c1e1e;
}

/* Background Colors */
:root {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f7f9fb;
  --color-bg-tertiary: #f3f4f6;
  --color-bg-overlay: rgba(0, 0, 0, 0.5);
}

/* Border Colors */
:root {
  --color-border-primary: #e5e7eb;
  --color-border-secondary: #d1d5db;
  --color-border-focus: #2563eb;
}
```

### 컬러 사용 가이드라인
```typescript
// 컬러 사용 매트릭스
const colorUsage = {
  // UI 상태별 컬러
  interactive: {
    default: 'primary-600',
    hover: 'primary-700',
    active: 'primary-800',
    disabled: 'gray-300',
    focus: 'primary-600 + ring'
  },
  
  // 피드백 컬러
  feedback: {
    success: 'success-600',
    warning: 'warning-500',
    error: 'error-600',
    info: 'primary-600'
  },
  
  // 텍스트 컬러
  text: {
    primary: 'gray-900',
    secondary: 'gray-600',
    tertiary: 'gray-500',
    inverse: 'white',
    link: 'primary-600'
  }
};
```

---

## 타이포그래피

### 폰트 스케일
```css
/* Font Sizes */
:root {
  --font-size-xs: 0.75rem;     /* 12px */
  --font-size-sm: 0.875rem;    /* 14px */
  --font-size-base: 1rem;      /* 16px */
  --font-size-lg: 1.125rem;    /* 18px */
  --font-size-xl: 1.25rem;     /* 20px */
  --font-size-2xl: 1.5rem;     /* 24px */
  --font-size-3xl: 1.875rem;   /* 30px */
  --font-size-4xl: 2.25rem;    /* 36px */
}

/* Font Weights */
:root {
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
}

/* Line Heights */
:root {
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;
}
```

### 타이포그래피 스타일
```css
/* Heading Styles */
.text-heading-1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-extrabold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.025em;
  color: var(--color-gray-900);
}

.text-heading-2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-gray-900);
}

.text-heading-3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
  color: var(--color-gray-900);
}

/* Body Styles */
.text-body-large {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-relaxed);
  color: var(--color-gray-700);
}

.text-body {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-gray-700);
}

.text-body-small {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-gray-600);
}

/* Caption Styles */
.text-caption {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-gray-500);
}

.text-caption-bold {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  color: var(--color-gray-600);
}
```

### 텍스트 유틸리티
```css
/* Text Utilities */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.text-line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

/* Text Decoration */
.text-link {
  color: var(--color-primary-600);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.text-link:hover {
  color: var(--color-primary-700);
  text-decoration: none;
}
```

---

## 간격 시스템

### 기본 간격 스케일
```css
/* Spacing Scale */
:root {
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-0-5: 0.125rem;   /* 2px */
  --spacing-1: 0.25rem;      /* 4px */
  --spacing-1-5: 0.375rem;   /* 6px */
  --spacing-2: 0.5rem;       /* 8px */
  --spacing-2-5: 0.625rem;   /* 10px */
  --spacing-3: 0.75rem;      /* 12px */
  --spacing-3-5: 0.875rem;   /* 14px */
  --spacing-4: 1rem;         /* 16px */
  --spacing-5: 1.25rem;      /* 20px */
  --spacing-6: 1.5rem;       /* 24px */
  --spacing-7: 1.75rem;      /* 28px */
  --spacing-8: 2rem;         /* 32px */
  --spacing-10: 2.5rem;      /* 40px */
  --spacing-12: 3rem;        /* 48px */
  --spacing-16: 4rem;        /* 64px */
  --spacing-20: 5rem;        /* 80px */
  --spacing-24: 6rem;        /* 96px */
}
```

### 시멘틱 간격
```css
/* Semantic Spacing */
:root {
  /* Component Internal Spacing */
  --spacing-component-xs: var(--spacing-2);    /* 8px */
  --spacing-component-sm: var(--spacing-3);    /* 12px */
  --spacing-component-md: var(--spacing-4);    /* 16px */
  --spacing-component-lg: var(--spacing-6);    /* 24px */
  --spacing-component-xl: var(--spacing-8);    /* 32px */
  
  /* Layout Spacing */
  --spacing-layout-xs: var(--spacing-4);       /* 16px */
  --spacing-layout-sm: var(--spacing-6);       /* 24px */
  --spacing-layout-md: var(--spacing-8);       /* 32px */
  --spacing-layout-lg: var(--spacing-12);      /* 48px */
  --spacing-layout-xl: var(--spacing-16);      /* 64px */
  
  /* Section Spacing */
  --spacing-section-sm: var(--spacing-8);      /* 32px */
  --spacing-section-md: var(--spacing-12);     /* 48px */
  --spacing-section-lg: var(--spacing-16);     /* 64px */
  --spacing-section-xl: var(--spacing-24);     /* 96px */
}
```

### 간격 사용 가이드라인
```typescript
// 간격 사용 매트릭스
const spacingUsage = {
  // 컴포넌트 내부 간격
  component: {
    tight: 'spacing-2',      // 버튼, 폼 필드 내부
    normal: 'spacing-4',     // 카드, 모달 내부
    loose: 'spacing-6'       // 섹션 내부
  },
  
  // 컴포넌트 간 간격
  between: {
    related: 'spacing-2',    // 관련된 요소들
    normal: 'spacing-4',     // 일반적인 요소들
    sections: 'spacing-8'    // 섹션 간
  },
  
  // 레이아웃 간격
  layout: {
    page: 'spacing-6',       // 페이지 내부 여백
    container: 'spacing-4',  // 컨테이너 여백
    grid: 'spacing-4'        // 그리드 갭
  }
};
```

---

## 컴포넌트 라이브러리

### 버튼 컴포넌트
```css
/* Button Base */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-medium);
  text-align: center;
  border-radius: 0.375rem;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Button Sizes */
.btn-sm {
  padding: var(--spacing-1-5) var(--spacing-3);
  font-size: var(--font-size-sm);
  border-radius: 0.25rem;
}

.btn-md {
  padding: var(--spacing-2-5) var(--spacing-4);
  font-size: var(--font-size-sm);
}

.btn-lg {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-base);
}

/* Button Variants */
.btn-primary {
  background-color: var(--color-primary-600);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-700);
}

.btn-secondary {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
  border-color: var(--color-gray-300);
}

.btn-secondary:hover {
  background-color: var(--color-gray-200);
}

.btn-outline {
  background-color: transparent;
  color: var(--color-primary-600);
  border-color: var(--color-primary-600);
}

.btn-outline:hover {
  background-color: var(--color-primary-600);
  color: white;
}

.btn-ghost {
  background-color: transparent;
  color: var(--color-gray-600);
}

.btn-ghost:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
}
```

### 입력 필드 컴포넌트
```css
/* Input Base */
.input {
  display: block;
  width: 100%;
  padding: var(--spacing-2-5) var(--spacing-3);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-tight);
  color: var(--color-gray-900);
  background-color: white;
  border: 1px solid var(--color-border-primary);
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-600);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input:disabled {
  background-color: var(--color-gray-100);
  opacity: 0.5;
  cursor: not-allowed;
}

/* Input States */
.input-error {
  border-color: var(--color-error-600);
}

.input-error:focus {
  border-color: var(--color-error-600);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.input-success {
  border-color: var(--color-success-600);
}
```

### 카드 컴포넌트
```css
/* Card Base */
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid var(--color-border-primary);
  overflow: hidden;
}

.card-header {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-border-primary);
}

.card-content {
  padding: var(--spacing-4);
}

.card-footer {
  padding: var(--spacing-4);
  border-top: 1px solid var(--color-border-primary);
  background-color: var(--color-gray-50);
}

/* Card Variants */
.card-elevated {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card-hover:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
  transition: all 0.15s ease-in-out;
}
```

### 뱃지 컴포넌트
```css
/* Badge Base */
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* Badge Variants */
.badge-primary {
  background-color: var(--color-primary-100);
  color: var(--color-primary-700);
}

.badge-secondary {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
}

.badge-success {
  background-color: var(--color-success-100);
  color: var(--color-success-700);
}

.badge-warning {
  background-color: var(--color-warning-100);
  color: var(--color-warning-700);
}

.badge-error {
  background-color: var(--color-error-100);
  color: var(--color-error-700);
}

/* Badge Sizes */
.badge-sm {
  padding: var(--spacing-0-5) var(--spacing-1-5);
  font-size: 0.625rem;
}

.badge-lg {
  padding: var(--spacing-1-5) var(--spacing-3);
  font-size: var(--font-size-sm);
}
```

---

## 아이콘 시스템

### 아이콘 크기 스케일
```css
/* Icon Sizes */
:root {
  --icon-size-xs: 0.75rem;    /* 12px */
  --icon-size-sm: 1rem;       /* 16px */
  --icon-size-md: 1.25rem;    /* 20px */
  --icon-size-lg: 1.5rem;     /* 24px */
  --icon-size-xl: 2rem;       /* 32px */
  --icon-size-2xl: 2.5rem;    /* 40px */
}

/* Icon Base Styles */
.icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}

.icon-xs { width: var(--icon-size-xs); height: var(--icon-size-xs); }
.icon-sm { width: var(--icon-size-sm); height: var(--icon-size-sm); }
.icon-md { width: var(--icon-size-md); height: var(--icon-size-md); }
.icon-lg { width: var(--icon-size-lg); height: var(--icon-size-lg); }
.icon-xl { width: var(--icon-size-xl); height: var(--icon-size-xl); }
.icon-2xl { width: var(--icon-size-2xl); height: var(--icon-size-2xl); }
```

### 아이콘 사용 가이드라인
```typescript
// 아이콘 매핑 (Lucide React 기반)
const iconMapping = {
  // 네비게이션
  home: 'Home',
  users: 'Users',
  message: 'MessageSquare',
  mail: 'Mail',
  package: 'Package',
  barChart: 'BarChart3',
  settings: 'Settings',
  
  // 액션
  plus: 'Plus',
  edit: 'Edit',
  trash: 'Trash2',
  eye: 'Eye',
  download: 'Download',
  upload: 'Upload',
  search: 'Search',
  
  // 상태
  check: 'Check',
  x: 'X',
  alert: 'AlertTriangle',
  info: 'Info',
  
  // 방향
  chevronDown: 'ChevronDown',
  chevronLeft: 'ChevronLeft',
  chevronRight: 'ChevronRight',
  arrowLeft: 'ArrowLeft',
  
  // 특수
  calendar: 'Calendar',
  clock: 'Clock',
  phone: 'Phone',
  user: 'User'
};

// 아이콘 컨텍스트 사용법
const iconContexts = {
  navigation: 'icon-md',       // 네비게이션 메뉴
  button: 'icon-sm',           // 버튼 내부
  input: 'icon-sm',            // 입력 필드
  table: 'icon-sm',            // 테이블 액션
  card: 'icon-lg',             // 카드 헤더
  hero: 'icon-2xl'             // 히어로 섹션
};
```

---

## 반응형 가이드라인

### 브레이크포인트 시스템
```css
/* Breakpoints */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Media Query Mixins */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### 반응형 레이아웃 패턴
```css
/* Responsive Grid */
.grid-responsive {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .grid-responsive-sm-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .grid-responsive-md-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-responsive-lg-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Responsive Spacing */
.responsive-padding {
  padding: var(--spacing-4);
}

@media (min-width: 768px) {
  .responsive-padding {
    padding: var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .responsive-padding {
    padding: var(--spacing-8);
  }
}

/* Responsive Typography */
.responsive-heading {
  font-size: var(--font-size-2xl);
}

@media (min-width: 768px) {
  .responsive-heading {
    font-size: var(--font-size-3xl);
  }
}

@media (min-width: 1024px) {
  .responsive-heading {
    font-size: var(--font-size-4xl);
  }
}
```

### 모바일 우선 설계 원칙
```typescript
// 모바일 우선 설계 체크리스트
const mobileFirstPrinciples = {
  // 콘텐츠 우선순위
  contentPriority: [
    'essential content visible',
    'secondary content collapsible',
    'tertiary content hidden on mobile'
  ],
  
  // 터치 인터페이스
  touchOptimization: [
    'minimum 44px touch targets',
    'adequate spacing between clickable elements',
    'swipe gestures for navigation',
    'haptic feedback consideration'
  ],
  
  // 성능 최적화
  performance: [
    'lightweight mobile experience',
    'progressive image loading',
    'minimal JavaScript on mobile',
    'efficient font loading'
  ]
};
```

---

## 접근성 가이드라인

### 키보드 내비게이션
```css
/* Focus Styles */
.focus-visible {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
}

.focus-ring {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-primary-600);
  color: white;
  padding: 8px;
  border-radius: 4px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

### ARIA 속성 가이드라인
```typescript
// ARIA 속성 사용 예시
const ariaGuidelines = {
  // 폼 요소
  formElements: {
    required: 'aria-required="true"',
    invalid: 'aria-invalid="true"',
    describedBy: 'aria-describedby="error-message"'
  },
  
  // 네비게이션
  navigation: {
    landmark: 'role="navigation"',
    current: 'aria-current="page"',
    expanded: 'aria-expanded="true"'
  },
  
  // 상태 표시
  states: {
    loading: 'aria-busy="true"',
    hidden: 'aria-hidden="true"',
    live: 'aria-live="polite"'
  },
  
  // 레이블링
  labeling: {
    label: 'aria-label="Clear description"',
    labelledBy: 'aria-labelledby="heading-id"',
    describedBy: 'aria-describedby="description-id"'
  }
};
```

### 색상 대비 및 가독성
```css
/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  :root {
    --color-gray-500: #000000;
    --color-gray-600: #000000;
    --color-border-primary: #000000;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark Mode Support (Future) */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #1f2937;
    --color-bg-secondary: #111827;
    --color-text-primary: #f9fafb;
    --color-text-secondary: #e5e7eb;
  }
}
```

### 스크린 리더 지원
```css
/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## 품질 보증 및 도구

### 디자인 토큰 검증
```typescript
// 디자인 토큰 일관성 검증
const tokenValidation = {
  // 컬러 대비 검증
  colorContrast: {
    AAA: 7,    // WCAG AAA 레벨
    AA: 4.5,   // WCAG AA 레벨
    AA_Large: 3 // 큰 텍스트 AA 레벨
  },
  
  // 간격 일관성 검증
  spacingConsistency: {
    baseUnit: 4,      // 4px 기본 단위
    scaleRatio: 1.25, // 간격 비율
    maxSpacing: 96    // 최대 간격 (px)
  },
  
  // 타이포그래피 검증
  typographyScale: {
    minSize: 12,      // 최소 폰트 크기
    maxSize: 48,      // 최대 폰트 크기
    scaleRatio: 1.2   // 타이포그래피 비율
  }
};
```

### 개발 도구 통합
```json
{
  "designSystemTools": {
    "linting": {
      "stylelint": "CSS/SCSS 린팅",
      "eslint": "컴포넌트 일관성 검증"
    },
    "testing": {
      "chromatic": "비주얼 리그레션 테스트",
      "axe": "접근성 자동 테스트"
    },
    "documentation": {
      "storybook": "컴포넌트 문서화",
      "figma": "디자인 토큰 동기화"
    },
    "bundling": {
      "rollup": "디자인 토큰 번들링",
      "postcss": "CSS 최적화"
    }
  }
}
```

---

## 업데이트 및 버전 관리

### 시멘틱 버전 관리
```
Major (X.0.0): Breaking changes to existing APIs
Minor (0.X.0): New features, backward compatible
Patch (0.0.X): Bug fixes, backward compatible

예시:
1.0.0 - Initial design system release
1.1.0 - New component additions
1.1.1 - Color contrast improvements
2.0.0 - Complete typography scale redesign
```

### 업데이트 커뮤니케이션
```typescript
// 변경사항 추적
const changelogTemplate = {
  version: '1.2.0',
  date: '2025-01-30',
  changes: {
    added: ['새로운 Toast 컴포넌트', 'Dark mode 지원'],
    changed: ['Button 컴포넌트 패딩 조정', '컬러 토큰 명명 규칙'],
    deprecated: ['기존 Alert 컴포넌트 (v2.0에서 제거 예정)'],
    removed: [],
    fixed: ['모바일에서 Modal 스크롤 이슈', 'Safari 폰트 렌더링']
  },
  migration: {
    required: false,
    guide: 'docs/migration/v1.2.0.md'
  }
};
```

---

**결론**: 이 디자인 시스템은 Fitness CRM의 일관성 있고 접근 가능한 사용자 경험을 보장하며, 개발 효율성과 유지보수성을 극대화합니다.