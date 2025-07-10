"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

const campaigns = [
  { id: 1, name: "회원가입 환영", type: "알림톡", status: "실행중", sent: 100, success: 98, conversion: 72, created: "24.07.01", manager: "관리자A" },
  { id: 2, name: "쿠폰 만료 안내", type: "친구톡", status: "일시정지", sent: 50, success: 45, conversion: 55, created: "24.06.15", manager: "관리자B" },
  { id: 3, name: "재방문 유도", type: "알림톡", status: "임시저장", sent: 30, success: 12, conversion: 40, created: "24.05.10", manager: "관리자C" },
  { id: 4, name: "생일 축하 메시지", type: "알림톡", status: "실행중", sent: 20, success: 20, conversion: 80, created: "24.04.01", manager: "관리자D" },
];

const statusColor: Record<string, "secondary" | "default" | "destructive" | "outline"> = {
  "실행중": "secondary",
  "일시정지": "default",
  "임시저장": "outline",
};

export default function CampaignPerformancePage() {
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const filtered = campaigns.filter(l =>
    (!search || l.name.includes(search)) &&
    (channel === "all" || l.type === channel) &&
    (type === "all" || l.type === type) &&
    (status === "all" || l.status === status)
  );
  const paged = filtered.slice((page-1)*pageSize, page*pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // 요약 통계
  const total = campaigns.length;
  const totalSent = campaigns.reduce((a, c) => a + c.sent, 0);
  const totalSuccess = campaigns.reduce((a, c) => a + c.success, 0);
  const avgConversion = Math.round(campaigns.reduce((a, c) => a + c.conversion, 0) / total);
  const avgSuccessRate = totalSent ? Math.round((totalSuccess / totalSent) * 100) : 0;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <div className="text-xs text-gray-500 mb-1">기간</div>
            <div className="flex items-center gap-2">
              <Input type="date" className="w-36" />
              <span className="text-gray-400">~</span>
              <Input type="date" className="w-36" />
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">채널</div>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger className="w-28"><SelectValue placeholder="전체" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="알림톡">알림톡</SelectItem>
                <SelectItem value="친구톡">친구톡</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">유형</div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-28"><SelectValue placeholder="전체" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="알림톡">알림톡</SelectItem>
                <SelectItem value="친구톡">친구톡</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">상태</div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-28"><SelectValue placeholder="전체" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="실행중">실행중</SelectItem>
                <SelectItem value="일시정지">일시정지</SelectItem>
                <SelectItem value="임시저장">임시저장</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">검색</div>
            <Input placeholder="캠페인명" value={search} onChange={e=>setSearch(e.target.value)} className="w-48" />
          </div>
        </div>
        <Button variant="outline" className="flex gap-2 items-center h-10"><Download className="w-4 h-4" />엑셀 내보내기</Button>
      </div>
      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card className="p-4 flex flex-col items-center"><div className="text-xs text-gray-500 mb-1">전체 캠페인</div><div className="text-2xl font-extrabold text-blue-600">{total}</div></Card>
        <Card className="p-4 flex flex-col items-center"><div className="text-xs text-gray-500 mb-1">성공률</div><div className="text-2xl font-extrabold text-green-600">{avgSuccessRate}%</div></Card>
        <Card className="p-4 flex flex-col items-center"><div className="text-xs text-gray-500 mb-1">총 발송</div><div className="text-2xl font-extrabold text-blue-600">{totalSent}</div></Card>
        <Card className="p-4 flex flex-col items-center"><div className="text-xs text-gray-500 mb-1">총 성공</div><div className="text-2xl font-extrabold text-green-600">{totalSuccess}</div></Card>
        <Card className="p-4 flex flex-col items-center"><div className="text-xs text-gray-500 mb-1">평균 전환율</div><div className="text-2xl font-extrabold text-yellow-600">{avgConversion}%</div></Card>
      </div>
      {/* 캠페인별 성과 테이블 */}
      <div className="overflow-x-auto rounded bg-white shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500">
              <th className="p-3 font-semibold">캠페인명</th>
              <th className="p-3 font-semibold">유형</th>
              <th className="p-3 font-semibold">상태</th>
              <th className="p-3 font-semibold">발송</th>
              <th className="p-3 font-semibold">성공</th>
              <th className="p-3 font-semibold">성공률</th>
              <th className="p-3 font-semibold">전환율</th>
              <th className="p-3 font-semibold">등록일</th>
              <th className="p-3 font-semibold">관리자</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c, i) => (
              <tr key={c.id} className={i%2 ? "bg-gray-50" : ""}>
                <td className="p-3 align-middle font-bold">{c.name}</td>
                <td className="p-3 align-middle">{c.type}</td>
                <td className="p-3 align-middle"><Badge variant={statusColor[c.status] || "secondary"}>{c.status}</Badge></td>
                <td className="p-3 align-middle text-right">{c.sent}</td>
                <td className="p-3 align-middle text-right">{c.success}</td>
                <td className="p-3 align-middle text-green-600 font-bold">{c.sent ? Math.round((c.success/c.sent)*100) : 0}%</td>
                <td className="p-3 align-middle text-yellow-600 font-bold">{c.conversion}%</td>
                <td className="p-3 align-middle">{c.created}</td>
                <td className="p-3 align-middle">{c.manager}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={9} className="text-center p-8 text-gray-400">성과 데이터가 없습니다.</td></tr>
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