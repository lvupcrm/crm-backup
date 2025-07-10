"use client";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createElement, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type MatrixNode = { id: string; label: string; type: "action" | "wait" | "send" | "result" };
type MatrixEdge = { from: string; to: string; label?: string };
type Matrix = { nodes: MatrixNode[]; edges: MatrixEdge[] };

// 더미 캠페인 매트릭스 데이터
const matrix: Matrix = {
  nodes: [
    { id: "start", label: "고객 행동(회원가입)", type: "action" },
    { id: "wait", label: "대기(1시간)", type: "wait" },
    { id: "send", label: "알림톡 발송", type: "send" },
    { id: "success", label: "성공", type: "result" },
    { id: "fail", label: "실패", type: "result" },
  ],
  edges: [
    { from: "start", to: "wait" },
    { from: "wait", to: "send" },
    { from: "send", to: "success", label: "수신" },
    { from: "send", to: "fail", label: "미수신" },
  ],
};

const nodeStyle = {
  action: "bg-blue-100 border-blue-400 text-blue-900",
  wait: "bg-yellow-100 border-yellow-400 text-yellow-900",
  send: "bg-green-100 border-green-400 text-green-900",
  result: "bg-gray-100 border-gray-400 text-gray-700",
};

function MatrixDiagram({ matrix }: { matrix: Matrix }) {
  // 노드 위치를 간단히 수동 배치 (실제는 알고리즘 필요)
  const positions: Record<string, { top: number; left: number }> = {
    start: { top: 40, left: 40 },
    wait: { top: 40, left: 260 },
    send: { top: 40, left: 480 },
    success: { top: 0, left: 700 },
    fail: { top: 80, left: 700 },
  };
  return (
    <div className="relative min-h-[180px] min-w-[800px] bg-white rounded-xl border p-8 overflow-x-auto">
      {/* 노드 */}
      {matrix.nodes.map((n: MatrixNode) => (
        <div
          key={n.id}
          className={`absolute flex flex-col items-center justify-center border-2 rounded-xl shadow-md px-6 py-4 font-bold text-center text-base ${nodeStyle[n.type]}`}
          style={{ top: positions[n.id].top, left: positions[n.id].left, minWidth: 120 }}
        >
          {n.label}
        </div>
      ))}
      {/* 화살표 (SVG) */}
      <svg className="absolute top-0 left-0 pointer-events-none" width="900" height="180">
        {matrix.edges.map((e: MatrixEdge, i: number) => {
          const from = positions[e.from];
          const to = positions[e.to];
          const midY = from.top + 32;
          const toY = to.top + 32;
          return (
            <g key={i}>
              <line x1={from.left+120} y1={midY} x2={to.left} y2={toY} stroke="#888" strokeWidth={2} markerEnd="url(#arrow)" />
              {e.label && (
                <text x={(from.left+to.left+120)/2} y={(midY+toY)/2-8} fontSize="14" fill="#888" textAnchor="middle">{e.label}</text>
              )}
            </g>
          );
        })}
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L10,5 L0,10 Z" fill="#888" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

function generateSmsFromKakao(kakao: string) {
  // 이모지, 특수문자, 줄바꿈 제거 및 간결화
  return kakao
    .replace(/\n+/g, ' ')
    .replace(/[🎉🎊★☆•※\-*]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\{\{.*?\}\}/g, '{이름}')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function KakaoPreviewTabs() {
  const kakaoMsg = `반가워요!\n가입을 환영합니다!\n\nlvup_fitness 회원가입\n\n안녕하세요. {이름} 고객님!\nlvup_fitness 회원이 되신 것을 진심으로 환영합니다🎉\n\n🎊 신규회원 감사 혜택 안내 🎊\n- 카카오톡 채널 추가 시, 10% 할인 쿠폰\n*이벤트 및 할인 중복 적용 불가\n\n※ 이 메시지는 이용약관 동의에 따라 지급된 회원 혜택 안내 메시지입니다.\n채널 추가하고 이 채널의 마케팅 메시지 등을 카카오톡으로 받기`;
  const smsMsg = generateSmsFromKakao(kakaoMsg);
  return (
    <Tabs defaultValue="kakao" className="w-full">
      <TabsList className="w-full flex gap-2 mb-4">
        <TabsTrigger value="kakao" className="flex-1">알림톡</TabsTrigger>
        <TabsTrigger value="sms" className="flex-1">대체 문자 메시지</TabsTrigger>
      </TabsList>
      <TabsContent value="kakao">
        <KakaoPreview msg={kakaoMsg} />
      </TabsContent>
      <TabsContent value="sms">
        <div className="bg-gray-100 rounded-2xl p-6 w-full max-w-md mx-auto min-h-[400px] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 font-bold">SMS</span>
            <span className="font-bold text-gray-800">대체 문자 메시지</span>
          </div>
          <div className="flex-1 text-gray-800 text-base whitespace-pre-line leading-relaxed">{smsMsg}</div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function KakaoPreview({ msg }: { msg: string }) {
  return (
    <div className="bg-[#b7c7d6] rounded-2xl p-6 flex flex-col items-center w-full max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <img src="https://t1.kakaocdn.net/talkstore/pf/profile/ico_profile_110x110.png" alt="kakao" className="w-8 h-8 rounded-full" />
        <span className="font-bold text-gray-800">lvup_fitness</span>
      </div>
      <div className="w-full bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#ffe812]">
          <span className="text-xs font-bold text-gray-700 tracking-wide">알림톡 도착</span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 px-5 py-4">
          <div className="flex-1">
            <div className="text-xl font-bold text-gray-900 mb-2" style={{ lineHeight: 1.2 }}>반가워요!<br/>가입을 환영합니다!</div>
            <div className="text-sm text-gray-700 mb-3">lvup_fitness 회원가입</div>
            <div className="text-sm text-gray-700 whitespace-pre-line mb-3">{msg}</div>
          </div>
          <img src="https://cdn-icons-png.flaticon.com/512/5610/5610944.png" alt="preview" className="w-28 h-28 object-contain" />
        </div>
        <div className="flex flex-col gap-2 px-5 pb-4">
          <button className="w-full rounded bg-[#ffe812] text-gray-900 font-bold py-2 text-base border border-[#ffe812] hover:bg-yellow-300 transition flex items-center justify-center gap-2"><span className="text-lg">Ch</span> 채널 추가</button>
          <button className="w-full rounded bg-gray-100 text-gray-700 font-bold py-2 text-base border border-gray-200 mt-1">인스타그램</button>
        </div>
      </div>
      {/* 하단 탭 버튼 제거 */}
    </div>
  );
}

export default function CampaignDetailPage() {
  const params = useParams();
  // 실제 데이터 fetch는 params.id로 API 연동 필요
  // 더미 상세 데이터
  const detail = {
    registeredAt: "2025-06-30 13:55",
    period: "2025-06-30 14:00 → 종료일 없음",
    days: ["일", "월", "화", "수", "목", "금", "토"],
    time: "00시 00분 부터 23시 30분까지",
    template: "회원가입 템플릿",
    target: "전체 고객",
    condition: "고객이 회원가입을 완료했을 때",
    conditionDesc: "회원가입 후 즉시 알림톡 발송",
    count: "3건 / 3건",
    cost: "총 2.1건",
    costDesc: "알림톡 2.1건 (건당 0.7건)",
  };
  return (
    <div className="p-4 md:p-10 bg-[#f7f9fb] min-h-screen">
      {/* 상단: 타이틀+버튼 */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-2xl font-extrabold">캠페인 매트릭스</h1>
        <div className="flex gap-3 md:gap-4">
          <button className="rounded-2xl px-6 py-3 font-bold text-red-600 bg-red-50 hover:bg-red-100 transition text-lg">캠페인 종료</button>
          <button className="rounded-2xl px-6 py-3 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition text-lg">수정</button>
          <button className="rounded-2xl px-6 py-3 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition text-lg">일시정지</button>
        </div>
      </div>
      {/* 매트릭스 다이어그램 */}
      <div className="bg-white rounded-2xl shadow p-6 md:p-8 mb-10 border border-gray-100">
        <MatrixDiagram matrix={matrix} />
      </div>
      {/* 상세정보+미리보기 2단 */}
      <div className="flex flex-col md:flex-row gap-8 items-start max-w-6xl mx-auto">
        <div className="flex-1 w-full">
          <h2 className="text-lg font-bold mb-4">상세정보</h2>
          <Card className="p-8 shadow-md border border-gray-100 bg-white">
            <dl className="space-y-4 text-[15px]">
              <div className="flex justify-between"><dt className="font-semibold">등록 일시</dt><dd>{detail.registeredAt}</dd></div>
              <div className="flex justify-between"><dt className="font-semibold">시작/종료일</dt><dd>{detail.period}</dd></div>
              <div className="flex justify-between"><dt className="font-semibold">발송 요일</dt><dd>{detail.days.join(", ")}</dd></div>
              <div className="flex justify-between"><dt className="font-semibold">발송 시간</dt><dd>{detail.time}</dd></div>
              <div className="flex justify-between"><dt className="font-semibold">사용 템플릿</dt><dd>{detail.template}</dd></div>
              <div className="flex justify-between"><dt className="font-semibold">캠페인 대상</dt><dd>{detail.target}</dd></div>
              <hr className="my-2 border-gray-200" />
              <div className="flex justify-between items-start"><dt className="font-semibold">발송 조건</dt><dd><div>{detail.condition}</div><div className="text-blue-600 text-sm mt-1">{detail.conditionDesc}</div></dd></div>
              <hr className="my-2 border-gray-200" />
              <div className="flex justify-between"><dt className="font-semibold">발송 시도 / 성공</dt><dd>{detail.count}</dd></div>
              <div className="flex justify-between items-start"><dt className="font-semibold">캠페인 비용</dt><dd><div>{detail.cost}</div><div className="text-gray-500 text-xs mt-1">{detail.costDesc}</div></dd></div>
            </dl>
          </Card>
        </div>
        <div className="flex-1 w-full mt-8 md:mt-0">
          <KakaoPreviewTabs />
        </div>
      </div>
    </div>
  );
}
