"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function BulkMessagePage() {
  const [messageType, setMessageType] = useState("sms");
  const [senderNumber, setSenderNumber] = useState("010-8762-9905");
  const [recipientNumber, setRecipientNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipients, setRecipients] = useState<Array<{number: string, name: string}>>([]);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [isPromotional, setIsPromotional] = useState(true);
  const [promotionalServiceName, setPromotionalServiceName] = useState("스테이피트니스둔전점");
  const [selectedTemplate, setSelectedTemplate] = useState<{id: string, name: string, type: string, content: string} | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [saveToAddressBook, setSaveToAddressBook] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [contactText, setContactText] = useState("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showSaveContent, setShowSaveContent] = useState(false);
  const [showRecentSent, setShowRecentSent] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [savedContents, setSavedContents] = useState<Array<{id: string, title: string, content: string, date: string}>>([
    { id: "1", title: "회원가입 환영 메시지", content: "안녕하세요! 회원가입을 환영합니다.", date: "2025.01.15" },
    { id: "2", title: "수업 일정 안내", content: "오늘 수업 일정을 안내드립니다.", date: "2025.01.14" },
    { id: "3", title: "PT 예약 확인", content: "PT 예약이 확인되었습니다.", date: "2025.01.13" }
  ]);
  const [recentSentContents, setRecentSentContents] = useState<Array<{id: string, title: string, content: string, date: string, timeAgo: string}>>([
    { id: "1", title: "PT 만족도 조사 (이다솔)", content: "안녕하세요! PT 만족도 조사를 진행합니다.", date: "2025-07-16", timeAgo: "5시간 전" },
    { id: "2", title: "회원가입 환영 메시지", content: "회원가입을 환영합니다!", date: "2025-06-16", timeAgo: "1개월 전" },
    { id: "3", title: "수업 일정 안내", content: "수업 일정을 안내드립니다.", date: "2025-06-16", timeAgo: "1개월 전" },
    { id: "4", title: "프로모션 소식", content: "특별한 프로모션을 확인하세요.", date: "2025-06-16", timeAgo: "1개월 전" },
    { id: "5", title: "새로운 프로그램", content: "새로운 프로그램을 소개합니다.", date: "2025-06-16", timeAgo: "1개월 전" },
  ]);

  // 주소록 데이터 (실제로는 API에서 가져올 데이터)
  const addressBook = [
    { id: "1", name: "김철수", number: "010-1234-5678", group: "VIP 회원" },
    { id: "2", name: "이영희", number: "010-2345-6789", group: "일반 회원" },
    { id: "3", name: "박민수", number: "010-3456-7890", group: "신규 회원" },
    { id: "4", name: "정수진", number: "010-4567-8901", group: "PT 회원" },
    { id: "5", name: "최동현", number: "010-5678-9012", group: "VIP 회원" },
    { id: "6", name: "한미영", number: "010-6789-0123", group: "일반 회원" },
    { id: "7", name: "윤태호", number: "010-7890-1234", group: "신규 회원" },
    { id: "8", name: "송지은", number: "010-8901-2345", group: "PT 회원" }
  ];

  // 템플릿 목록 (실제로는 API에서 가져올 데이터)
  const templates = {
    alimtalk: [
      { 
        id: "KA01TP250708070927635DBOxZ018rBx", 
        name: "PT 만족도 조사 (이다솔)", 
        type: "이미지첨부형", 
        content: "안녕하세요!\n\n스테이 피트니스 둔전점 이다솔 팀장입니다.\n\n현재 수업을 받고 계신 회원님들을 대상으로\n만족도 조사를 진행하고 있습니다.\n\n소중한 의견을 들려주셔서 감사합니다.\n더 나은 수업을 위해 노력하겠습니다.\n\n아래 링크를 통해 참여해 주세요.\n\n📋 만족도 조사 참여하기\n\n📅 조사 기간: 7월 8일~7월 11일 22시까지",
        date: "2025.07.16",
        isFavorite: true,
        isRecentlyUsed: true
      },
      { 
        id: "2", 
        name: "가입 환영", 
        type: "기본형", 
        content: "회원가입을 환영합니다!",
        date: "2025.07.10",
        isFavorite: false,
        isRecentlyUsed: false
      },
      { 
        id: "3", 
        name: "결제 완료 (이미지)", 
        type: "이미지첨부형", 
        content: "결제가 완료되었습니다.",
        date: "2025.07.08",
        isFavorite: false,
        isRecentlyUsed: false
      },
      { 
        id: "4", 
        name: "인증번호", 
        type: "기본형", 
        content: "인증번호를 확인해주세요.",
        date: "2025.07.08",
        isFavorite: false,
        isRecentlyUsed: false
      },
      { 
        id: "5", 
        name: "리뷰 요청 안내", 
        type: "아이템리스트형", 
        content: "리뷰를 작성해주세요.",
        date: "2025.07.08",
        isFavorite: false,
        isRecentlyUsed: false
      },
      { 
        id: "6", 
        name: "이름 없는 템플릿", 
        type: "강조표기형", 
        content: "강조 표기 템플릿입니다.",
        date: "2025.07.08",
        isFavorite: false,
        isRecentlyUsed: false
      }
    ],
    friendtalk: [
      { 
        id: "7", 
        name: "이벤트 안내", 
        type: "텍스트형", 
        content: "새로운 이벤트를 안내드립니다!",
        date: "2025.07.10",
        isFavorite: false,
        isRecentlyUsed: false
      },
      { 
        id: "8", 
        name: "프로모션 소식", 
        type: "이미지형", 
        content: "특별한 프로모션을 확인하세요.",
        date: "2025.07.08",
        isFavorite: false,
        isRecentlyUsed: false
      },
      { 
        id: "9", 
        name: "새로운 프로그램", 
        type: "와이드형", 
        content: "새로운 프로그램을 소개합니다.",
        date: "2025.07.08",
        isFavorite: false,
        isRecentlyUsed: false
      }
    ]
  };

  const addRecipient = () => {
    if (recipientNumber.trim() && recipientName.trim()) {
      setRecipients([...recipients, { number: recipientNumber, name: recipientName }]);
      setRecipientNumber("");
      setRecipientName("");
    }
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const clearRecipients = () => {
    setRecipients([]);
  };

  return (
    <div className="p-6 bg-[#f7f9fb] min-h-screen">


      <div className="flex gap-6">
        {/* 좌측 패널 - 발신/수신 관리 */}
        <div className="w-1/3 space-y-4">
          {/* 메시지 발신번호 */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">메시지 발신번호</h3>
            <div className="flex items-center gap-3">
              <div className="text-lg font-bold text-gray-900">{senderNumber}</div>
              <Button variant="outline" size="sm" className="bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200">
                변경
              </Button>
            </div>
          </Card>

          {/* 메시지 수신번호 */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">메시지 수신번호</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="01022224444 수신자명"
                  value={recipientNumber}
                  onChange={(e) => setRecipientNumber(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addRecipient} variant="outline" size="sm">
                  추가
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                  onClick={() => setShowAddressBook(true)}
                >
                  📋 주소록
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                  onClick={() => setShowExcelUpload(true)}
                >
                  📊 엑셀
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
                  onClick={() => setShowTextInput(true)}
                >
                  📄 텍스트
                </Button>
              </div>
            </div>
          </Card>

          {/* 추가한 수신번호 */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">추가한 수신번호 (총 {recipients.length}개)</h3>
              <Button variant="ghost" size="sm" onClick={clearRecipients} className="text-gray-500 hover:text-red-600">
                🗑️ 비우기
              </Button>
            </div>
            {recipients.length === 0 ? (
              <div className="text-gray-500 text-center py-8">수신자명단이 비어있습니다.</div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {recipients.map((recipient, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{recipient.number} {recipient.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeRecipient(index)} className="text-red-500 hover:text-red-700">
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>




        </div>

        {/* 우측 패널 - 메시지 내용 */}
        <div className="flex-1 space-y-4">
          <Card className="p-4">
            {/* 메시지 타입 탭 */}
                         <Tabs value={messageType} onValueChange={setMessageType} className="mb-4">
               <TabsList className="grid w-full grid-cols-3">
                 <TabsTrigger value="sms" className="text-xs">문자메시지</TabsTrigger>
                 <TabsTrigger value="alimtalk" className="text-xs">알림톡</TabsTrigger>
                 <TabsTrigger value="friendtalk" className="text-xs">친구톡</TabsTrigger>
               </TabsList>
             </Tabs>

            {/* 템플릿 선택 (알림톡, 친구톡일 때만 표시) */}
            {(messageType === "alimtalk" || messageType === "friendtalk") && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    {messageType === "alimtalk" ? "알림톡 템플릿" : "친구톡 템플릿"}
                  </label>
                </div>
                {selectedTemplate ? (
                  <div className="border border-amber-200 rounded-lg p-3 bg-amber-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                          {selectedTemplate.type}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedTemplate.name}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTemplateSelector(true)}
                        className="bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        변경
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplateSelector(true)}
                    className="w-full border-dashed border-gray-300 text-gray-600 hover:border-gray-400"
                  >
                    + 템플릿 선택하기
                  </Button>
                )}
              </div>
            )}

            {/* 제목 입력 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">제목 (선택 사항)</label>
                <span className="text-xs text-gray-500">{messageTitle.length} / 40</span>
              </div>
              <Input
                value={messageTitle}
                onChange={(e) => setMessageTitle(e.target.value)}
                maxLength={40}
                placeholder="메시지 제목을 입력하세요"
              />
            </div>

                        {/* 메시지 내용 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">메시지 내용</label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-gray-600 hover:bg-gray-100"
                  onClick={() => setShowPreview(true)}
                >
                  👁️ 미리보기
                </Button>
              </div>
              <div className="relative">
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="이곳에 문자 내용을 입력합니다"
                  className="min-h-[200px] resize-none"
                  maxLength={2000}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {messageContent.length} / 2,000 Bytes ?
                </div>
              </div>
              
                            {/* 내용 관리 아이콘 */}
              <div className="flex items-center gap-4 mt-2">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100 flex items-center gap-1">
                  📋
                  <span className="text-xs">변수추가</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:bg-gray-100 flex items-center gap-1"
                  onClick={() => setShowImageUpload(true)}
                >
                  🖼️
                  <span className="text-xs">이미지 추가</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:bg-gray-100 flex items-center gap-1"
                  onClick={() => setShowSaveContent(true)}
                >
                  💾
                  <span className="text-xs">저장내용</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:bg-gray-100 flex items-center gap-1"
                  onClick={() => setShowRecentSent(true)}
                >
                  ⏰
                  <span className="text-xs">최근발송</span>
                </Button>
              </div>
            </div>

            {/* 문구 치환 */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">문구 치환</h4>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                내용에 변수가 없습니다.
              </div>
            </div>

            {/* 광고메시지 설정 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="promotional"
                  checked={isPromotional}
                  onCheckedChange={(checked) => setIsPromotional(checked as boolean)}
                />
                <label htmlFor="promotional" className="text-sm font-medium text-gray-700">
                  광고메시지 여부 ?
                </label>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">광고 서비스명</label>
                <Input
                  value={promotionalServiceName}
                  onChange={(e) => setPromotionalServiceName(e.target.value)}
                  placeholder="광고 서비스명을 입력하세요"
                />
              </div>
            </div>
          </Card>

          {/* 예약 발송 설정 */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Checkbox id="reserve" />
              <label htmlFor="reserve" className="text-sm font-medium text-gray-700">
                예약 발송 설정
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">발송 날짜</label>
                <Input type="date" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">발송 시간</label>
                <Input type="time" />
              </div>
            </div>
          </Card>



          {/* 발송 버튼 */}
          <Card className="p-4">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg">
              📤 발송하기
            </Button>
            <div className="mt-2 text-xs text-gray-500 text-center">
              총 {recipients.length}명에게 발송됩니다
            </div>
          </Card>
        </div>
      </div>

      {/* 템플릿 선택 모달 */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex">
            {/* 좌측 패널 - 템플릿 목록 */}
            <div className="w-1/2 border-r border-gray-200 flex flex-col">
              {/* 상단 헤더 */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <Button variant="outline" size="sm" className="bg-blue-50 text-blue-700 border-blue-300">
                    새로 만들기
                  </Button>
                  <div className="flex-1 mx-4">
                    <div className="relative">
                      <Input
                        placeholder={`${messageType === "alimtalk" ? "알림톡" : "친구톡"} 템플릿 검색`}
                        className="pl-8"
                      />
                      <svg className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* 템플릿 목록 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {templates[messageType as keyof typeof templates]?.map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {template.isFavorite && (
                            <span className="text-yellow-500">⭐</span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs text-white ${
                            template.type === "이미지첨부형" ? "bg-orange-500" :
                            template.type === "기본형" ? "bg-gray-500" :
                            template.type === "아이템리스트형" ? "bg-blue-500" :
                            template.type === "강조표기형" ? "bg-yellow-500" :
                            "bg-gray-500"
                          }`}>
                            {template.type}
                          </span>
                          {template.isRecentlyUsed && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              최근사용
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {template.name}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {template.date}
                        </div>
                        <div className="text-xs text-gray-600 line-clamp-2">
                          {template.content.split('\n')[0]}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        선택하기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 우측 패널 - 템플릿 미리보기 */}
            <div className="w-1/2 flex flex-col">
              {/* 상단 헤더 */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">현재 선택됨</span>
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    템플릿 관리
                  </Button>
                </div>
                {selectedTemplate && (
                  <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                    {selectedTemplate.id}
                  </div>
                )}
              </div>

              {/* 미리보기 영역 */}
              <div className="flex-1 p-4">
                {selectedTemplate ? (
                  <div className="bg-[#e5efff] rounded-2xl shadow-xl overflow-hidden max-w-md w-full mx-auto" style={{ border: '1.5px solid #dbeafe', minHeight: 400 }}>
                    <div className="flex items-center justify-between px-4 py-2" style={{ background: '#ffe812' }}>
                      <span className="text-xs font-bold text-gray-700 tracking-wide">알림톡 도착</span>
                      <div style={{
                        background: '#222', color: '#fff', borderRadius: '50%', width: 32, height: 32,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, letterSpacing: '-1px', border: '2px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                      }}>kakao</div>
                    </div>
                    <div className="flex-1 flex flex-col bg-white px-5 py-4">
                      <div className="text-xs text-gray-400 mb-1">채널명</div>
                      <div className="text-base font-bold text-gray-900 mb-2" style={{ lineHeight: 1.2 }}>
                        {selectedTemplate.type === "이미지첨부형" ? "알림톡 도착 (이미지)" : "알림톡 도착"}
                      </div>
                      {selectedTemplate.type === "이미지첨부형" && (
                        <div className="bg-blue-50 rounded-lg p-2 mb-2 flex items-center">
                          <div className="w-8 h-8 bg-blue-200 rounded mr-2 flex items-center justify-center">
                            <span className="text-blue-600 text-xs">📷</span>
                          </div>
                          <div className="text-xs text-blue-700">이미지 미리보기</div>
                        </div>
                      )}
                      <div className="text-xs text-gray-700 whitespace-pre-line mb-3">{selectedTemplate.content}</div>
                      <div className="border-t border-gray-200 my-2" />
                      <div className="text-xs text-gray-500 whitespace-pre-line mb-2">2025년 07월 16일 오전 12:14</div>
                      <div className="flex flex-col gap-2 mt-2">
                        <button className="w-full rounded bg-[#ffe812] text-gray-900 font-bold py-1.5 text-sm border border-[#ffe812] hover:bg-yellow-300 transition" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>채널 추가</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    템플릿을 선택해주세요
                  </div>
                )}
              </div>

              {/* 하단 버튼 */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (selectedTemplate) {
                        setMessageContent(selectedTemplate.content);
                        setShowTemplateSelector(false);
                      }
                    }}
                    disabled={!selectedTemplate}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    템플릿 선택
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplateSelector(false)}
                    className="flex-1"
                  >
                    닫기 ESC
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 주소록 모달 */}
      {showAddressBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">주소록에서 수신자 선택</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddressBook(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="이름 또는 번호로 검색"
                    className="w-full"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="그룹 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="vip">VIP 회원</SelectItem>
                    <SelectItem value="normal">일반 회원</SelectItem>
                    <SelectItem value="new">신규 회원</SelectItem>
                    <SelectItem value="pt">PT 회원</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 주소록 목록 */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {addressBook.map((contact) => {
                  const isSelected = recipients.some(r => r.number === contact.number);
                  return (
                    <div
                      key={contact.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          // 이미 선택된 경우 제거
                          setRecipients(recipients.filter(r => r.number !== contact.number));
                        } else {
                          // 선택되지 않은 경우 추가
                          setRecipients([...recipients, { number: contact.number, name: contact.name }]);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{contact.name}</div>
                            <div className="text-sm text-gray-600">{contact.number}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {contact.group}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            isSelected 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {isSelected ? '선택됨' : '선택하기'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  총 {recipients.length}명 선택됨
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddressBook(false)}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={() => setShowAddressBook(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    선택 완료
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 엑셀 업로드 모달 */}
      {showExcelUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {/* 헤더 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">수신자 목록에 연락처 추가</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExcelUpload(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* 엑셀 파일 업로드 섹션 */}
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">엑셀 파일 업로드 (csv, xls, xlsx)</h4>
                <Button variant="outline" size="sm" className="mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  예제파일 내려받기
                </Button>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-lg font-medium text-gray-600 mb-2">엑셀 파일 업로드</div>
                  <div className="text-sm text-gray-500 mb-4">이곳에 파일 끌어오기 혹은 찾아보기</div>
                  <input
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadedFile(file);
                      }
                    }}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label htmlFor="excel-upload" className="cursor-pointer">
                    <Button variant="outline" className="bg-white hover:bg-gray-50">
                      파일 선택
                    </Button>
                  </label>
                  {uploadedFile && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">{uploadedFile.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 주소록 저장 옵션 */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <Switch
                    id="save-addressbook"
                    checked={saveToAddressBook}
                    onCheckedChange={setSaveToAddressBook}
                  />
                  <Label htmlFor="save-addressbook" className="text-sm font-medium text-gray-700">
                    주소록 생성 후 저장하기
                  </Label>
                  <span className="text-gray-400">📋</span>
                  <span className="text-gray-400">?</span>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3"
                  disabled={!uploadedFile}
                >
                  수신자 목록에 추가
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50 font-bold py-3"
                  disabled={!uploadedFile}
                >
                  미리보기
                </Button>
              </div>
            </div>

            {/* 하단 링크 */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowExcelUpload(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 텍스트 입력 모달 */}
      {showTextInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {/* 헤더 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">수신자 목록에 연락처 추가</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTextInput(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* 연락처 입력 섹션 */}
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">연락처 입력</h4>
                <Textarea
                  value={contactText}
                  onChange={(e) => setContactText(e.target.value)}
                  placeholder="01022221111 홍길동&#10;010-1234-1111 박길동&#10;+821012341234 고길동"
                  className="min-h-[200px] resize-none"
                />
                <div className="mt-2 text-xs text-gray-500">
                  여러 연락처를 추가하는 경우 엔터(Enter)키를 통해 줄바꿈 합니다.
                </div>
              </div>

              {/* 고급 옵션 */}
              <div className="mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                >
                  고급 옵션 열기
                </Button>
                {showAdvancedOptions && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      고급 옵션 기능이 여기에 표시됩니다.
                    </div>
                  </div>
                )}
              </div>

              {/* 주소록 저장 옵션 */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <Switch
                    id="save-addressbook-text"
                    checked={saveToAddressBook}
                    onCheckedChange={setSaveToAddressBook}
                  />
                  <Label htmlFor="save-addressbook-text" className="text-sm font-medium text-gray-700">
                    주소록 생성 후 저장하기
                  </Label>
                  <span className="text-gray-400">👤</span>
                  <span className="text-gray-400">?</span>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3"
                  disabled={!contactText.trim()}
                  onClick={() => {
                    // 텍스트를 파싱하여 수신자 목록에 추가
                    const lines = contactText.trim().split('\n');
                    const newRecipients = lines
                      .map(line => line.trim())
                      .filter(line => line.length > 0)
                      .map(line => {
                        // 전화번호와 이름을 분리하는 간단한 파싱
                        const parts = line.split(' ');
                        const number = parts[0];
                        const name = parts.slice(1).join(' ');
                        return { number, name: name || '이름 없음' };
                      });
                    
                    setRecipients([...recipients, ...newRecipients]);
                    setContactText("");
                    setShowTextInput(false);
                  }}
                >
                  수신자 목록에 추가
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50 font-bold py-3"
                  disabled={!contactText.trim()}
                >
                  미리보기
                </Button>
              </div>
            </div>

            {/* 하단 링크 */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowTextInput(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  닫기 ESC
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 업로드 모달 */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {/* 헤더 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">메시지에 이미지 첨부</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageUpload(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* 이미지 업로드 가이드라인 */}
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">이미지 업로드 가이드라인</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>JPG 확장자</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>이미지 파일 용량 최대 200KB 이하</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>이미지 가로 너비 1,500px 이하</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>이미지 세로 높이 1,440px 이하</span>
                  </div>
                </div>
              </div>

              {/* 이미지 업로드 영역 */}
              <div className="mb-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-lg font-medium text-gray-600 mb-2">메시지에 이미지 첨부</div>
                  <div className="text-sm text-gray-500 mb-4">이곳에 파일 끌어오기 혹은 찾아보기</div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // 파일 크기 체크 (200KB)
                        if (file.size > 200 * 1024) {
                          alert('이미지 파일 크기는 200KB 이하여야 합니다.');
                          return;
                        }
                        setSelectedImage(file);
                      }
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Button variant="outline" className="bg-white hover:bg-gray-50">
                      이미지 선택
                    </Button>
                  </label>
                  {selectedImage && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">{selectedImage.name}</span>
                        <span className="text-xs text-green-600">
                          ({(selectedImage.size / 1024).toFixed(1)}KB)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
                  disabled={!selectedImage}
                  onClick={() => {
                    // 이미지 첨부 완료 처리
                    setShowImageUpload(false);
                    setSelectedImage(null);
                  }}
                >
                  이미지 첨부 완료
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3"
                  onClick={() => {
                    setSelectedImage(null);
                    setShowImageUpload(false);
                  }}
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 저장내용 모달 */}
      {showSaveContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">저장된 내용</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSaveContent(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="내용, 제목으로 검색"
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="sort-oldest" />
                  <Label htmlFor="sort-oldest" className="text-sm text-gray-700">오래된 순</Label>
                </div>
              </div>
            </div>

            {/* 탭 */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 text-purple-600 border-b-2 border-purple-600 pb-2"
                >
                  📁 저장 목록
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 text-gray-600"
                >
                  ⏰ 최근 발송 목록
                </Button>
              </div>
            </div>

            {/* 저장된 내용 목록 */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {savedContents.map((content) => (
                  <div
                    key={content.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                    onClick={() => {
                      setMessageContent(content.content);
                      setShowSaveContent(false);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {content.title}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {content.date}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {content.content}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        선택하기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSaveContent(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  닫기 ESC
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 최근 발송 모달 */}
      {showRecentSent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">최근 발송 목록</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecentSent(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="내용, 제목으로 검색"
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="sort-oldest-recent" />
                  <Label htmlFor="sort-oldest-recent" className="text-sm text-gray-700">오래된 순</Label>
                </div>
              </div>
            </div>

            {/* 탭 */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 text-gray-600"
                >
                  📁 저장 목록
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 text-purple-600 border-b-2 border-purple-600 pb-2"
                >
                  ⏰ 최근 발송 목록
                </Button>
              </div>
            </div>

            {/* 최근 발송 내용 목록 */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {recentSentContents.map((content) => (
                  <div
                    key={content.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                    onClick={() => {
                      setMessageContent(content.content);
                      setMessageTitle(content.title);
                      setShowRecentSent(false);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {content.title}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {content.date} {content.timeAgo}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {content.content}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMessageContent(content.content);
                            setMessageTitle(content.title);
                            setShowRecentSent(false);
                          }}
                        >
                          선택
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1 -3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1 -3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1 -3 0Z" clipRule="evenodd" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRecentSent(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  닫기 ESC
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 미리보기 모달 */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">메시지 미리보기</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* 모바일 미리보기 */}
            <div className="flex-1 p-6 flex justify-center">
              <div className="w-80 h-[500px] bg-gray-100 rounded-3xl p-4 shadow-lg">
                {/* 모바일 헤더 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">📱</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">문자</div>
                  </div>
                  <div className="text-xs text-gray-500">12:34</div>
                </div>

                {/* 메시지 내용 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                  {messageTitle && (
                    <div className="text-sm font-bold text-gray-900 mb-2">
                      {messageTitle}
                    </div>
                  )}
                  <div className="text-sm text-gray-800 whitespace-pre-wrap">
                    {messageContent || "메시지 내용을 입력하세요"}
                  </div>
                  {isPromotional && (
                    <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                      광고메시지 - {promotionalServiceName}
                    </div>
                  )}
                </div>

                {/* 발신자 정보 */}
                <div className="text-xs text-gray-500 text-center">
                  발신자: {senderNumber}
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPreview(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 플로팅 도움말 버튼 */}
      <Button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        size="sm"
      >
        ?
      </Button>
    </div>
  );
} 