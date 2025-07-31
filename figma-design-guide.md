# 🎨 Figma 디자인 가이드 - Fitness CRM

와이어프레임을 바탕으로 Figma에서 정확한 디자인 작업을 위한 완벽한 가이드

## 📋 목차
- [Figma 파일 구조 설정](#figma-파일-구조-설정)
- [디자인 시스템 설정](#디자인-시스템-설정)
- [컴포넌트 라이브러리](#컴포넌트-라이브러리)
- [페이지 레이아웃 구성](#페이지-레이아웃-구성)
- [고객관리 페이지 디자인](#고객관리-페이지-디자인)
- [인터랙션 및 상태](#인터랙션-및-상태)
- [반응형 디자인](#반응형-디자인)
- [개발 핸드오프](#개발-핸드오프)

---

## Figma 파일 구조 설정

### 📁 파일 및 페이지 구조
```
Fitness CRM Design System
├── 🎨 Design System
│   ├── Color Styles
│   ├── Text Styles  
│   ├── Effect Styles
│   └── Component Library
├── 📱 Pages
│   ├── 00_Layout System
│   ├── 01_Customer Management
│   ├── 02_Message Management
│   ├── 03_Campaign Management
│   └── 04_Statistics
└── 📋 Documentation
    ├── Style Guide
    ├── Component Specs
    └── Developer Handoff
```

### 🖼️ 아트보드 설정
```
데스크톱: 1440 × 900px (기본)
태블릿: 768 × 1024px
모바일: 375 × 812px

그리드 설정:
- Columns: 12
- Gutter: 24px
- Margin: 24px
```

---

## 디자인 시스템 설정

### 🎨 Color Styles (정확한 Hex 코드)

#### Primary Colors
```
Primary/600 (메인)    #2563EB   RGB(37, 99, 235)
Primary/700 (호버)    #1D4ED8   RGB(29, 78, 216)
Primary/500          #3B82F6   RGB(59, 130, 246)
Primary/100 (배경)    #DBEAFE   RGB(219, 234, 254)
Primary/50           #EFF6FF   RGB(239, 246, 255)
```

#### Secondary Colors (Gray Scale)
```
Gray/900 (제목)       #111827   RGB(17, 24, 39)
Gray/800             #1F2937   RGB(31, 41, 55)
Gray/700 (텍스트)     #374151   RGB(55, 65, 81)
Gray/600             #4B5563   RGB(75, 85, 99)
Gray/500             #6B7280   RGB(107, 114, 128)
Gray/400 (테이블헤더)  #9CA3AF   RGB(156, 163, 175)
Gray/300 (보더)       #D1D5DB   RGB(209, 213, 219)
Gray/200             #E5E7EB   RGB(229, 231, 235)
Gray/100 (버튼배경)    #F3F4F6   RGB(243, 244, 246)
Gray/50 (줄무늬)      #F9FAFB   RGB(249, 250, 251)
```

#### Status Colors
```
Success/600          #16A34A   RGB(22, 163, 74)
Success/700 (호버)    #15803D   RGB(21, 128, 61)
Success/100 (배경)    #DCFCE7   RGB(220, 252, 231)

Warning/500          #F59E0B   RGB(245, 158, 11)
Warning/100          #FEF3C7   RGB(254, 243, 199)

Error/600            #DC2626   RGB(220, 38, 38)
Error/700            #B91C1C   RGB(185, 28, 28)
Error/100            #FEE2E2   RGB(254, 226, 226)
```

#### Background Colors
```
Background/Primary    #FFFFFF   RGB(255, 255, 255)
Background/Secondary  #F7F9FB   RGB(247, 249, 251)
Background/Tertiary   #F3F4F6   RGB(243, 244, 246)
Background/Overlay    #000000   Opacity 50%
```

### 🔤 Typography Styles

#### Font Family
```
Primary: Inter (Google Fonts)
- Regular (400)
- Medium (500)  
- Semibold (600)
- Bold (700)
- Extrabold (800)

Fallback: system-ui, -apple-system, sans-serif
```

#### Text Styles
```
Heading/XL (30px)
- Font: Inter Extrabold
- Size: 30px (1.875rem)
- Line Height: 37.5px (1.25)
- Letter Spacing: -0.025em
- Color: Gray/900

Heading/L (24px)
- Font: Inter Bold  
- Size: 24px (1.5rem)
- Line Height: 30px (1.25)
- Color: Gray/900

Heading/M (20px)
- Font: Inter Semibold
- Size: 20px (1.25rem)
- Line Height: 27.5px (1.375)
- Color: Gray/900

Body/L (18px)
- Font: Inter Regular
- Size: 18px (1.125rem)
- Line Height: 29.25px (1.625)
- Color: Gray/700

Body/M (16px) - 기본
- Font: Inter Regular
- Size: 16px (1rem)
- Line Height: 24px (1.5)
- Color: Gray/700

Body/S (14px)
- Font: Inter Regular  
- Size: 14px (0.875rem)
- Line Height: 21px (1.5)
- Color: Gray/600

Caption (12px)
- Font: Inter Regular
- Size: 12px (0.75rem)
- Line Height: 18px (1.5)
- Color: Gray/500

Caption/Bold (12px)
- Font: Inter Semibold
- Size: 12px (0.75rem)
- Line Height: 18px (1.5)
- Color: Gray/600
```

### 📏 Spacing System

#### Base Unit: 4px
```
0    = 0px
1    = 4px    (0.25rem)
2    = 8px    (0.5rem)
3    = 12px   (0.75rem)
4    = 16px   (1rem)
5    = 20px   (1.25rem)
6    = 24px   (1.5rem)
8    = 32px   (2rem)
10   = 40px   (2.5rem)
12   = 48px   (3rem)
16   = 64px   (4rem)
20   = 80px   (5rem)
24   = 96px   (6rem)
```

#### Semantic Spacing
```
Component/XS = 8px   (컴포넌트 내부 최소 간격)
Component/S  = 12px  (폼 필드 간격)
Component/M  = 16px  (카드 내부 패딩)
Component/L  = 24px  (섹션 간격)
Component/XL = 32px  (페이지 섹션 간격)

Layout/XS    = 16px  (컨테이너 최소 여백)
Layout/S     = 24px  (페이지 패딩)
Layout/M     = 32px  (섹션 간격)
Layout/L     = 48px  (큰 섹션 간격)
Layout/XL    = 64px  (페이지 상단 여백)
```

### 🎯 Effect Styles

#### Shadows
```
Small Shadow
- X: 0, Y: 1, Blur: 3, Spread: 0
- Color: #000000, Opacity: 10%
- Second Layer: X: 0, Y: 1, Blur: 2, Spread: 0
- Color: #000000, Opacity: 6%

Medium Shadow  
- X: 0, Y: 4, Blur: 6, Spread: -1
- Color: #000000, Opacity: 10%
- Second Layer: X: 0, Y: 2, Blur: 4, Spread: -1
- Color: #000000, Opacity: 6%

Large Shadow
- X: 0, Y: 10, Blur: 15, Spread: -3
- Color: #000000, Opacity: 10%
- Second Layer: X: 0, Y: 4, Blur: 6, Spread: -2
- Color: #000000, Opacity: 5%

Extra Large Shadow (사이드패널)
- X: 0, Y: 20, Blur: 25, Spread: -5
- Color: #000000, Opacity: 10%
- Second Layer: X: 0, Y: 10, Blur: 10, Spread: -5
- Color: #000000, Opacity: 4%
```

#### Border Radius
```
None     = 0px
Small    = 4px    (0.25rem)
Default  = 6px    (0.375rem)
Medium   = 8px    (0.5rem)  
Large    = 12px   (0.75rem)
XL       = 16px   (1rem)
2XL      = 24px   (1.5rem)
Full     = 9999px (완전한 원형)
```

---

## 컴포넌트 라이브러리

### 🔘 Button Component

#### Base Button (Auto Layout)
```
Padding: 
- Horizontal: 16px (Component/M)
- Vertical: 10px (Component/XS + 2px)

Border Radius: 6px (Default)
Font: Body/S (14px) Medium
Height: 40px (최소)

States: Default, Hover, Active, Disabled
Variants: Primary, Secondary, Outline, Ghost, Destructive
Sizes: Small (32px), Medium (40px), Large (48px)
```

#### Button Variants
```
Primary Button
- Background: Primary/600 (#2563EB)
- Text: White
- Hover: Primary/700 (#1D4ED8)
- Border: None

Secondary Button  
- Background: Gray/100 (#F3F4F6)
- Text: Gray/900 (#111827)
- Border: 1px solid Gray/300 (#D1D5DB)
- Hover: Gray/200 (#E5E7EB)

Outline Button
- Background: Transparent
- Text: Primary/600 (#2563EB)
- Border: 1px solid Primary/600 (#2563EB)
- Hover: Background Primary/600, Text White

Ghost Button
- Background: Transparent  
- Text: Gray/600 (#4B5563)
- Border: None
- Hover: Background Gray/100 (#F3F4F6)

Destructive Button
- Background: Error/600 (#DC2626)
- Text: White
- Hover: Error/700 (#B91C1C)

Success Button
- Background: Success/600 (#16A34A)
- Text: White  
- Hover: Success/700 (#15803D)
```

#### Size Variants
```
Small Button
- Height: 32px
- Padding: 6px 12px
- Font: Caption/Bold (12px)

Medium Button (기본)
- Height: 40px
- Padding: 10px 16px
- Font: Body/S (14px) Medium

Large Button
- Height: 48px
- Padding: 12px 24px
- Font: Body/M (16px) Medium
```

### 📝 Input Component

#### Base Input (Auto Layout)
```
Width: Fill Container
Height: 40px
Padding: 10px 12px
Border: 1px solid Gray/300 (#D1D5DB)
Border Radius: 6px (Default)
Background: White
Font: Body/S (14px) Regular
Color: Gray/900 (#111827)

States: Default, Focus, Error, Disabled
```

#### Input States
```
Default State
- Border: Gray/300 (#D1D5DB)
- Background: White
- Placeholder: Gray/500 (#6B7280)

Focus State  
- Border: Primary/600 (#2563EB)
- Ring: 3px Primary/600 at 10% opacity
- Background: White

Error State
- Border: Error/600 (#DC2626)  
- Ring: 3px Error/600 at 10% opacity
- Background: White

Disabled State
- Border: Gray/300 (#D1D5DB)
- Background: Gray/100 (#F3F4F6)
- Opacity: 50%
```

#### Input with Icon
```
Icon Position: Left (12px from edge)
Icon Size: 16px × 16px
Icon Color: Gray/400 (#9CA3AF)
Text Padding Left: 40px (12px + 16px + 12px)
```

### 📊 Table Component

#### Table Container
```
Background: White
Border Radius: 8px (Medium)
Shadow: Small Shadow
Border: 1px solid Gray/200 (#E5E7EB)
Overflow: Hidden
```

#### Table Header
```
Background: Gray/400 (#9CA3AF)
Text Color: White
Font: Body/S (14px) Semibold
Padding: 12px (Component/S)
Border Bottom: None
```

#### Table Row
```
Height: Auto (최소 48px)
Padding: 12px (Component/S)
Border Bottom: 1px solid Gray/200 (#E5E7EB)

Even Rows: Background White
Odd Rows: Background Gray/50 (#F9FAFB)

Hover State: Background Primary/50 (#EFF6FF)
```

#### Table Cell
```
Padding: 12px (Component/S)
Font: Body/S (14px) Regular
Color: Gray/700 (#374151)
Vertical Align: Middle

Number Cell: Text Align Right
Action Cell: Auto Layout, Gap 8px
```

### 🏷️ Badge Component

#### Base Badge
```
Height: 24px
Padding: 4px 8px
Border Radius: Full (9999px)
Font: Caption/Bold (12px)
Text Transform: None (실제 구현에서는 대문자 변환 없음)
Letter Spacing: 0.025em
```

#### Badge Variants (고객관리 시스템용)
```
예약목적 뱃지:
상담 Badge
- Background: #DBEAFE (blue-100)
- Text: #1D4ED8 (blue-700)

체험 Badge
- Background: #DCFCE7 (green-100)
- Text: #15803D (green-700)

등록 Badge
- Background: #F3E8FF (purple-100)
- Text: #7C3AED (purple-700)

기타 Badge
- Background: #F3F4F6 (gray-100)
- Text: #374151 (gray-700)

상태 뱃지:
활동 Badge
- Background: #DCFCE7 (green-100)
- Text: #15803D (green-700)

만료 Badge
- Background: #FEE2E2 (red-100)
- Text: #DC2626 (red-700)

휴면 Badge
- Background: #FEF3C7 (yellow-100)
- Text: #D97706 (yellow-700)

미상담 Badge
- Background: #F3F4F6 (gray-100)
- Text: #4B5563 (gray-600)

상담완료 Badge
- Background: #DBEAFE (blue-100)
- Text: #1D4ED8 (blue-700)

미등록 Badge
- Background: #FEE2E2 (red-100)
- Text: #DC2626 (red-700)

등록완료 Badge
- Background: #DCFCE7 (green-100)
- Text: #15803D (green-700)
```

### 📱 Modal Component

#### Modal Overlay
```
Position: Fixed
Background: Black with 50% opacity
Z-Index: 50
Display: Flex
Align Items: Center
Justify Content: Center
```

#### Modal Container
```
Max Width: 768px (3xl)
Max Height: 90vh
Background: White
Border Radius: 12px (Large)
Shadow: Extra Large Shadow
Overflow: Hidden
```

#### Modal Header
```
Padding: 24px (Layout/S)
Border Bottom: 1px solid Gray/200 (#E5E7EB)
Display: Flex
Justify Content: Space Between
Align Items: Center

Title Font: Heading/M (20px) Semibold
```

#### Modal Content
```
Padding: 24px (Layout/S)
Overflow Y: Auto
Max Height: Calc(90vh - header - footer)
```

#### Modal Footer
```
Padding: 24px (Layout/S)
Border Top: 1px solid Gray/200 (#E5E7EB)
Display: Flex
Justify Content: End
Gap: 8px (Component/XS)
```

### 📄 Card Component

#### Base Card
```
Background: White
Border Radius: 8px (Medium)
Border: 1px solid Gray/200 (#E5E7EB)
Shadow: Small Shadow
Overflow: Hidden
```

#### Card Header
```
Padding: 16px (Component/M)
Border Bottom: 1px solid Gray/200 (#E5E7EB)
Background: White

Title Font: Heading/M (20px) Semibold
Subtitle Font: Body/S (14px) Regular, Gray/600
```

#### Card Content
```
Padding: 16px (Component/M)
Background: White
```

#### Card Footer
```
Padding: 16px (Component/M)  
Border Top: 1px solid Gray/200 (#E5E7EB)
Background: Gray/50 (#F9FAFB)
```

---

## 페이지 레이아웃 구성

### 🖥️ Desktop Layout (1440px)

#### Main Container
```
Width: 1440px
Height: 900px  
Background: Background/Secondary (#F7F9FB)
Display: Flex
```

#### Sidebar
```
Width: 256px (고정)
Height: 100vh
Background: Gray/900 (#111827)
Position: Fixed (데스크톱)
Z-Index: 40

Padding: 28px 8px (상단 여백 + 좌우 여백)
Gap: 24px (섹션 간)
```

#### Main Content Area
```
Flex: 1
Margin Left: 256px (사이드바 너비)
Display: Flex
Flex Direction: Column
```

#### Header
```
Width: Calc(100% - 256px)
Height: Auto
Background: Gray/900 (#111827)
Padding: 12px 8px
Shadow: Small Shadow
Position: Sticky
Top: 0
Z-Index: 30

Layout: Flex, Justify Between, Align Center
```

#### Content Area  
```
Flex: 1
Padding: 24px (Layout/S)
Background: Background/Secondary (#F7F9FB)
Overflow: Auto
```

### 📱 Mobile Layout (375px)

#### Sidebar (모바일)
```
Width: 256px
Position: Fixed
Transform: translateX(-100%) (기본 숨김)
Transition: transform 200ms ease-in-out
Backdrop: Black 50% opacity when open
```

#### Main Content (모바일)
```
Width: 100%
Margin Left: 0
Padding: 16px (축소된 패딩)
```

### 🏗️ Auto Layout 설정

#### Vertical Layouts
```
Direction: Vertical
Gap: 24px (Layout/S) - 주요 섹션 간
Gap: 16px (Component/M) - 컴포넌트 간  
Gap: 12px (Component/S) - 폼 필드 간
Padding: 24px (Layout/S) - 컨테이너 패딩
```

#### Horizontal Layouts  
```
Direction: Horizontal
Gap: 16px (Component/M) - 버튼 그룹
Gap: 8px (Component/XS) - 아이콘과 텍스트
Align Items: Center (일반적)
Justify Content: Space Between (네비게이션)
```

---

## 고객관리 페이지 디자인

### 📋 Page Structure Frame

#### Customer Management Page
```
Frame Name: "Customer Management Page"
Width: 1440px
Height: 900px
Background: Background/Secondary (#F7F9FB)

Auto Layout: Vertical
Gap: 0
Padding: 0
```

### 📄 Page Header Section

#### Header Container
```
Auto Layout: Horizontal
Width: Fill Container
Height: Auto
Justify Content: Space Between
Align Items: Center
Padding: 0 (이미 Content Area에서 패딩 적용)
Gap: 16px
```

#### Page Title
```
Text: "상담 고객 관리" / "미등록 고객 관리" / "신규 등록 고객 관리"
Style: Heading/XL (30px) Extrabold
Color: Gray/800 (#1F2937)
Auto Layout: Hug Contents
```

### 🧭 Navigation Bar Component

#### Navigation Container
```
Auto Layout: Horizontal  
Width: Fill Container
Height: 40px
Justify Content: Space Between
Align Items: Center
Gap: 16px
Margin: 16px 0 (상하 여백)
```

#### Left Navigation Group
```
Auto Layout: Horizontal
Gap: 8px (Component/XS)
Align Items: Center

Components:
1. Previous Button (40px × 40px)
2. Date Range Display (160px × 40px)  
3. Period Dropdown (120px × 40px)
4. Next Button (40px × 40px)
5. Search Input with Icon (256px × 40px)
6. Search Button (80px × 40px)
```

#### Date Navigation Buttons
```
Size: 40px × 40px (정사각형)
Background: Gray/100 (#F3F4F6)
Border: 1px solid Gray/300 (#D1D5DB)
Border Radius: 6px
Font: Body/S (14px) Medium
Color: Gray/900 (#111827)

Hover State:
- Background: Gray/200 (#E5E7EB)
- Transition: 200ms ease

Icon: "◀" / "▶" (텍스트 또는 Lucide 아이콘)
```

#### Date Range Display
```
Width: 160px
Height: 40px
Background: Gray/100 (#F3F4F6)
Border: 1px solid Gray/300 (#D1D5DB)
Border Radius: 6px
Text Align: Center

Font: Body/S (14px) Medium
Color: Gray/900 (#111827)
Text: "2024-01-01 ~ 2024-12-31"
```

#### Period Dropdown
```
Width: 120px
Height: 40px
Background: Gray/100 (#F3F4F6)
Border: 1px solid Gray/300 (#D1D5DB)
Border Radius: 6px
Padding: 10px 12px

Font: Body/S (14px) Medium
Color: Gray/900 (#111827)

Dropdown Icon: Chevron Down (16px)
Options: "전체", "오늘", "이번주", "지난주", "이번달", "지난달"
```

#### Search Input Group
```
Position: Relative
Width: 256px
Height: 40px

Input:
- Fill Container
- Padding Left: 40px (아이콘 공간)
- Placeholder: "이름, 연락처로 검색"

Icon:
- Position: Absolute
- Left: 12px, Top: 12px  
- Size: 16px × 16px
- Color: Gray/400 (#9CA3AF)
- Lucide: Search
```

#### Action Button (우측)
```
Auto Layout: Hug Contents
Height: 40px
Padding: 10px 16px
Border Radius: 6px

Variants:
- 상담 고객: Primary Button "상담 고객 추가"
- 미등록 고객: Primary Button "미등록 고객 추가"  
- 등록 고객: Success Button "신규 등록 고객 추가"
```

### 📊 Table Component Design

#### Table Container Frame
```
Auto Layout: Vertical
Width: Fill Container
Height: Auto
Background: White
Border Radius: 8px (Medium)
Shadow: Small Shadow
Border: 1px solid Gray/200 (#E5E7EB)
Overflow: Hidden
Gap: 0
```

#### Table Header Row
```
Auto Layout: Horizontal
Width: Fill Container  
Height: 48px
Background: Gray/400 (#9CA3AF)
Padding: 0
Gap: 0

각 Header Cell:
- Auto Layout: Hug Contents
- Padding: 12px (Component/S)
- Text: Body/S (14px) Semibold
- Color: White
- Text Align: Left (액션 컬럼은 Center)
```

#### Header Cell Widths (상담/미등록 고객)
```
번호: 60px
이름: 100px  
연락처: 120px
예약일시: 140px
문의경로: 80px
종목: 80px
예약목적: 100px
상담기록: 100px
작업: 180px (버튼 3개 + 간격)
```

#### Header Cell Widths (등록 고객)
```
번호: 60px
이름: 100px
연락처: 120px  
등록일: 100px
회원권: 100px
결제: 80px
트레이너: 120px
회원번호: 100px
추천: 80px
생년월일: 100px
주소: 150px (max-width, truncate)
상담기록: 100px
작업: 180px
```

#### Table Data Row
```
Auto Layout: Horizontal
Width: Fill Container
Height: Auto (최소 48px)
Background: White (홀수행) / Gray/50 (짝수행)
Border Bottom: 1px solid Gray/200 (#E5E7EB)
Gap: 0

Hover State:
- Background: Primary/50 (#EFF6FF)
- Transition: 200ms ease
```

#### Table Data Cell
```
Padding: 12px (Component/S)
Font: Body/S (14px) Regular
Color: Gray/700 (#374151)
Vertical Align: Middle
Text Align: Left (숫자는 Right)

특수 처리:
- 주소 컬럼: max-width 150px, text overflow ellipsis
- 번호 컬럼: text-align center
```

### 🔘 Action Buttons in Table

#### 상담기록 Button
```
Style: Outline Button Small
Border: 1px solid #2563EB (blue-600)
Text: #2563EB (blue-600)
Background: Transparent
Hover: Background #2563EB, Text White
Size: Small (32px height)
Text: "상담기록"
```

#### Button Group
```
Auto Layout: Horizontal
Gap: 8px (Component/XS)
Align Items: Center
Justify Content: Center
```

#### 상담 고객 액션 버튼
```
[상담완료] Button:
- Background: #16A34A (green-600)
- Hover: #15803D (green-700)
- Text: White
- Size: Small (32px height)

[수정] Button:
- Style: Outline Button Small
- Border: 1px solid #D1D5DB (gray-300)
- Text: #374151 (gray-700)
- Background: Transparent
- Hover: Background #F3F4F6 (gray-100)

[삭제] Button:
- Background: #DC2626 (red-600)
- Hover: #B91C1C (red-700)
- Text: White
- Size: Small (32px height)
```

#### 미등록 고객 액션 버튼
```
[등록완료] Button:
- Background: #2563EB (blue-600)
- Hover: #1D4ED8 (blue-700)  
- Text: White
- Size: Small (32px height)

[수정] Button:
- Style: Outline Button Small (동일)

[삭제] Button:
- Style: Destructive Button Small (동일)
```

#### 등록 고객 액션 버튼
```
[상세보기] Button:
- Background: #16A34A (green-600)
- Hover: #15803D (green-700)
- Text: White
- Size: Small (32px height)
- onClick: 사이드 패널 열기

[수정] Button:
- Style: Outline Button Small (동일)

[삭제] Button:
- Style: Destructive Button Small (동일)
```

#### Button Small 공통 Specs
```
Height: 32px
Padding: 6px 12px
Font: 12px (Caption) Semibold
Border Radius: 4px (Small)
Transition: all 200ms ease
```

### 📝 Modal Components

#### Add Customer Modal Frame
```
Frame Name: "Add Customer Modal"
Width: 768px (max-width 3xl)
Height: Auto
Background: White
Border Radius: 12px (Large)
Shadow: Extra Large Shadow

Auto Layout: Vertical
Gap: 0
Padding: 0
```

#### Modal Header
```
Auto Layout: Horizontal
Width: Fill Container
Height: Auto
Padding: 24px (Layout/S)
Border Bottom: 1px solid Gray/200 (#E5E7EB)
Justify Content: Space Between
Align Items: Center

Title: "상담 고객 등록" / "미등록 고객 등록" / "신규등록"
Style: Heading/M (20px) Semibold

Close Button: 
- Size: 32px × 32px
- Icon: X (16px)
- Style: Ghost Button
```

#### Modal Form Content
```
Auto Layout: Vertical
Width: Fill Container
Height: Auto
Padding: 24px (Layout/S)
Gap: 16px (Component/M)

Form Grid:
- 2 Columns on Desktop (md:grid-cols-2)
- 1 Column on Mobile (grid-cols-1)
- Gap: 16px (Component/M)
```

#### Form Field Component
```
Auto Layout: Vertical
Width: Fill Container
Height: Auto
Gap: 4px (Component/XS/2)

Label:
- Font: Body/S (14px) Medium
- Color: Gray/700 (#374151)

Input/Select:
- Width: Fill Container
- Height: 40px
- Style: Base Input Component
```

#### Full Width Fields
```
메모 필드 (모든 모달):
- Grid Column Span: 2 (md:col-span-2)
- Width: Fill Container

주소 필드 (등록 고객만):
- Grid Column Span: 2 (md:col-span-2)
- Width: Fill Container
```

#### Modal Footer
```
Auto Layout: Horizontal
Width: Fill Container
Height: Auto
Padding: 24px (Layout/S)
Border Top: 1px solid Gray/200 (#E5E7EB)
Justify Content: End
Gap: 8px (Component/XS)
Margin Top: 8px

Buttons:
- [취소] - Secondary Button
- [등록] - Primary/Success Button (타입별 상이)
```

### 📄 Side Panel Component (등록 고객 전용)

#### Panel Overlay
```
Position: Fixed
Width: 100vw
Height: 100vh
Background: Transparent
Z-Index: 50

Display: Flex
Justify Content: End
```

#### Panel Container
```
Width: 50% (w-1/2)
Height: 100vh
Background: White
Shadow: Extra Large Shadow

Auto Layout: Vertical
Gap: 0
Padding: 0
```

#### Panel Header
```
Auto Layout: Horizontal
Width: Fill Container
Height: Auto
Padding: 16px (Component/M)
Border Bottom: 1px solid Gray/200 (#E5E7EB)
Justify Content: Space Between
Align Items: Center

Title: "고객 상세정보"
Style: Heading/M (20px) Semibold

Close Button:
- Size: 32px × 32px  
- Icon: X (16px)
- Style: Ghost Button
```

#### Panel Content (Scrollable)
```
Flex: 1
Overflow Y: Auto
Padding: 16px (Component/M)
Gap: 16px (Component/M)

Auto Layout: Vertical
```

#### Info Card Component
```
Width: Fill Container
Height: Auto
Background: White
Border: 1px solid Gray/200 (#E5E7EB)  
Border Radius: 8px (Medium)
Padding: 16px (Component/M)

Auto Layout: Vertical
Gap: 12px (Component/S)

Card Title:
- Font: Heading/S (18px) Semibold
- Color: Gray/800 (#1F2937)
- Margin Bottom: 12px
```

#### Info Row Component
```
Auto Layout: Horizontal
Width: Fill Container
Height: Auto
Justify Content: Space Between
Align Items: Center

Label:
- Font: Body/S (14px) Regular
- Color: Gray/600 (#4B5563)

Value:
- Font: Body/S (14px) Medium  
- Color: Gray/900 (#111827)
```

#### Memo Card Special
```
Memo Content Box:
- Background: Gray/50 (#F9FAFB)
- Padding: 12px (Component/S)
- Border Radius: 6px
- Font: Body/S (14px) Regular
- Color: Gray/700 (#374151)
```

---

## 인터랙션 및 상태

### 🎯 Hover States

#### Button Hover
```
Primary Button:
- Background: Primary/600 → Primary/700
- Transition: background-color 200ms ease

Secondary Button:
- Background: Gray/100 → Gray/200
- Transition: background-color 200ms ease

Ghost Button:
- Background: Transparent → Gray/100
- Transition: background-color 200ms ease
```

#### Table Row Hover
```
Default: Background White/Gray/50
Hover: Background Primary/50 (#EFF6FF)
Transition: background-color 200ms ease
Cursor: Pointer (등록 고객만)
```

#### Input Focus
```
Border: Gray/300 → Primary/600
Ring: 0 → 3px Primary/600 at 10% opacity
Transition: border-color, box-shadow 150ms ease
```

### 🎭 Active States

#### Button Active
```
Transform: scale(0.98)
Transition: transform 100ms ease
```

#### Selected Table Row (등록 고객)
```
Background: Primary/100 (#DBEAFE)
Border Left: 4px solid Primary/600
```

### ⏳ Loading States

#### Table Loading
```
Display: Flex
Align Items: Center
Justify Content: Center
Height: 200px
Font: Body/M (16px) Regular
Color: Gray/500 (#6B7280)
Text: "로딩 중..."

Spinner (optional):
- Size: 24px × 24px
- Color: Primary/600
- Animation: spin 1s linear infinite
```

#### Button Loading
```
Disabled State: true
Opacity: 50%
Cursor: not-allowed

Loading Spinner:
- Size: 16px × 16px
- Color: White (Primary buttons) / Gray/600 (Secondary)
- Position: Replace text or left of text
```

### 📭 Empty States

#### Empty Table
```
Display: Flex
Flex Direction: Column
Align Items: Center  
Justify Content: Center
Height: 200px
Gap: 12px

Icon:
- Size: 48px × 48px
- Color: Gray/400 (#9CA3AF)
- Lucide: Users / UserX / UserPlus

Text:
- Font: Body/M (16px) Regular
- Color: Gray/500 (#6B7280)
- Text: "등록된 {타입} 고객이 없습니다."

Action (optional):
- Primary Button
- Text: "{타입} 고객 추가"
```

### ⚠️ Error States

#### Form Validation Error
```
Input Border: Error/600 (#DC2626)
Ring: 3px Error/600 at 10% opacity

Error Message:
- Font: Caption (12px) Regular  
- Color: Error/600 (#DC2626)
- Margin Top: 4px
- Text: "이 필드는 필수입니다." 등
```

#### Network Error
```
Display: Alert component
Background: Error/50 (#FEF2F2)
Border: 1px solid Error/200 (#FECACA)
Border Radius: 8px
Padding: 12px

Icon: AlertTriangle (16px) Error/600
Text: Body/S (14px) Regular, Error/700
```

---

## 반응형 디자인

### 📱 Mobile Breakpoints

#### Mobile (375px - 767px)
```
Sidebar:
- Position: Fixed
- Transform: translateX(-100%)
- Transition: transform 200ms ease
- Z-Index: 50

Navigation Bar:
- Flex Direction: Column
- Gap: 12px
- Height: Auto

Date Controls:
- Width: 100%
- Flex Direction: Column

Search:
- Width: 100%

Table:
- Overflow X: Auto
- Min Width: 800px (가로 스크롤)

Modal:
- Width: Calc(100vw - 32px)
- Max Width: None
- Margin: 16px

Form Grid:
- Grid Columns: 1
```

#### Mobile Header Adjustment
```
Page Title:
- Font: Heading/L (24px) Bold
- Margin Bottom: 16px

Action Button:
- Width: 100%
- Justify Content: Center
```

### 📟 Tablet (768px - 1023px)

#### Tablet Layout
```
Sidebar:
- Position: Relative
- Transform: translateX(0)
- Width: 256px

Content Area:
- Margin Left: 256px
- Padding: 16px (축소)

Navigation Bar:
- Flex Direction: Row
- Flex Wrap: Wrap
- Gap: 8px

Modal Form:
- Grid Columns: 2 (md:grid-cols-2)

Table:
- Overflow X: Auto (일부 컬럼)
```

### 🖥️ Desktop (1024px+)

#### Desktop Optimizations
```
All Components: Optimal display
Table: No horizontal scroll
Modal: Max Width 768px
Side Panel: 50% width
Form: 2 column grid
Navigation: Single row
```

### 🔄 Responsive Behavior Rules

#### Content Priority
```
Essential (Always Visible):
- 이름, 연락처, 작업 버튼
- 날짜 네비게이션 핵심 기능
- 주 액션 버튼

Secondary (Hidden on mobile):
- 추가 정보 컬럼들
- 보조 필터 옵션
- 부가 액션 버튼

Tertiary (Desktop only):
- 상세 메타데이터
- 확장된 통계 정보
```

#### Component Adaptation
```
Navigation Bar:
- Desktop: Single row, all controls
- Tablet: Wrapped layout  
- Mobile: Stacked layout

Table:
- Desktop: All columns visible
- Tablet: Some columns, horizontal scroll
- Mobile: Core columns only, horizontal scroll

Buttons:
- Desktop: Multiple buttons per row
- Tablet: Wrapped button groups
- Mobile: Stacked buttons, full width
```

---

## 개발 핸드오프

### 📏 Measurement Specifications

#### CSS Values Mapping
```
Figma px → CSS rem conversion:
4px = 0.25rem
8px = 0.5rem  
12px = 0.75rem
16px = 1rem (base)
20px = 1.25rem
24px = 1.5rem
32px = 2rem
48px = 3rem
64px = 4rem
96px = 6rem
```

#### Tailwind CSS Classes
```
Spacing:
- p-1 = 4px = 0.25rem
- p-2 = 8px = 0.5rem
- p-3 = 12px = 0.75rem
- p-4 = 16px = 1rem
- p-6 = 24px = 1.5rem
- p-8 = 32px = 2rem

Colors:
- gray-50 = #F9FAFB
- gray-100 = #F3F4F6  
- gray-300 = #D1D5DB
- gray-400 = #9CA3AF
- gray-500 = #6B7280
- gray-600 = #4B5563
- gray-700 = #374151
- gray-800 = #1F2937
- gray-900 = #111827

- blue-600 = #2563EB
- blue-700 = #1D4ED8
- green-600 = #16A34A
- red-600 = #DC2626
```

### 📋 Component Export Specs

#### Button Component Export
```
Component Name: Button
Variants: primary, secondary, outline, ghost, destructive
Properties: size (sm, md, lg), disabled (boolean)
States: default, hover, active, disabled

Export as: .svg for icons, CSS for styles
Developer Notes: Use Tailwind classes for implementation
```

#### Table Component Export
```
Component Name: DataTable
Properties: data (array), columns (config), onRowClick (function)
States: loading, empty, error

Export as: React component structure
CSS Classes: Custom utilities for stripe patterns
```

### 🎨 Asset Export Settings

#### Icons
```
Format: SVG
Size: 16px, 20px, 24px (multiple sizes)
Color: currentColor (inherit from parent)
Stroke Width: 2px (Lucide standard)

Export Options:
- Optimize for web
- Remove fills
- Convert strokes to paths
```

#### Images
```
Format: PNG/JPG (photography), SVG (illustrations)
Resolutions: 1x, 2x, 3x (for retina displays)
Compression: 80% quality for JPG

Placeholder Images:
- Avatar: 40px × 40px circle
- Logo: 120px × 40px rectangle
```

### 🔧 Developer Handoff Checklist

#### Design Tokens File
```
Create design-tokens.json:
{
  "colors": { ... },
  "typography": { ... },  
  "spacing": { ... },
  "shadows": { ... },
  "borderRadius": { ... }
}
```

#### Component Documentation
```
For each component:
1. Props interface (TypeScript)
2. Usage examples
3. Accessibility requirements
4. Browser compatibility notes
5. Performance considerations
```

#### Responsive Breakpoints
```
CSS Custom Properties:
--breakpoint-sm: 640px
--breakpoint-md: 768px  
--breakpoint-lg: 1024px
--breakpoint-xl: 1280px

Media Queries:
@media (min-width: 768px) { ... }
@media (min-width: 1024px) { ... }
```

#### Animation Specifications
```
Transitions:
- Duration: 150ms (fast), 200ms (normal), 300ms (slow)
- Easing: ease-in-out (default), ease-out (hover)
- Properties: background-color, transform, opacity

Hover Animations:
- Scale: transform: scale(1.05)
- Color: transition: background-color 200ms ease
```

---

## 🔗 Figma 플러그인 추천

### 필수 플러그인
```
1. Auto Layout - 자동 레이아웃 최적화
2. Figma to Code - CSS/React 코드 생성
3. Design System Organizer - 컴포넌트 정리
4. Stark - 접근성 검사
5. Figma Tokens - 디자인 토큰 관리
```

### 유용한 플러그인
```
1. Content Reel - 실제 데이터로 목업 생성
2. Unsplash - 고품질 이미지 삽입
3. Iconify - 대량의 아이콘 라이브러리
4. Table Creator - 테이블 자동 생성
5. Component Replacer - 컴포넌트 일괄 교체
```

---

**🎯 최종 체크리스트**

### 디자인 완료 전 확인사항
- [ ] 모든 색상이 디자인 시스템 컬러 팔레트 사용
- [ ] 텍스트 스타일이 정의된 Typography 사용  
- [ ] 간격이 4px 그리드 시스템 준수
- [ ] 컴포넌트가 재사용 가능하도록 설계
- [ ] 반응형 레이아웃 검증 (모바일, 태블릿, 데스크톱)
- [ ] 접근성 대비율 검사 (최소 AA 등급)
- [ ] 호버/포커스 상태 정의
- [ ] 로딩/에러/빈 상태 디자인
- [ ] 개발자 핸드오프 문서 준비

이 가이드를 따라 Figma에서 작업하시면 개발팀과의 원활한 협업과 일관성 있는 디자인 시스템을 구축할 수 있습니다! 🚀