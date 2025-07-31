'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api/client'
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

function KakaoPreviewCard({
  channelName,
  content,
  type,
  date,
  emphasisTitle,
  emphasisSubtitle,
  buttons = [],
  listHeader,
  useHeader,
  useHighlight,
  highlightTitle,
  highlightDescription,
  useList,
}: {
  channelName: string;
  content: string;
  type: string;
  date: Date;
  emphasisTitle?: string;
  emphasisSubtitle?: string;
  buttons?: Array<{ name: string; mobileUrl?: string; pcUrl?: string }>;
  listHeader?: string;
  useHeader?: boolean;
  useHighlight?: boolean;
  highlightTitle?: string;
  highlightDescription?: string;
  useList?: boolean;
}) {
  const getTypeTitle = () => {
    switch (type) {
      case 'basic': return '알림톡 도착';
      case 'emphasis': return '알림톡 도착 (강조)';
      case 'image': return '알림톡 도착 (이미지)';
      case 'list': return '알림톡 도착 (리스트)';
      default: return '알림톡 도착';
    }
  };

  const renderTypeSpecificContent = () => {
    switch (type) {
      case 'emphasis':
        return (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-2">
            <div className="text-xs text-yellow-800 font-semibold mb-1">
              {emphasisTitle || "⚠️ 중요 알림"}
            </div>
            {emphasisSubtitle && (
              <div className="text-xs text-yellow-700">
                {emphasisSubtitle}
              </div>
            )}
          </div>
        );
      case 'image':
        return (
          <div className="bg-blue-50 rounded-lg p-2 mb-2 flex items-center">
            <div className="w-8 h-8 bg-blue-200 rounded mr-2 flex items-center justify-center">
              <span className="text-blue-600 text-xs">📷</span>
            </div>
            <div className="text-xs text-blue-700">이미지 첨부됨</div>
          </div>
        );
      case 'list':
        return (
          <div className="bg-gray-50 rounded-lg p-2 mb-2">
            {useHeader && listHeader && (
              <div className="text-xs font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
                {listHeader}
              </div>
            )}
            {useHighlight && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-2">
                {highlightTitle && (
                  <div className="text-xs text-yellow-800 font-semibold mb-1">
                    {highlightTitle}
                  </div>
                )}
                {highlightDescription && (
                  <div className="text-xs text-yellow-700">
                    {highlightDescription}
                  </div>
                )}
              </div>
            )}
            {useList && (
              <div className="space-y-1">
                <div className="text-xs text-gray-700">• 첫 번째 항목</div>
                <div className="text-xs text-gray-700">• 두 번째 항목</div>
                <div className="text-xs text-gray-700">• 세 번째 항목</div>
              </div>
            )}
            {!useList && (
              <div className="text-xs text-gray-500 italic">목록이 설정되지 않았습니다</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#e5efff] rounded-2xl shadow-xl overflow-hidden max-w-md w-full mx-auto mb-4" style={{ border: '1.5px solid #dbeafe', minHeight: 180 }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: '#ffe812' }}>
        <span className="text-xs font-bold text-gray-700 tracking-wide">알림톡 도착</span>
        <div style={{
          background: '#222', color: '#fff', borderRadius: '50%', width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, letterSpacing: '-1px', border: '2px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
        }}>kakao</div>
      </div>
      <div className="flex-1 flex flex-col bg-white px-5 py-4">
        <div className="text-xs text-gray-400 mb-1">{channelName}</div>
        <div className="text-base font-bold text-gray-900 mb-2" style={{ lineHeight: 1.2 }}>{getTypeTitle()}</div>
        {renderTypeSpecificContent()}
        <div className="text-xs text-gray-700 whitespace-pre-line mb-3">{content || '메시지 내용을 입력하세요'}</div>
        <div className="border-t border-gray-200 my-2" />
        <div className="text-xs text-gray-500 whitespace-pre-line mb-2">{format(date, 'yyyy년 MM월 dd일')} 오전 12:14</div>
        <div className="flex flex-col gap-2 mt-2">
          {buttons.length > 0 && (
            buttons.map((button, index) => (
              <button 
                key={index}
                className="w-full rounded bg-gray-300 text-gray-700 font-bold py-1.5 text-sm border border-gray-300 hover:bg-gray-400 transition" 
                style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
              >
                {button.name}
              </button>
            ))
          )}
          <button className="w-full rounded bg-[#ffe812] text-gray-900 font-bold py-1.5 text-sm border border-[#ffe812] hover:bg-yellow-300 transition" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>채널 추가</button>
        </div>
      </div>
    </div>
  );
}

function FriendTalkPreviewCard({
  content,
  type,
  date,
  buttons = [],
}: {
  content: string;
  type: string;
  date: Date;
  buttons?: Array<{ name: string; mobileUrl?: string; pcUrl?: string }>;
}) {
  const getTypeTitle = () => {
    switch (type) {
      case 'text': return '친구톡 메시지';
      case 'image': return '친구톡 메시지 (이미지)';
      case 'wide_image': return '친구톡 메시지 (와이드 이미지)';
      case 'wide_list': return '친구톡 메시지 (와이드 리스트)';
      case 'carousel': return '친구톡 메시지 (캐러셀)';
      default: return '친구톡 메시지';
    }
  };

  const renderTypeSpecificContent = () => {
    switch (type) {
      case 'image':
        return (
          <div className="bg-blue-50 rounded-lg p-2 mb-2 flex items-center">
            <div className="w-8 h-8 bg-blue-200 rounded mr-2 flex items-center justify-center">
              <span className="text-blue-600 text-xs">📷</span>
            </div>
            <div className="text-xs text-blue-700">이미지 첨부됨</div>
          </div>
        );
      case 'wide_image':
        return (
          <div className="bg-blue-50 rounded-lg p-2 mb-2">
            <div className="w-full h-16 bg-blue-200 rounded flex items-center justify-center">
              <span className="text-blue-600 text-xs">와이드 이미지</span>
            </div>
          </div>
        );
      case 'wide_list':
        return (
          <div className="bg-gray-50 rounded-lg p-2 mb-2">
            <div className="text-xs text-gray-700 mb-1">📋 항목 리스트</div>
            <div className="text-xs text-gray-700 mb-1">• 첫 번째 항목</div>
            <div className="text-xs text-gray-700 mb-1">• 두 번째 항목</div>
            <div className="text-xs text-gray-700">• 세 번째 항목</div>
          </div>
        );
      case 'carousel':
        return (
          <div className="bg-purple-50 rounded-lg p-2 mb-2">
            <div className="text-xs text-purple-700 mb-1">🔄 캐러셀 피드</div>
            <div className="flex gap-1">
              <div className="w-8 h-8 bg-purple-200 rounded"></div>
              <div className="w-8 h-8 bg-purple-300 rounded"></div>
              <div className="w-8 h-8 bg-purple-400 rounded"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full mx-auto mb-4" style={{ border: '1.5px solid #e5e7eb', minHeight: 180 }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: '#fee500' }}>
        <span className="text-xs font-bold text-gray-700 tracking-wide">친구톡</span>
        <div style={{
          background: '#222', color: '#fff', borderRadius: '50%', width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, letterSpacing: '-1px', border: '2px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
        }}>kakao</div>
      </div>
      <div className="flex-1 flex flex-col bg-white px-5 py-4">
        <div className="text-base font-bold text-gray-900 mb-2" style={{ lineHeight: 1.2 }}>{getTypeTitle()}</div>
        {renderTypeSpecificContent()}
        <div className="text-xs text-gray-700 whitespace-pre-line mb-3">{content || '메시지 내용을 입력하세요'}</div>
        <div className="border-t border-gray-200 my-2" />
        <div className="text-xs text-gray-500 whitespace-pre-line mb-2">{format(date, 'yyyy년 MM월 dd일')} 오전 12:14</div>
        <div className="flex flex-col gap-2 mt-2">
          {buttons.length > 0 && (
            buttons.map((button, index) => (
              <button 
                key={index}
                className="w-full rounded bg-gray-300 text-gray-700 font-bold py-1.5 text-sm border border-gray-300 hover:bg-gray-400 transition" 
                style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
              >
                {button.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function TextMessagePreviewCard({
  content,
  senderNumber,
}: {
  content: string;
  senderNumber: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full mx-auto mb-4" style={{ border: '1.5px solid #e5e7eb', minHeight: 180 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button className="text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <div className="font-bold text-gray-900">lvup_fitness</div>
            <div className="text-xs text-gray-500">{senderNumber}</div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="bg-gray-50 rounded-lg p-3 min-h-[120px]">
          <textarea
            className="w-full bg-transparent border-none outline-none resize-none text-sm text-gray-700 placeholder-gray-400"
            placeholder="대체 문자 메시지를 입력해 주세요"
            value={content}
            readOnly
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}

const VARIABLE_TAGS = [
  { label: '이름', value: '{{이름}}' },
  { label: '연락처', value: '{{연락처}}' },
  { label: '날짜', value: '{{날짜}}' },
  { label: '시간', value: '{{시간}}' },
  { label: '지점명', value: '{{지점명}}' },
  { label: '상품명', value: '{{상품명}}' },
  { label: '금액', value: '{{금액}}' },
]

// 피트니스 버전용 예시 옵션 (실제 옵션은 API 연동 필요)
const BRANCHES = [
  { value: '둔전점', label: '스테이피트니스둔전점' },
  { value: '본점', label: '스테이피트니스본점' },
]
const CATEGORY_GROUPS = [
  { value: '회원관리', label: '회원관리' },
  { value: '수업/프로그램', label: '수업/프로그램' },
  { value: '상담', label: '상담' },
  { value: 'PT', label: 'PT' },
  { value: '시설/장비', label: '시설/장비' },
  { value: '결제/요금', label: '결제/요금' },
  { value: '이벤트/프로모션', label: '이벤트/프로모션' },
  { value: '고객서비스', label: '고객서비스' },
  { value: '고객피드백', label: '고객피드백' },
  { value: '안전/보안', label: '안전/보안' },
  { value: '기타', label: '기타' },
]
const CATEGORIES = [
  { value: '회원가입', label: '회원가입 (001001)' },
  { value: '회원정보변경', label: '회원정보변경 (001002)' },
  { value: '회원권만료', label: '회원권만료 (001003)' },
  { value: '회원권갱신', label: '회원권갱신 (001004)' },
  { value: '회원탈퇴', label: '회원탈퇴 (001005)' },
  { value: '수업예약', label: '수업예약 (002001)' },
  { value: '수업취소', label: '수업취소 (002002)' },
  { value: '수업변경', label: '수업변경 (002003)' },
  { value: '수업리마인드', label: '수업리마인드 (002004)' },
  { value: '상담예약', label: '상담예약 (003001)' },
  { value: '상담취소', label: '상담취소 (003002)' },
  { value: '상담변경', label: '상담변경 (003003)' },
  { value: '상담리마인드', label: '상담리마인드 (003004)' },
  { value: 'PT예약', label: 'PT예약 (004001)' },
  { value: 'PT취소', label: 'PT취소 (004002)' },
  { value: 'PT변경', label: 'PT변경 (004003)' },
  { value: 'PT리마인드', label: 'PT리마인드 (004004)' },
  { value: '시설점검', label: '시설점검 (005001)' },
  { value: '장비고장', label: '장비고장 (005002)' },
  { value: '시설이용안내', label: '시설이용안내 (005003)' },
  { value: '결제완료', label: '결제완료 (006001)' },
  { value: '결제실패', label: '결제실패 (006002)' },
  { value: '요금안내', label: '요금안내 (006003)' },
  { value: '이벤트안내', label: '이벤트안내 (007001)' },
  { value: '프로모션', label: '프로모션 (007002)' },
  { value: '쿠폰발급', label: '쿠폰발급 (007003)' },
  { value: '고객문의', label: '고객문의 (008001)' },
  { value: '불만접수', label: '불만접수 (008002)' },
  { value: '설문조사안내', label: '설문조사 안내 (009001)' },
  { value: '만족도조사요청', label: '만족도조사 요청 (009002)' },
  { value: '리뷰요청', label: '리뷰요청 (009003)' },
  { value: '안전사고', label: '안전사고 (010001)' },
  { value: '보안알림', label: '보안알림 (010002)' },
  { value: '기타', label: '기타 (999999)' },
]

const TEMPLATE_TYPES = [
  { value: 'basic', label: '기본형', icon: null },
  { value: 'emphasis', label: '강조표기형', icon: null },
  { value: 'image', label: '이미지첨부형', icon: null },
  { value: 'list', label: '리스트형', icon: null },
];

const BUTTON_TYPES = [
  '채널추가', '웹링크', '앱링크 (URL Scheme)', '배송조회', '봇키워드', '메시지전달', '상담톡전환', '봇전환'
];

function TemplateTypeSelector({ value, onChange, types }: { value: string; onChange: (v: string) => void; types: any[] }) {
  return (
    <div className="mb-4">
      <div className={`grid ${types.length > 4 ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'} gap-3 max-w-3xl mx-auto`}>
        {types.map((type) => {
          const selected = value === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              className={`relative flex flex-col items-center justify-center rounded-2xl border bg-gray-50 px-4 py-4 shadow-lg transition-all
                ${selected ? 'border-blue-500 ring-2 ring-blue-200 bg-white' : 'border-gray-200 hover:border-blue-300'}
              `}
              style={{ minHeight: 60 }}
            >
              <span className={`text-sm font-bold ${selected ? 'text-blue-600' : 'text-gray-700'}`}>{type.label}</span>
              <span className={`absolute top-1 right-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected ? 'border-pink-500 bg-white' : 'border-gray-300 bg-white'}`}>
                {selected && <span className="w-2 h-2 rounded-full bg-pink-500 block" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CreateTemplatePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [channelTab, setChannelTab] = useState<'alimtalk' | 'friendtalk'>('alimtalk');
  const [formData, setFormData] = useState({
    templateName: '',
    channel: '알림톡',
    templateCode: '',
    content: '',
    branch: BRANCHES[0].value,
    categoryGroup: CATEGORY_GROUPS[0].value,
    category: CATEGORIES[0].value,
    type: 'basic',
    extra: '',
    emphasisTitle: '',
    emphasisSubtitle: '',
    useButton: false,
    useFallback: false,
    reviewerComment: '',
    // List type fields
    useHeader: false,
    listHeader: '',
    useHighlight: false,
    highlightTitle: '',
    highlightDescription: '',
    useList: false,
    // Settings fields
    isPromotional: false,
    isAgeVerification: false,
    // Wide list fields
    useWideHeader: false,
    wideListHeader: '',
    useWideHighlight: false,
    wideHighlightTitle: '',
    wideHighlightDescription: '',
    useWideList: false,
    // Carousel fields
    carouselItems: [] as Array<{id: string; title: string; content: string; image: string | null}>,
  })
  const [typeTab, setTypeTab] = useState('basic');
  const [secure, setSecure] = useState(false);
  const [buttons, setButtons] = useState<any[]>([]);
  const [buttonDialogOpen, setButtonDialogOpen] = useState(false);
  const [newButton, setNewButton] = useState({ type: '', name: '', link: '' });
  const [checklist, setChecklist] = useState(false);
  const [variableDialogOpen, setVariableDialogOpen] = useState(false);
  const [newVariableName, setNewVariableName] = useState('');
  const [buttonConfig, setButtonConfig] = useState({
    name: '',
    mobileUrl: '',
    pcUrl: ''
  });
  const [buttonConfigs, setButtonConfigs] = useState<Array<{
    id: string;
    name: string;
    mobileUrl: string;
    pcUrl: string;
    isExpanded: boolean;
  }>>([]);

  // URL 파라미터에서 예시 데이터 로드
  useEffect(() => {
    const name = searchParams.get('name');
    const content = searchParams.get('content');
    const channel = searchParams.get('channel');
    const type = searchParams.get('type');
    const variables = searchParams.get('variables');

    if (name || content || channel || type) {
      setFormData(prev => ({
        ...prev,
        templateName: name || prev.templateName,
        content: content || prev.content,
        channel: channel || prev.channel,
        type: type || prev.type,
      }));
      if (channel === '알림톡') setChannelTab('alimtalk');
      if (channel === '친구톡') setChannelTab('friendtalk');
      if (type) {
        setTypeTab(type);
      }
    }
  }, [searchParams]);

  // 변수 추출
  const variables = (formData.content.match(/{{[^}]+}}/g) || []);
  const uniqueVariables = [...new Set(variables)];

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/messages/templates', data);
      return response;
    },
    onSuccess: () => {
      router.push('/messages/templates')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      ...formData,
      type: typeTab,
      extra: formData.extra,
      secure,
      buttons,
      variables: uniqueVariables,
    })
  }

  const FRIENDTALK_TEMPLATE_TYPES = [
    { value: "text", label: "텍스트형", icon: null },
    { value: "image", label: "이미지형", icon: null },
    { value: "wide_image", label: "와이드 이미지형", icon: null },
    { value: "wide_list", label: "와이드 아이템 리스트형", icon: null },
    { value: "carousel", label: "캐러셀 피드형", icon: null },
  ];

  const typeOptions = channelTab === "alimtalk" ? TEMPLATE_TYPES : FRIENDTALK_TEMPLATE_TYPES;

  return (
    <div className="max-w-4xl mx-auto px-0 py-4 sm:px-0 md:px-0 md:py-6">
      {/* 상단 탭: 알림톡 만들기/친구톡 만들기 */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-4 w-full max-w-2xl justify-center">
          <button
            type="button"
            onClick={() => { setChannelTab('alimtalk'); setFormData(f => ({ ...f, channel: '알림톡' })); }}
            className={`flex-1 min-w-[180px] max-w-xs h-10 px-4 rounded-full text-base font-bold transition-all border-2
              ${channelTab === 'alimtalk' ? 'bg-white border-blue-400 text-blue-700 shadow-md' : 'bg-gray-100 border-gray-200 text-gray-400'}
            `}
          >
            알림톡 만들기
          </button>
          <button
            type="button"
            onClick={() => { setChannelTab('friendtalk'); setFormData(f => ({ ...f, channel: '친구톡' })); }}
            className={`flex-1 min-w-[180px] max-w-xs h-10 px-4 rounded-full text-base font-bold transition-all border-2
              ${channelTab === 'friendtalk' ? 'bg-white border-blue-400 text-blue-700 shadow-md' : 'bg-gray-100 border-gray-200 text-gray-400'}
            `}
          >
            친구톡 만들기
          </button>
        </div>
      </div>
      {/* 상단 안내/가이드 */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">새 템플릿 등록하기</h1>
        {channelTab === 'alimtalk' ? (
          <p className="text-gray-600 mb-4">카카오 알림톡 템플릿은 수신자가 꼭 받아야하는 정보성 메시지만 등록이 가능합니다!<br/>(예시) 회원가입 환영, 수업 일정 안내, PT 예약 확인, 회원권 만료 알림 등등</p>
        ) : (
          <p className="text-gray-600 mb-4">카카오 친구톡 템플릿은 마케팅, 이벤트, 프로모션 등 다양한 목적으로 활용할 수 있습니다!<br/>(예시) 이벤트 안내, 프로모션 소식, 새로운 프로그램 소개, 회원 혜택 안내 등등</p>
        )}
        <div className="flex flex-wrap gap-2 mb-2">
          <Button variant="outline" size="sm" asChild><a href="#" target="_blank">템플릿 제작 가이드</a></Button>
        </div>
      </div>
      {/* 기본 정보 카드 */}
      <form onSubmit={handleSubmit} className="">
        <div className="flex flex-col md:flex-row gap-y-6 gap-x-6 mb-0 min-h-0 h-auto">
                    <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* 템플릿 정보 섹션 - 알림톡에서만 표시 */}
            {channelTab === 'alimtalk' && (
              <Card className="mb-3">
                <CardHeader className="p-4 pb-2">
                  <CardTitle>템플릿 정보</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex flex-col gap-4">
                    <div>
                      <Label htmlFor="categoryGroup" className="mb-1 block">카테고리</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select value={formData.categoryGroup} onValueChange={(value) => {
                          // 카테고리 그룹이 변경되면 카테고리도 초기화
                          setFormData({ ...formData, categoryGroup: value, category: '' });
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리 그룹 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORY_GROUPS.map((group) => (
                              <SelectItem key={group.value} value={group.value}>
                                {group.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.filter(category => {
                              const categoryGroup = formData.categoryGroup;
                              if (categoryGroup === '회원관리') {
                                return category.value.startsWith('회원');
                              } else if (categoryGroup === '수업/프로그램') {
                                return category.value.includes('수업') && !category.value.includes('PT');
                              } else if (categoryGroup === '상담') {
                                return category.value.includes('상담');
                              } else if (categoryGroup === 'PT') {
                                return category.value.includes('PT');
                              } else if (categoryGroup === '시설/장비') {
                                return category.value.includes('시설') || category.value.includes('장비');
                              } else if (categoryGroup === '결제/요금') {
                                return category.value.includes('결제') || category.value.includes('요금');
                              } else if (categoryGroup === '이벤트/프로모션') {
                                return category.value.includes('이벤트') || category.value.includes('프로모션') || category.value.includes('쿠폰');
                              } else if (categoryGroup === '고객서비스') {
                                return category.value.includes('고객') || category.value.includes('불만');
                              } else if (categoryGroup === '고객피드백') {
                                return category.value.includes('설문') || category.value.includes('만족도') || category.value.includes('리뷰');
                              } else if (categoryGroup === '안전/보안') {
                                return category.value.includes('안전') || category.value.includes('보안');
                              } else if (categoryGroup === '기타') {
                                return category.value === '기타';
                              }
                              return true;
                            }).map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 템플릿 유형 선택 */}
            <Card className="mb-3">
              <CardHeader className="p-4 pb-2">
                <CardTitle>템플릿 유형</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <TemplateTypeSelector value={typeTab} onChange={setTypeTab} types={typeOptions} />
              </CardContent>
            </Card>

            {/* 템플릿 내용 입력 */}
            <Card className="mb-3">
              <CardHeader className="p-4 pb-2">
                <CardTitle>템플릿 내용</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="templateName" className="mb-1 block">템플릿 이름 (선택사항)</Label>
                    <Input
                      id="templateName"
                      value={formData.templateName}
                      onChange={e => setFormData({ ...formData, templateName: e.target.value })}
                      placeholder={
                        channelTab === 'alimtalk'
                          ? typeTab === 'basic'
                            ? "예: 회원가입 환영"
                            : typeTab === 'emphasis'
                            ? "예: 회원권 만료 알림"
                            : typeTab === 'image'
                            ? "예: 프로그램 안내"
                            : typeTab === 'list'
                            ? "예: 수업 일정 안내"
                            : "예: 회원가입 환영"
                          : typeTab === 'text'
                          ? "예: 친구톡 안내"
                          : typeTab === 'image'
                          ? "예: 프로그램 이미지 안내"
                          : typeTab === 'wide_image'
                          ? "예: 와이드 이미지 프로그램"
                          : typeTab === 'wide_list'
                          ? "예: 프로그램 리스트"
                          : typeTab === 'carousel'
                          ? "예: 캐러셀 프로그램"
                          : "예: 친구톡 안내"
                      }
                    />
                  </div>
                  {/* Type-specific content */}
                  {typeTab === 'emphasis' && channelTab === 'alimtalk' && (
                    <>
                      <div>
                        <Label htmlFor="emphasisTitle" className="mb-1 block">강조표기 제목</Label>
                        <Input
                          id="emphasisTitle"
                          value={formData.emphasisTitle || ''}
                          onChange={e => setFormData({ ...formData, emphasisTitle: e.target.value })}
                          placeholder="예: 환영합니다!"
                          maxLength={50}
                        />
                        <div className="text-xs text-gray-500 mt-1">최대 50자 이내 (변수 사용 가능)</div>
                      </div>
                      <div>
                        <Label htmlFor="emphasisSubtitle" className="mb-1 block">강조표기 보조문구</Label>
                        <Textarea
                          id="emphasisSubtitle"
                          value={formData.emphasisSubtitle || ''}
                          onChange={e => setFormData({ ...formData, emphasisSubtitle: e.target.value })}
                          placeholder="예: 솔라피에 오신걸 진심으로 환영합니다"
                          rows={2}
                          maxLength={50}
                        />
                        <div className="text-xs text-gray-500 mt-1">최대 50자 이내</div>
                      </div>
                    </>
                  )}
                  

                  
                  {typeTab === 'list' && channelTab === 'alimtalk' && (
                    <div>
                      <Label className="mb-1 block">아이템 리스트 설정</Label>
                      
                      {/* Header 사용 */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Checkbox 
                            id="useHeader" 
                            checked={formData.useHeader || false}
                            onCheckedChange={(checked) => setFormData({ ...formData, useHeader: checked as boolean })}
                          />
                          <Label htmlFor="useHeader" className="text-sm font-medium">헤더 사용</Label>
                          <span className="text-gray-400 text-sm">?</span>
                        </div>
                        <Input
                          placeholder="헤더 입력. 변수 포함 가능. (16자 이내)"
                          value={formData.listHeader || ''}
                          onChange={e => setFormData({ ...formData, listHeader: e.target.value })}
                          maxLength={16}
                          disabled={!formData.useHeader}
                        />
                        <div className="text-xs text-gray-500 mt-1">16자 이내</div>
                      </div>

                      {/* 하이라이트 사용 */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Checkbox 
                            id="useHighlight" 
                            checked={formData.useHighlight || false}
                            onCheckedChange={(checked) => setFormData({ ...formData, useHighlight: checked as boolean })}
                          />
                          <Label htmlFor="useHighlight" className="text-sm font-medium">하이라이트 사용</Label>
                          <span className="text-gray-400 text-sm">?</span>
                        </div>
                        
                        {formData.useHighlight && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="highlightTitle" className="mb-1 block">하이라이트 제목</Label>
                              <Input
                                id="highlightTitle"
                                placeholder="하이라이트 제목"
                                value={formData.highlightTitle || ''}
                                onChange={e => setFormData({ ...formData, highlightTitle: e.target.value })}
                                maxLength={30}
                              />
                              <div className="text-xs text-gray-500 mt-1">최대 30자 이내 (변수 포함 가능)</div>
                            </div>
                            
                            <div>
                              <Label htmlFor="highlightDescription" className="mb-1 block">하이라이트 설명</Label>
                              <Input
                                id="highlightDescription"
                                placeholder="하이라이트 설명"
                                value={formData.highlightDescription || ''}
                                onChange={e => setFormData({ ...formData, highlightDescription: e.target.value })}
                                maxLength={16}
                              />
                              <div className="text-xs text-gray-500 mt-1">최대 16자 이내 (변수 포함 불가)</div>
                            </div>
                            
                            <div>
                              <Label className="mb-1 block">하이라이트 썸네일 (선택사항)</Label>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="text-gray-400 mb-2">
                                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                </div>
                                <div className="text-sm font-medium text-gray-600 mb-1">썸네일 업로드 (JPEG, PNG)</div>
                                <div className="text-xs text-gray-500">이곳에 파일 끌어오기 혹은 찾아보기</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 목록 사용 */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Checkbox 
                            id="useList" 
                            checked={formData.useList || false}
                            onCheckedChange={(checked) => setFormData({ ...formData, useList: checked as boolean })}
                          />
                          <Label htmlFor="useList" className="text-sm font-medium">목록 사용</Label>
                          <span className="text-gray-400 text-sm">?</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">(최소 2개 이상)</div>
                        {!formData.useList && (
                          <div className="text-sm text-gray-500">현재 아이템 목록을 사용하지 않습니다.</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {typeTab === 'wide_list' && channelTab === 'friendtalk' && (
                    <div>
                      <Label className="mb-1 block">와이드 아이템 리스트 설정</Label>
                      
                      {/* Header 사용 */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Checkbox 
                            id="useWideHeader" 
                            checked={formData.useWideHeader || false}
                            onCheckedChange={(checked) => setFormData({ ...formData, useWideHeader: checked as boolean })}
                          />
                          <Label htmlFor="useWideHeader" className="text-sm font-medium">헤더 사용</Label>
                          <span className="text-gray-400 text-sm">?</span>
                        </div>
                        <Input
                          placeholder="헤더 입력. 변수 포함 가능. (16자 이내)"
                          value={formData.wideListHeader || ''}
                          onChange={e => setFormData({ ...formData, wideListHeader: e.target.value })}
                          maxLength={16}
                          disabled={!formData.useWideHeader}
                        />
                        <div className="text-xs text-gray-500 mt-1">16자 이내</div>
                      </div>

                      {/* 하이라이트 사용 */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Checkbox 
                            id="useWideHighlight" 
                            checked={formData.useWideHighlight || false}
                            onCheckedChange={(checked) => setFormData({ ...formData, useWideHighlight: checked as boolean })}
                          />
                          <Label htmlFor="useWideHighlight" className="text-sm font-medium">하이라이트 사용</Label>
                          <span className="text-gray-400 text-sm">?</span>
                        </div>
                        
                        {formData.useWideHighlight && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="wideHighlightTitle" className="mb-1 block">하이라이트 제목</Label>
                              <Input
                                id="wideHighlightTitle"
                                placeholder="하이라이트 제목"
                                value={formData.wideHighlightTitle || ''}
                                onChange={e => setFormData({ ...formData, wideHighlightTitle: e.target.value })}
                                maxLength={30}
                              />
                              <div className="text-xs text-gray-500 mt-1">최대 30자 이내 (변수 포함 가능)</div>
                            </div>
                            
                            <div>
                              <Label htmlFor="wideHighlightDescription" className="mb-1 block">하이라이트 설명</Label>
                              <Input
                                id="wideHighlightDescription"
                                placeholder="하이라이트 설명"
                                value={formData.wideHighlightDescription || ''}
                                onChange={e => setFormData({ ...formData, wideHighlightDescription: e.target.value })}
                                maxLength={16}
                              />
                              <div className="text-xs text-gray-500 mt-1">최대 16자 이내 (변수 포함 불가)</div>
                            </div>
                            
                            <div>
                              <Label className="mb-1 block">하이라이트 썸네일 (선택사항)</Label>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="text-gray-400 mb-2">
                                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                </div>
                                <div className="text-sm font-medium text-gray-600 mb-1">썸네일 업로드 (JPEG, PNG)</div>
                                <div className="text-xs text-gray-500">이곳에 파일 끌어오기 혹은 찾아보기</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 목록 사용 */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Checkbox 
                            id="useWideList" 
                            checked={formData.useWideList || false}
                            onCheckedChange={(checked) => setFormData({ ...formData, useWideList: checked as boolean })}
                          />
                          <Label htmlFor="useWideList" className="text-sm font-medium">목록 사용</Label>
                          <span className="text-gray-400 text-sm">?</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">(최소 2개 이상)</div>
                        {!formData.useWideList && (
                          <div className="text-sm text-gray-500">현재 아이템 목록을 사용하지 않습니다.</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {typeTab === 'carousel' && channelTab === 'friendtalk' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <Label className="text-sm font-medium block mb-1">캐러셀</Label>
                          <div className="text-xs text-gray-500">최소 2개에서 10개까지 만들 수 있어요</div>
                        </div>
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="outline" 
                          className="text-xs bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                          onClick={() => {
                            if (formData.carouselItems && formData.carouselItems.length < 10) {
                              const newItem = {
                                id: Date.now().toString(),
                                title: '',
                                content: '',
                                image: null
                              };
                              setFormData({ 
                                ...formData, 
                                carouselItems: [...(formData.carouselItems || []), newItem] 
                              });
                            }
                          }}
                        >
                          추가
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {(formData.carouselItems || []).map((item, index) => (
                          <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start gap-3">
                              {/* Image Placeholder */}
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              
                              {/* Content Inputs */}
                              <div className="flex-1 space-y-2">
                                <Input
                                  placeholder="제목을 입력해주세요"
                                  value={item.title}
                                  onChange={(e) => {
                                    const updatedItems = [...(formData.carouselItems || [])];
                                    updatedItems[index] = { ...item, title: e.target.value };
                                    setFormData({ ...formData, carouselItems: updatedItems });
                                  }}
                                  maxLength={50}
                                />
                                <Input
                                  placeholder="내용을 입력해주세요"
                                  value={item.content}
                                  onChange={(e) => {
                                    const updatedItems = [...(formData.carouselItems || [])];
                                    updatedItems[index] = { ...item, content: e.target.value };
                                    setFormData({ ...formData, carouselItems: updatedItems });
                                  }}
                                  maxLength={100}
                                />
                              </div>
                              
                              {/* Drag Handle and Delete */}
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-6 h-6 flex items-center justify-center cursor-move">
                                  <div className="w-4 h-2 flex flex-col gap-0.5">
                                    <div className="w-full h-0.5 bg-gray-400"></div>
                                    <div className="w-full h-0.5 bg-gray-400"></div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedItems = (formData.carouselItems || []).filter((_, i) => i !== index);
                                    setFormData({ ...formData, carouselItems: updatedItems });
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Add initial items if none exist */}
                        {(!formData.carouselItems || formData.carouselItems.length === 0) && (
                          <div className="text-center text-gray-500 text-sm py-4">
                            캐러셀 아이템을 추가해주세요
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* 이미지 업로드 - 이미지형에서만 표시 */}
                  {(typeTab === 'image' || typeTab === 'wide_image') && (
                    <div className="mb-4">
                      <Label className="mb-1 block">이미지 업로드</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                        <div className="text-blue-600 font-medium mb-2">파일을 선택하거나 끌어다 놓기</div>
                        <div className="text-sm text-gray-600">가로 500px 이상의 jpg, png 파일, 가로 세로 비율 2:1 또는 3:4 (최대 500KB)</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Common content section for all types */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="content" className="block">본문</Label>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => setVariableDialogOpen(true)}
                      >
                        변수 추가
                      </Button>
                    </div>
                    <div className="relative">
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                        rows={6}
                        placeholder="메시지 내용을 입력하세요"
                        required
                        maxLength={1000}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                        {formData.content.length}/1000
                      </div>
                    </div>
                  </div>
                  {/* 부가정보 - 알림톡에서만 표시 */}
                  {channelTab === 'alimtalk' && (
                    <div>
                      <Label htmlFor="extra" className="mb-1 block">부가정보 (선택사항)</Label>
                      <Input
                        id="extra"
                        value={formData.extra}
                        onChange={e => setFormData({ ...formData, extra: e.target.value })}
                        placeholder={
                          typeTab === 'basic'
                            ? "예: 고객센터 운영시간: 오전 9시 ~ 오후 5시"
                            : typeTab === 'emphasis'
                            ? "예: 긴급 연락처: 010-1234-5678"
                            : typeTab === 'image'
                            ? "예: 프로그램 상세 정보"
                            : typeTab === 'list'
                            ? "예: 수업 시간표 및 장소 안내"
                            : "예: 고객센터 운영시간: 오전 9시 ~ 오후 5시"
                        }
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="useButton" className="text-sm font-medium">버튼 사용</Label>
                    <Switch id="useButton" checked={formData.useButton || false} onCheckedChange={(checked) => setFormData({ ...formData, useButton: checked })} />
                  </div>
                  {formData.useButton && (
                    <div className="space-y-3">
                      {buttonConfigs.map((config, index) => (
                        <div key={config.id} className="bg-white border border-gray-200 rounded-lg">
                          {/* Header */}
                          <div 
                            className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                            onClick={() => setButtonConfigs(prev => prev.map((c, i) => 
                              i === index ? { ...c, isExpanded: !c.isExpanded } : c
                            ))}
                          >
                            <span className="font-medium text-gray-700">
                              {config.name || `버튼 ${index + 1}`}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 flex items-center justify-center">
                                <div className="w-3 h-0.5 bg-gray-400"></div>
                              </div>
                              <div className="w-4 h-4 flex items-center justify-center">
                                <div className="w-3 h-0.5 bg-gray-400"></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Content */}
                          {config.isExpanded && (
                            <div className="p-4 space-y-4">
                              <div>
                                <Label className="text-sm font-medium block mb-1">이름</Label>
                                <div className="relative">
                                  <Input
                                    value={config.name}
                                    onChange={(e) => setButtonConfigs(prev => prev.map((c, i) => 
                                      i === index ? { ...c, name: e.target.value } : c
                                    ))}
                                    placeholder="버튼 이름을 입력해 주세요"
                                    maxLength={14}
                                    className="pr-12"
                                  />
                                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                                    {config.name.length}/14
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium block mb-1">Mobile URL</Label>
                                <Input
                                  value={config.mobileUrl}
                                  onChange={(e) => setButtonConfigs(prev => prev.map((c, i) => 
                                    i === index ? { ...c, mobileUrl: e.target.value } : c
                                  ))}
                                  placeholder="http(s)://를 포함하여 URL을 입력해 주세요"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium block mb-1">PC URL</Label>
                                <Input
                                  value={config.pcUrl}
                                  onChange={(e) => setButtonConfigs(prev => prev.map((c, i) => 
                                    i === index ? { ...c, pcUrl: e.target.value } : c
                                  ))}
                                  placeholder="http(s)://를 포함하여 URL을 입력해 주세요 (선택 사항)"
                                />
                              </div>
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => setButtonConfigs(prev => prev.filter((_, i) => i !== index))}
                                  className="flex flex-col items-center text-red-500 hover:text-red-700"
                                >
                                  <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  <span className="text-xs">삭제</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-gray-100 hover:bg-gray-200 text-black border-gray-300"
                        onClick={() => {
                          const newConfig = {
                            id: Date.now().toString(),
                            name: '',
                            mobileUrl: '',
                            pcUrl: '',
                            isExpanded: true
                          };
                          setButtonConfigs(prev => [...prev, newConfig]);
                        }}
                      >
                        <span className="mr-2">+</span>
                        버튼
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="useFallback" className="text-sm font-medium">대체 문자 메시지 사용</Label>
                      <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">?</span>
                      </div>
                    </div>
                    <Switch id="useFallback" checked={formData.useFallback || false} onCheckedChange={(checked) => setFormData({ ...formData, useFallback: checked })} />
                  </div>
                  
                  {/* 설정 - 친구톡에서만 표시 */}
                  {channelTab === 'friendtalk' && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium mb-3 block">설정</Label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id="isPromotional" 
                            checked={formData.isPromotional || false}
                            onCheckedChange={(checked) => setFormData({ ...formData, isPromotional: checked as boolean })}
                          />
                          <Label htmlFor="isPromotional" className="text-sm font-medium">광고성 메시지</Label>
                          <span className="text-gray-400 text-sm">?</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id="isAgeVerification" 
                            checked={formData.isAgeVerification || false}
                            onCheckedChange={(checked) => setFormData({ ...formData, isAgeVerification: checked as boolean })}
                          />
                          <Label htmlFor="isAgeVerification" className="text-sm font-medium">연령 인증 메시지</Label>
                          <span className="text-gray-400 text-sm">?</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* 보안 템플릿 - 알림톡에서만 표시 */}
                  {channelTab === 'alimtalk' && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Switch id="secure" checked={secure} onCheckedChange={setSecure} />
                        <Label htmlFor="secure">보안 템플릿 (사용안함)</Label>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        <b>도움말</b> '보안 템플릿' 사용 시 <b>모바일 카카오톡</b>에서만 알림톡을 열람할 수 있습니다.<br />
                        비밀번호, 인증번호 등 민감정보를 포함하는 경우 카카오측에서 보안템플릿으로 설정할 수 있습니다.
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* 검수 담당자에게 의견 전달하기 - 알림톡에서만 표시 */}
            {channelTab === 'alimtalk' && (
              <Card className="mb-3">
                <CardHeader className="p-4 pb-2">
                  <CardTitle>검수 담당자에게 의견 전달하기</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="relative">
                    <Textarea
                      id="reviewerComment"
                      value={formData.reviewerComment || ''}
                      onChange={e => setFormData({ ...formData, reviewerComment: e.target.value })}
                      placeholder="검수 담당자에게 의견을 전달할 수 있습니다. (선택 사항)"
                      rows={4}
                      maxLength={500}
                      className="resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {(formData.reviewerComment || '').length}/500
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ex:) 회원 가입 시, 회원이 받게 되는 혜택을 안내하는 템플릿입니다.
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 저장/취소 버튼 */}
            <div className="flex justify-end gap-2 mt-3 mb-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/messages/templates')}
              >
                취소
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // 임시저장 로직 구현
                  console.log('임시저장 기능');
                }}
              >
                임시저장
              </Button>
              <Button type="submit" disabled={!checklist || createMutation.isPending}>
                {createMutation.isPending ? '저장 중...' : '템플릿 등록 완료'}
              </Button>
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-center">
            {/* 미리보기 탭 */}
            <div className="w-full max-w-md mb-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    !formData.useFallback 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setFormData({ ...formData, useFallback: false })}
                >
                  <div className={`w-4 h-4 ${!formData.useFallback ? 'text-blue-600' : 'text-gray-400'}`}>
                    💬
                  </div>
                  {channelTab === 'alimtalk' ? '알림톡' : '친구톡'}
                </button>
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    formData.useFallback 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setFormData({ ...formData, useFallback: true })}
                >
                  <div className={`w-4 h-4 ${formData.useFallback ? 'text-blue-600' : 'text-gray-400'}`}>
                    📱
                  </div>
                  대체 문자 메시지
                </button>
              </div>
            </div>
            
            {/* 미리보기 카드 */}
            {!formData.useFallback ? (
              channelTab === 'alimtalk' ? (
                <KakaoPreviewCard
                  channelName={formData.branch ? `@ ${BRANCHES.find(b => b.value === formData.branch)?.label}` : '채널명'}
                  content={formData.content}
                  type={typeTab}
                  date={new Date()}
                  emphasisTitle={formData.emphasisTitle}
                  emphasisSubtitle={formData.emphasisSubtitle}
                  buttons={buttonConfigs.filter(config => config.name.trim()).map(config => ({
                    name: config.name,
                    mobileUrl: config.mobileUrl,
                    pcUrl: config.pcUrl
                  }))}
                  listHeader={formData.listHeader}
                  useHeader={formData.useHeader}
                  useHighlight={formData.useHighlight}
                  highlightTitle={formData.highlightTitle}
                  highlightDescription={formData.highlightDescription}
                  useList={formData.useList}
                />
              ) : (
                <FriendTalkPreviewCard
                  content={formData.content}
                  type={typeTab}
                  date={new Date()}
                  buttons={buttonConfigs.filter(config => config.name.trim()).map(config => ({
                    name: config.name,
                    mobileUrl: config.mobileUrl,
                    pcUrl: config.pcUrl
                  }))}
                />
              )
            ) : (
              <TextMessagePreviewCard
                content={formData.content}
                senderNumber={formData.branch ? `# {${BRANCHES.find(b => b.value === formData.branch)?.label}}` : '# {고객사발신번호}'}
              />
            )}
            <div className="text-center text-gray-400 text-sm mt-2">미리보기는 실제 단말기와 차이가 있을 수 있습니다.</div>
          </div>
        </div>
      </form>
      
      {/* 변수 추가 다이얼로그 */}
      <Dialog open={variableDialogOpen} onOpenChange={setVariableDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold">내용에 변수 추가</DialogTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setVariableDialogOpen(false)}
                className="h-6 w-6 p-0"
              >
                ✕
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newVariableName" className="text-sm font-medium">새로운 변수 이름</Label>
              <Input
                id="newVariableName"
                value={newVariableName}
                onChange={(e) => setNewVariableName(e.target.value)}
                placeholder="변수명"
                className="mt-1"
              />
            </div>
            <div className="text-sm text-gray-600">
              변수명은 API 요청시 사용될 수 있습니다.
            </div>
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => {
                  if (newVariableName.trim()) {
                    const variableText = `{{${newVariableName.trim()}}}`;
                    setFormData({
                      ...formData,
                      content: formData.content + variableText
                    });
                    setNewVariableName('');
                    setVariableDialogOpen(false);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                변수 추가
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t">
            <div className="flex items-center gap-1">
              <span>🌙</span>
              <span>채팅 문의</span>
            </div>
            <div>닫기 ESC</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CreateTemplatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateTemplatePageContent />
    </Suspense>
  )
}