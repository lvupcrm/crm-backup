'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api/client'
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

function KakaoPreviewCard({
  channelName,
  content,
  type,
  date,
}: {
  channelName: string;
  content: string;
  type: string;
  date: Date;
}) {
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
        <div className="text-base font-bold text-gray-900 mb-2" style={{ lineHeight: 1.2 }}>{type === 'basic' ? '알림톡 도착' : ''}</div>
        <div className="text-xs text-gray-700 whitespace-pre-line mb-3">{content || '메시지 내용을 입력하세요'}</div>
        <div className="border-t border-gray-200 my-2" />
        <div className="text-xs text-gray-500 whitespace-pre-line mb-2">{format(date, 'yyyy년 MM월 dd일')} 오전 12:14</div>
        <div className="flex flex-col gap-2 mt-2">
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
}: {
  content: string;
  type: string;
  date: Date;
}) {
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
        <div className="text-base font-bold text-gray-900 mb-2" style={{ lineHeight: 1.2 }}>친구톡 메시지</div>
        <div className="text-xs text-gray-700 whitespace-pre-line mb-3">{content || '메시지 내용을 입력하세요'}</div>
        <div className="border-t border-gray-200 my-2" />
        <div className="text-xs text-gray-500 whitespace-pre-line mb-2">{format(date, 'yyyy년 MM월 dd일')} 오전 12:14</div>
        <div className="flex flex-col gap-2 mt-2">
          <button className="w-full rounded bg-[#fee500] text-gray-900 font-bold py-1.5 text-sm border border-[#fee500] hover:bg-yellow-400 transition" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>채널 추가</button>
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
  { value: '기타', label: '기타' },
  { value: '회원', label: '회원' },
  { value: '구매', label: '구매' },
  { value: '예약', label: '예약' },
  { value: '서비스이용', label: '서비스이용' },
  { value: '리포팅', label: '리포팅' },
  { value: '배송', label: '배송' },
  { value: '법적고지', label: '법적고지' },
  { value: '업무알림', label: '업무알림' },
  { value: '쿠폰/포인트', label: '쿠폰/포인트' },
]
const CATEGORIES = [
  { value: '기타', label: '기타 (999999)' },
  { value: '이용안내/공지', label: '이용안내/공지 (004001)' },
  { value: '신청접수', label: '신청접수 (004002)' },
  { value: '처리완료', label: '처리완료 (004003)' },
  { value: '이용도구', label: '이용도구 (004004)' },
  { value: '방문서비스', label: '방문서비스 (004005)' },
  { value: '피드백 요청', label: '피드백 요청 (004006)' },
  { value: '구매감사/이용확인', label: '구매감사/이용확인 (004007)' },
  { value: '리마인드', label: '리마인드 (004008)' },
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
  function renderTypeIcon(type: any) {
    switch (type.value) {
      case 'text':
        return (
          <div className="flex flex-col items-center mt-1">
            <div className="h-2 w-8 rounded bg-yellow-300 mx-auto mb-1" />
            <div className="h-2 w-6 rounded bg-gray-300 mx-auto mb-0.5" />
            <div className="h-2 w-8 rounded bg-gray-300 mx-auto mt-1" />
          </div>
        );
      case 'image':
        return (
          <div className="flex flex-col items-center mt-1">
            <div className="h-2 w-8 rounded bg-yellow-300 mx-auto mb-1" />
            <div className="h-2 w-6 rounded bg-gray-300 mx-auto mb-0.5" />
            <div className="w-8 h-5 bg-blue-100 rounded flex items-center justify-center mt-1"><span className="text-blue-500 text-lg">🖼️</span></div>
          </div>
        );
      case 'wide_image':
        return (
          <div className="flex flex-col items-center mt-1">
            <div className="h-2 w-8 rounded bg-yellow-300 mx-auto mb-1" />
            <div className="h-2 w-6 rounded bg-gray-300 mx-auto mb-0.5" />
            <div className="h-3 w-12 rounded bg-blue-200 mx-auto mt-1" />
          </div>
        );
      case 'wide_list':
        return (
          <div className="flex flex-col items-center mt-1">
            <div className="h-2 w-8 rounded bg-yellow-300 mx-auto mb-1" />
            <div className="h-2 w-6 rounded bg-gray-300 mx-auto mb-0.5" />
            <div className="flex flex-col gap-0.5 mt-1">
              <div className="h-1 w-10 bg-gray-300 rounded mx-auto" />
              <div className="h-1 w-10 bg-gray-300 rounded mx-auto" />
              <div className="h-1 w-10 bg-gray-300 rounded mx-auto" />
            </div>
          </div>
        );
      case 'carousel':
        return (
          <div className="flex flex-col items-center mt-1">
            <div className="h-2 w-8 rounded bg-yellow-300 mx-auto mb-1" />
            <div className="h-2 w-6 rounded bg-gray-300 mx-auto mb-0.5" />
            <div className="flex flex-row gap-1 mt-1">
              <div className="w-3 h-5 bg-gray-200 rounded" />
              <div className="w-3 h-5 bg-gray-300 rounded" />
              <div className="w-3 h-5 bg-gray-400 rounded" />
            </div>
          </div>
        );
      default:
        // alimtalk types
        return (
          <div className="w-full">
            <div className="h-2 w-8 rounded bg-yellow-300 mx-auto mb-1" />
            <div className="h-2 w-6 rounded bg-gray-300 mx-auto mb-0.5" />
            {type.value === 'image' && <div className="flex justify-end"><span className="inline-block w-4 h-4 bg-blue-100 text-blue-500 text-xs rounded-full flex items-center justify-center">📷</span></div>}
            {type.value === 'list' && <div className="flex flex-col gap-0.5 mt-1"><div className="h-1 w-6 bg-gray-300 rounded mx-auto" /><div className="h-1 w-6 bg-gray-300 rounded mx-auto" /></div>}
          </div>
        );
    }
  }
  return (
    <div className="mb-4">
      <div className="font-bold text-base mb-2 text-center mx-auto w-full" style={{maxWidth:'max-content'}}>
        템플릿 유형
      </div>
      <div className={`grid ${types.length > 4 ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'} gap-3 max-w-3xl mx-auto`}>
        {types.map((type) => {
          const selected = value === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              className={`relative flex flex-col items-center justify-center rounded-2xl border bg-gray-50 px-2 py-3 shadow-lg transition-all
                ${selected ? 'border-blue-500 ring-2 ring-blue-200 bg-white' : 'border-gray-200 hover:border-blue-300'}
              `}
              style={{ minHeight: 80 }}
            >
              <div className="w-10 h-6 mb-1 flex items-center justify-center">
                {renderTypeIcon(type)}
              </div>
              <span className={`mt-1 text-sm font-bold ${selected ? 'text-blue-600' : 'text-gray-700'}`}>{type.label}</span>
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

export default function CreateTemplatePage() {
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
  })
  const [typeTab, setTypeTab] = useState('basic');
  const [secure, setSecure] = useState(false);
  const [buttons, setButtons] = useState<any[]>([]);
  const [buttonDialogOpen, setButtonDialogOpen] = useState(false);
  const [newButton, setNewButton] = useState({ type: '', name: '', link: '' });
  const [checklist, setChecklist] = useState(false);

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
    mutationFn: (data: any) => api.createTemplate(data),
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
        <p className="text-gray-600 mb-4">카카오 알림톡 템플릿은 수신자가 꼭 받아야하는 정보성 메시지만 등록이 가능합니다!<br/>(예시) 회원가입 환영, 배송정보, 쿠폰소멸안내 등등</p>
        <div className="flex flex-wrap gap-2 mb-2">
          <Button variant="outline" size="sm">템플릿 예시 입력</Button>
          <Button variant="outline" size="sm" asChild><a href="#" target="_blank">템플릿 제작 가이드</a></Button>
          <Button variant="outline" size="sm" asChild><a href="#" target="_blank">필독! 심사 가이드</a></Button>
        </div>
      </div>
      {/* 기본 정보 카드 */}
      <form onSubmit={handleSubmit} className="">
        <div className="flex flex-col md:flex-row gap-y-6 gap-x-6 mb-0 min-h-0 h-auto">
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* 2단 정보 입력 섹션 (이미지 스타일) */}
            <div className="bg-white rounded-xl shadow p-4 mb-3 mt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 왼쪽: 채널 또는 그룹 선택 */}
                <div>
                  <div className="text-gray-400 text-sm mb-1">채널 또는 그룹 선택</div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-gray-700">@ 스테이피트니스둔전점</span>
                  </div>
                  <div className="border-b border-gray-300" />
                </div>
                {/* 오른쪽: 카테고리 그룹/카테고리 선택 */}
                <div>
                  <div className="text-gray-400 text-sm mb-1">카테고리 그룹 선택</div>
                  <div className="text-xl font-semibold text-gray-700 mb-1">기타</div>
                  <div className="border-b border-gray-300 mb-3" />
                  <div className="text-gray-400 text-sm mb-1">카테고리 선택</div>
                  <div className="text-xl font-bold text-gray-800 mb-1">기타 (999999)</div>
                  <div className="border-b border-gray-300" />
                </div>
              </div>
            </div>
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
                      placeholder="예: 회원가입 환영"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content" className="mb-1 block">내용 *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={e => setFormData({ ...formData, content: e.target.value })}
                      rows={6}
                      placeholder="{홍길동}님 신규 회원가입을 환영합니다!"
                      required
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button type="button" size="sm" variant="secondary">카카오 이모티콘 추가</Button>
                      <Button type="button" size="sm" variant="secondary">😊 이모티콘 추가</Button>
                      <Button type="button" size="sm" variant="secondary">특수문자 추가</Button>
                      <Button type="button" size="sm" variant="secondary">변수 추가</Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="extra" className="mb-1 block">부가정보 (선택사항)</Label>
                    <Input
                      id="extra"
                      value={formData.extra}
                      onChange={e => setFormData({ ...formData, extra: e.target.value })}
                      placeholder="예: 고객센터 운영시간: 오전 9시 ~ 오후 5시"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Switch id="secure" checked={secure} onCheckedChange={setSecure} />
                    <Label htmlFor="secure">보안 템플릿 (사용안함)</Label>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    <b>도움말</b> '보안 템플릿' 사용 시 <b>모바일 카카오톡</b>에서만 알림톡을 열람할 수 있습니다.<br />
                    비밀번호, 인증번호 등 민감정보를 포함하는 경우 카카오측에서 보안템플릿으로 설정할 수 있습니다.
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* 친구톡 버튼 추가/삭제 */}
            {channelTab === 'friendtalk' && (
              <Card className="mb-3">
                <CardHeader className="p-4 pb-2">
                  <CardTitle>친구톡 버튼 (선택사항)</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  {buttons.length === 0 && <div className="text-gray-400 mb-2">등록된 버튼이 없습니다.</div>}
                  <div className="flex flex-col gap-2 mb-2">
                    {buttons.map((btn, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <span className="text-sm font-semibold">{btn.name}</span>
                        <span className="text-xs text-gray-500">{btn.type}</span>
                        {btn.link && <span className="text-xs text-gray-400">{btn.link}</span>}
                        <Button type="button" size="sm" variant="destructive" onClick={() => setButtons(buttons.filter((_, i) => i !== idx))}>삭제</Button>
                      </div>
                    ))}
                  </div>
                  {buttons.length < 5 && (
                    <Button type="button" size="sm" variant="outline" onClick={() => setButtonDialogOpen(true)}>
                      + 버튼 추가
                    </Button>
                  )}
                  <Dialog open={buttonDialogOpen} onOpenChange={setButtonDialogOpen}>
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle>새 버튼 추가</DialogTitle>
                      </DialogHeader>
                      <div className="mb-2">
                        <Label>버튼 종류 선택</Label>
                        <select className="w-full border rounded p-2" value={newButton.type} onChange={e => setNewButton({ ...newButton, type: e.target.value })}>
                          <option value="">버튼 종류 선택</option>
                          {BUTTON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="mb-2">
                        <Label>버튼명</Label>
                        <Input value={newButton.name} onChange={e => setNewButton({ ...newButton, name: e.target.value })} />
                      </div>
                      <div className="mb-2">
                        <Label>링크 (선택)</Label>
                        <Input value={newButton.link} onChange={e => setNewButton({ ...newButton, link: e.target.value })} />
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <Button type="button" variant="outline" onClick={() => setButtonDialogOpen(false)}>취소</Button>
                        <Button type="button" onClick={() => {
                          if (newButton.type && newButton.name) {
                            setButtons([...buttons, newButton]);
                            setNewButton({ type: '', name: '', link: '' });
                            setButtonDialogOpen(false);
                          }
                        }}>추가</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
            {/* 알림톡 버튼 추가/삭제 */}
            {channelTab === 'alimtalk' && (
              <Card className="mb-3">
                <CardHeader className="p-4 pb-2">
                  <CardTitle>알림톡 버튼 (선택사항)</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  {buttons.length === 0 && <div className="text-gray-400 mb-2">등록된 버튼이 없습니다.</div>}
                  <div className="flex flex-col gap-2 mb-2">
                    {buttons.map((btn, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <span className="text-sm font-semibold">{btn.name}</span>
                        <span className="text-xs text-gray-500">{btn.type}</span>
                        {btn.link && <span className="text-xs text-gray-400">{btn.link}</span>}
                        <Button type="button" size="sm" variant="destructive" onClick={() => setButtons(buttons.filter((_, i) => i !== idx))}>삭제</Button>
                      </div>
                    ))}
                  </div>
                  {buttons.length < 5 && (
                    <Button type="button" size="sm" variant="outline" onClick={() => setButtonDialogOpen(true)}>
                      + 버튼 추가
                    </Button>
                  )}
                  <Dialog open={buttonDialogOpen} onOpenChange={setButtonDialogOpen}>
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle>새 버튼 추가</DialogTitle>
                      </DialogHeader>
                      <div className="mb-2">
                        <Label>버튼 종류 선택</Label>
                        <select className="w-full border rounded p-2" value={newButton.type} onChange={e => setNewButton({ ...newButton, type: e.target.value })}>
                          <option value="">버튼 종류 선택</option>
                          {BUTTON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="mb-2">
                        <Label>버튼명</Label>
                        <Input value={newButton.name} onChange={e => setNewButton({ ...newButton, name: e.target.value })} />
                      </div>
                      <div className="mb-2">
                        <Label>링크 (선택)</Label>
                        <Input value={newButton.link} onChange={e => setNewButton({ ...newButton, link: e.target.value })} />
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <Button type="button" variant="outline" onClick={() => setButtonDialogOpen(false)}>취소</Button>
                        <Button type="button" onClick={() => {
                          if (newButton.type && newButton.name) {
                            setButtons([...buttons, newButton]);
                            setNewButton({ type: '', name: '', link: '' });
                            setButtonDialogOpen(false);
                          }
                        }}>추가</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
            {/* 사용 변수 목록 */}
            <Card className="mb-3">
              <CardHeader className="p-4 pb-2">
                <CardTitle>사용 변수 목록</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                {uniqueVariables.length === 0 ? (
                  <div className="text-gray-400">현재 알림톡 템플릿에 변수가 없습니다.</div>
                ) : (
                  <ul className="list-disc pl-5">
                    {uniqueVariables.map((v, i) => <li key={i} className="text-sm">{v}</li>)}
                  </ul>
                )}
              </CardContent>
            </Card>
            {/* 필수 확인 체크리스트 */}
            <Card className="mb-3">
              <CardHeader className="p-4 pb-2">
                <CardTitle>반드시 확인해주세요.</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="mb-2 text-sm text-gray-700">
                  템플릿이 아래 사유에 해당하는 경우, 예외 없이 템플릿 등록 반려됩니다.
                </div>
                <ul className="mb-2 text-xs text-gray-500 list-disc pl-5">
                  <li>정확한 수신대상 및 수신사유를 검증자가 확인하기 어려운 경우</li>
                  <li>불특정 다수에게 발송될 수 있는 홍보 및 광고성 문구 포함</li>
                  <li>혜택 제공을 조건으로 개인정보 등록 등 특정 행위를 유도</li>
                  <li>앱 설치를 유도하는 문구 포함</li>
                </ul>
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox id="checklist" checked={checklist} onCheckedChange={(checked) => setChecklist(checked === true)} />
                  <Label htmlFor="checklist">모두 확인했으며 위 항목 해당 사항 없습니다.</Label>
                </div>
              </CardContent>
            </Card>
            {/* 저장/취소 버튼 */}
            <div className="flex justify-end gap-2 mt-3 mb-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/messages/templates')}
              >
                취소
              </Button>
              <Button type="submit" disabled={!checklist || createMutation.isPending}>
                {createMutation.isPending ? '저장 중...' : '템플릿 등록 완료'}
              </Button>
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-center">
            {/* 템플릿 유형 2단 그리드 */}
            <TemplateTypeSelector value={typeTab} onChange={setTypeTab} types={typeOptions} />
            {channelTab === 'alimtalk' ? (
              <KakaoPreviewCard
                channelName={formData.branch ? `@ ${BRANCHES.find(b => b.value === formData.branch)?.label}` : '채널명'}
                content={formData.content}
                type={typeTab}
                date={new Date()}
              />
            ) : (
              <FriendTalkPreviewCard
                content={formData.content}
                type={typeTab}
                date={new Date()}
              />
            )}
            <div className="text-center text-gray-400 text-sm mt-2">미리보기는 실제 단말기와 차이가 있을 수 있습니다.</div>
          </div>
        </div>
      </form>
    </div>
  )
}