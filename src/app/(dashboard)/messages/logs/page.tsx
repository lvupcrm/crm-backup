"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Search, ChevronLeft, ChevronRight } from "lucide-react";

const logs = [
  { date: "2024-07-01 10:12", channel: "알림톡", type: "신규", campaign: "회원가입 환영", recipient: "홍길동", status: "성공", content: "가입을 환영합니다!" },
  { date: "2024-07-01 09:55", channel: "친구톡", type: "리마인드", campaign: "쿠폰 만료 안내", recipient: "김철수", status: "실패", content: "쿠폰이 곧 만료됩니다." },
  { date: "2024-06-30 15:20", channel: "알림톡", type: "소프트랜딩", campaign: "재방문 유도", recipient: "이영희", status: "성공", content: "오랜만에 방문해 주세요!" },
];

const statusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "성공": "secondary",
  "실패": "destructive",
  "대기": "default",
};

export default function MessageLogsPage() {
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const filtered = logs.filter(l =>
    (!search || l.campaign.includes(search) || l.recipient.includes(search) || l.content.includes(search)) &&
    (channel === "all" || l.channel === channel) &&
    (type === "all" || l.type === type) &&
    (status === "all" || l.status === status)
  );
  const paged = filtered.slice((page-1)*pageSize, page*pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
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
                <SelectItem value="신규">신규</SelectItem>
                <SelectItem value="리마인드">리마인드</SelectItem>
                <SelectItem value="소프트랜딩">소프트랜딩</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">상태</div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-28"><SelectValue placeholder="전체" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="성공">성공</SelectItem>
                <SelectItem value="실패">실패</SelectItem>
                <SelectItem value="대기">대기</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">검색</div>
            <Input placeholder="캠페인명, 수신자, 내용" value={search} onChange={e=>setSearch(e.target.value)} className="w-48" />
          </div>
        </div>
        <Button variant="outline" className="flex gap-2 items-center h-10"><Download className="w-4 h-4" />엑셀 내보내기</Button>
      </div>
      <div className="overflow-x-auto rounded bg-white shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500">
              <th className="p-3 font-semibold">발송일시</th>
              <th className="p-3 font-semibold">채널</th>
              <th className="p-3 font-semibold">유형</th>
              <th className="p-3 font-semibold">캠페인명</th>
              <th className="p-3 font-semibold">수신자</th>
              <th className="p-3 font-semibold">결과</th>
              <th className="p-3 font-semibold">내용</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((l, i) => (
              <tr key={i} className={i%2 ? "bg-gray-50" : ""}>
                <td className="p-3 align-middle">{l.date}</td>
                <td className="p-3 align-middle">{l.channel}</td>
                <td className="p-3 align-middle">{l.type}</td>
                <td className="p-3 align-middle">{l.campaign}</td>
                <td className="p-3 align-middle">{l.recipient}</td>
                <td className="p-3 align-middle"><Badge variant={statusColor[l.status] ?? "default"}>{l.status}</Badge></td>
                <td className="p-3 align-middle">{l.content}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={7} className="text-center p-8 text-gray-400">발송 내역이 없습니다.</td></tr>
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