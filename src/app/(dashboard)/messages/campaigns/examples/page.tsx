"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const exampleCampaigns = [
  { 
    id: 1, 
    title: "[예시] 신규 회원 환영 캠페인", 
    effect: "강력추천", 
    satisfaction: 98, 
    conversion: 72, 
    target: 100, 
    success: 98, 
    created: "24.07.01", 
    manager: "관리자A",
    action: "고객이 회원가입을 완료했을 때",
    template: "회원가입 템플릿",
    waitType: "즉시",
    waitHour: 0,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    days: ["월", "화", "수", "목", "금", "토", "일"],
    startTime: "09:00",
    endTime: "18:00",
    variableMapping: "회원 이름"
  },
  { 
    id: 2, 
    title: "[예시] 쿠폰 만료 안내", 
    effect: "추천", 
    satisfaction: 92, 
    conversion: 55, 
    target: 50, 
    success: 45, 
    created: "24.06.15", 
    manager: "관리자B",
    action: "고객이 첫 구매를 했을 때",
    template: "쿠폰 발급 안내",
    waitType: "지연",
    waitHour: 24,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    days: ["월", "화", "수", "목", "금"],
    startTime: "10:00",
    endTime: "17:00",
    variableMapping: "회원 이름"
  },
  { 
    id: 3, 
    title: "[예시] 재방문 유도", 
    effect: "추천", 
    satisfaction: 85, 
    conversion: 40, 
    target: 30, 
    success: 12, 
    created: "24.05.10", 
    manager: "관리자C",
    action: "고객이 생일을 맞이했을 때",
    template: "쿠폰 기간 만료 안내",
    waitType: "즉시",
    waitHour: 0,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    days: ["월", "화", "수", "목", "금", "토", "일"],
    startTime: "00:00",
    endTime: "23:59",
    variableMapping: "회원 이름"
  },
  { 
    id: 4, 
    title: "[예시] 생일 축하 메시지", 
    effect: "강력추천", 
    satisfaction: 99, 
    conversion: 80, 
    target: 20, 
    success: 20, 
    created: "24.04.01", 
    manager: "관리자D",
    action: "고객이 생일을 맞이했을 때",
    template: "회원가입 템플릿",
    waitType: "즉시",
    waitHour: 0,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    days: ["월", "화", "수", "목", "금", "토", "일"],
    startTime: "09:00",
    endTime: "18:00",
    variableMapping: "회원 이름"
  },
];

const effectColor: Record<string, "secondary" | "destructive"> = {
  "추천": "secondary",
  "강력추천": "destructive",
};

function StarRating({ value }: { value: number }) {
  const full = Math.round(value / 20); // 100점 만점 -> 5점 만점
  return (
    <span className="text-yellow-400 font-bold">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < full ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

function ConversionBadge({ value }: { value: number }) {
  let color = "text-blue-600";
  if (value < 50) color = "text-red-500";
  else if (value < 70) color = "text-yellow-500";
  return <span className={`font-bold ${color}`}>{value}%</span>;
}

export default function CampaignExamplesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const router = useRouter();
  const filtered = exampleCampaigns.filter(c => c.title.includes(search));
  const paged = filtered.slice((page-1)*pageSize, page*pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const handleModify = (campaign: any) => {
    // URL 파라미터로 예시 데이터 전달
    const params = new URLSearchParams({
      title: campaign.title,
      action: campaign.action,
      template: campaign.template,
      waitType: campaign.waitType,
      waitHour: campaign.waitHour.toString(),
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      days: campaign.days.join(','),
      startTime: campaign.startTime,
      endTime: campaign.endTime,
      variableMapping: campaign.variableMapping,
    });
    router.push(`/messages/campaigns/create?${params.toString()}`);
  };

  const handleCreate = (campaign: any) => {
    // 캠페인 만들기 페이지로 이동
    const params = new URLSearchParams({
      title: campaign.title,
      action: campaign.action,
      template: campaign.template,
      waitType: campaign.waitType,
      waitHour: campaign.waitHour.toString(),
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      days: campaign.days.join(','),
      startTime: campaign.startTime,
      endTime: campaign.endTime,
      variableMapping: campaign.variableMapping,
      fromExample: 'true',
    });
    router.push(`/messages/campaigns/create?${params.toString()}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-extrabold">캠페인 예시 목록</h1>
      </div>
      <div className="flex justify-between items-center mb-2">
        <div></div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="검색어를 입력하세요"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" size="icon"><Search className="w-4 h-4" /></Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded bg-white shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500">
              <th className="p-3 font-semibold">캠페인명</th>
              <th className="p-3 font-semibold">효과</th>
              <th className="p-3 font-semibold">만족도</th>
              <th className="p-3 font-semibold">전환율</th>
              <th className="p-3 font-semibold">발송대상</th>
              <th className="p-3 font-semibold">발송성공</th>
              <th className="p-3 font-semibold">등록일</th>
              <th className="p-3 font-semibold">관리자</th>
              <th className="p-3 font-semibold">관리</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c, i) => (
              <tr
                key={c.id}
                className={
                  (i%2 ? "bg-gray-50 " : "") +
                  "hover:bg-blue-50 transition"
                }
              >
                <td className="p-3 align-middle font-bold text-base cursor-pointer" onClick={() => router.push(`/messages/campaigns/${c.id}`)}>{c.title}</td>
                <td className="p-3 align-middle"><Badge variant={effectColor[c.effect] || "secondary"}>{c.effect}</Badge></td>
                <td className="p-3 align-middle"><StarRating value={c.satisfaction} /> <span className="ml-1 text-xs text-gray-500">{c.satisfaction}%</span></td>
                <td className="p-3 align-middle"><ConversionBadge value={c.conversion} /></td>
                <td className="p-3 align-middle text-right">{c.target}</td>
                <td className="p-3 align-middle text-right">{c.success}</td>
                <td className="p-3 align-middle">{c.created}</td>
                <td className="p-3 align-middle">{c.manager}</td>
                <td className="p-3 align-middle">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleModify(c)}
                    >
                      수정
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => handleCreate(c)}
                    >
                      만들기
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={9} className="text-center p-8 text-gray-400">예시 캠페인이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button variant="outline" size="icon" disabled={page===1} onClick={()=>setPage(p=>p-1)}><ChevronLeft /></Button>
        <span className="font-bold text-lg">{page}</span>
        <Button variant="outline" size="icon" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}><ChevronRight /></Button>
      </div>
    </div>
  );
} 