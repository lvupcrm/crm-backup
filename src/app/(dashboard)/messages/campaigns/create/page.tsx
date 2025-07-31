"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Mermaid from '@/components/ui/mermaid';

const customerActions = [
  "고객이 회원가입을 완료했을 때",
  "고객이 첫 구매를 했을 때",
  "고객이 생일을 맞이했을 때",
];

const templates = [
  { value: "회원가입 템플릿", label: "회원가입 템플릿" },
  { value: "쿠폰 발급 안내", label: "쿠폰 발급 안내" },
  { value: "쿠폰 기간 만료 안내", label: "쿠폰 기간 만료 안내" },
];

function CampaignCreatePageContent() {
  const params = useSearchParams();
  const [action, setAction] = useState(customerActions[0]);
  const [waitType, setWaitType] = useState("즉시");
  const [waitHour, setWaitHour] = useState(0);
  const [template, setTemplate] = useState(params.get("template") || templates[0].value);
  const [testSending, setTestSending] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [fallbackText, setFallbackText] = useState("");
  const [variableMapping, setVariableMapping] = useState("회원 이름");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState(["월", "화", "수", "목", "금", "토", "일"]);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:30");

  // URL 파라미터에서 예시 데이터 로드
  useEffect(() => {
    const title = params.get('title');
    const actionParam = params.get('action');
    const templateParam = params.get('template');
    const waitTypeParam = params.get('waitType');
    const waitHourParam = params.get('waitHour');
    const startDateParam = params.get('startDate');
    const endDateParam = params.get('endDate');
    const daysParam = params.get('days');
    const startTimeParam = params.get('startTime');
    const endTimeParam = params.get('endTime');
    const variableMappingParam = params.get('variableMapping');

    if (actionParam) setAction(actionParam);
    if (templateParam) setTemplate(templateParam);
    if (waitTypeParam) setWaitType(waitTypeParam);
    if (waitHourParam) setWaitHour(Number(waitHourParam));
    if (startDateParam) setStartDate(startDateParam);
    if (endDateParam) setEndDate(endDateParam);
    if (daysParam) setDays(daysParam.split(','));
    if (startTimeParam) setStartTime(startTimeParam);
    if (endTimeParam) setEndTime(endTimeParam);
    if (variableMappingParam) setVariableMapping(variableMappingParam);
  }, [params]);

  // 미리보기용 더미
  const preview = {
    brand: "lvup_fitness",
    title: "알림톡 도착",
    content: `반가워요!\n가입을 환영합니다!\n\nlvup_fitness 회원가입\n\n안녕하세요. {{이름}} 고객님!\nlvup_fitness 회원이 되신 것을 진심으로 환영합니다🎉\n\n🎊 신규회원 감사 혜택 안내 🎊\n- 카카오톡 채널 추가 시, 10% 할인 쿠폰\n*이벤트 및 할인 중복 적용 불가\n\n※ 이 메시지는 이용약관 동의에 따라 지급된 회원 혜택 안내 메시지입니다.\n채널 추가하고 이 채널의 마케팅 메시지 등을 카카오톡으로 받기`,
    image: "https://cdn-icons-png.flaticon.com/512/5610/5610944.png",
  };

  const chart = useMemo(() => {
    const waitText = waitType === '즉시' ? '즉시' : `${waitHour}시간`;
    return `flowchart LR
    A["고객 행동(${action})"]:::blue --> B["대기(${waitText})"]:::yellow --> C["알림톡 발송"]:::green
    C -- 수신 --> D["성공"]:::gray
    C -- 미수신 --> E["실패"]:::gray
    
    classDef blue fill:#fff,stroke:#3b82f6,stroke-width:3px,color:#1e40af,font-weight:bold,font-size:18px,rx:16px,ry:16px;
    classDef yellow fill:#fffbe6,stroke:#facc15,stroke-width:3px,color:#b45309,font-weight:bold,font-size:18px,rx:16px,ry:16px;
    classDef green fill:#e6fff3,stroke:#34d399,stroke-width:3px,color:#047857,font-weight:bold,font-size:18px,rx:16px,ry:16px;
    classDef gray fill:#fff,stroke:#94a3b8,stroke-width:3px,color:#334155,font-weight:bold,font-size:18px,rx:16px,ry:16px;
    
    style A width:180px,height:70px
    style B width:150px,height:70px
    style C width:170px,height:70px
    style D width:100px,height:60px
    style E width:100px,height:60px
    
    linkStyle 0 stroke:#64748b,stroke-width:3px,stroke-dasharray:0,fill:none,arrowhead:normal
    linkStyle 1 stroke:#64748b,stroke-width:3px,stroke-dasharray:0,fill:none,arrowhead:normal
    linkStyle 2 stroke:#64748b,stroke-width:3px,stroke-dasharray:0,fill:none,arrowhead:normal
    linkStyle 3 stroke:#64748b,stroke-width:3px,stroke-dasharray:0,fill:none,arrowhead:normal
    
    class A blue
    class B yellow
    class C green
    class D gray
    class E gray
    `;
  }, [action, waitType, waitHour]);

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#f7f9fb] min-h-screen">
      {/* 상단 버튼들 */}
      <div className="w-full max-w-md flex justify-end gap-3 mb-6 ml-auto">
        <button className="text-gray-400 font-bold px-6 bg-transparent border-none cursor-pointer" style={{outline:'none',boxShadow:'none'}}>삭제</button>
        <button className="bg-gray-100 text-gray-900 font-bold px-8 py-3 rounded-2xl text-lg shadow-none border-none">임시저장</button>
        <button className="bg-gray-900 text-white font-bold px-8 py-3 rounded-2xl text-lg shadow-none border-none">캠페인 실행</button>
      </div>
      {/* 캠페인 매트릭스 다이어그램 (실시간 반영) */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="font-bold text-lg mb-2">캠페인 매트릭스</div>
        <Mermaid chart={chart} />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* 좌측: 조건/템플릿/변수/기간 */}
        <div className="flex-1 flex flex-col gap-6 max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>알림톡 발송 조건</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-semibold mb-1">고객 행동</div>
                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {customerActions.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="font-semibold mb-1">대기 시간 <span className="ml-1 text-gray-400" title="고객 행동 후 알림톡 발송까지의 대기 시간">?</span></div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={waitType==="즉시"} onChange={()=>setWaitType("즉시")}/>
                    즉시
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={waitType==="지연"} onChange={()=>setWaitType("지연")}/>
                    고객 회원가입 <Input type="number" value={waitHour} onChange={e=>setWaitHour(Number(e.target.value))} className="w-16 inline-block" disabled={waitType!=="지연"}/> 시간 후 알림톡 발송
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>발송 템플릿</CardTitle>
              <Button variant="outline" size="sm">테스트 발송</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((tpl) => (
                      <SelectItem key={tpl.value} value={tpl.value}>{tpl.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={useFallback} onCheckedChange={setUseFallback} />
                <span>대체 문자</span>
              </div>
              {useFallback && (
                <Input value={fallbackText} onChange={e=>setFallbackText(e.target.value)} placeholder="대체 문자 내용 입력" />
              )}
              <div className="bg-blue-50 text-blue-700 rounded p-3 text-sm mt-2">
                <span className="font-bold text-blue-700 underline cursor-pointer">템플릿 만들기</span>를 통해 우리 브랜드만의 템플릿을 만들 수 있어요
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>개인화 변수</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-600 mb-2">템플릿의 변수에 들어갈 데이터를 연결하세요.</div>
              <div className="bg-gray-50 rounded p-4">
                <div className="font-bold mb-2">&#123;&#123;이름&#125;&#125;</div>
                <div className="mb-2">
                  <div className="text-xs text-gray-500 mb-1">데이터 연결</div>
                  <Select value={variableMapping} onValueChange={setVariableMapping}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="회원 이름">회원 이름</SelectItem>
                      <SelectItem value="연락처">연락처</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">대체 텍스트</div>
                  <Input value={fallbackText} onChange={e=>setFallbackText(e.target.value)} maxLength={100} />
                  <div className="text-xs text-gray-400 text-right mt-1">{fallbackText.length}/100</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>기간</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">시작일</div>
                  <Input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">종료일</div>
                  <Input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">발송 요일</div>
                <div className="flex gap-2">
                  {days.map((d) => (
                    <Badge key={d} className="rounded-full px-3 py-2 text-base bg-gray-900 text-white cursor-pointer select-none" variant="default">{d}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">발송 시간</div>
                  <Input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} />
                </div>
                <span>부터</span>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">~</div>
                  <Input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} />
                </div>
                <span>까지</span>
              </div>
              <div className="bg-gray-50 rounded p-4 text-xs text-gray-700 mt-2">
                <div className="font-bold mb-1">사용 전 확인해 주세요</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>알림톡은 고객 전화번호가 없거나 알림톡 수신을 거부한 고객에게는 보낼 수 없어요.</li>
                  <li>발송 요일이 아닌 기간에 수신 대상이 된 고객에게는 대기한 후 메시지를 보내요.</li>
                  <li>하나의 캠페인은 메시지를 한 번만 발송하며, 동일한 대상에게 중복으로 발송하지 않아요.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* 우측: 미리보기 */}
        <div className="flex-1 flex flex-col items-center justify-start pt-0 mt-0">
          {/* 상단 버튼들 (이전 위치) 삭제됨 */}
          <div className="w-full max-w-md bg-[#e5efff] rounded-2xl shadow-xl overflow-hidden border border-blue-100">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#f5f7fa]">
              <span className="font-bold text-gray-700">{preview.brand}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#ffe812' }}>
              <span className="text-xs font-bold text-gray-700 tracking-wide">{preview.title}</span>
            </div>
            <div className="flex flex-col bg-white px-5 py-4">
              <div className="text-base font-bold text-gray-900 mb-2" style={{ lineHeight: 1.2 }}>반가워요!<br/>가입을 환영합니다!</div>
              <div className="flex justify-center mb-2">
                <img src={preview.image} alt="preview" className="w-24 h-24 object-contain" />
              </div>
              <div className="text-xs text-gray-700 whitespace-pre-line mb-3">{preview.content}</div>
              <div className="border-t border-gray-200 my-2" />
              <div className="flex flex-col gap-2 mt-2">
                <button className="w-full rounded bg-[#ffe812] text-gray-900 font-bold py-1.5 text-sm border border-[#ffe812] hover:bg-yellow-300 transition">채널 추가</button>
                <button className="w-full rounded bg-gray-100 text-gray-700 font-bold py-1.5 text-sm border border-gray-200 mt-1">인스타그램</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CampaignCreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CampaignCreatePageContent />
    </Suspense>
  );
} 