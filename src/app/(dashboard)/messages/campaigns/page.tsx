"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const campaigns = [
  { id: 1, type: "알림톡", status: "실행중", title: "[자동 생성 템플릿] 회원가입 환영", target: 3, success: 3, created: "25.06.30", updated: "25.06.30", manager: "LVUP_B" },
  { id: 2, type: "친구톡", status: "일시정지", title: "회원가입 쿠폰 하루전 만료안내", target: 1, success: 0, created: "25.04.02", updated: "25.04.09", manager: "관리자" },
  { id: 3, type: "친구톡", status: "일시정지", title: "회원가입 쿠폰 발급 안내", target: 2, success: 1, created: "25.04.02", updated: "25.04.09", manager: "관리자" },
  { id: 4, type: "친구톡", status: "실행중", title: "[자동 생성 템플릿] 첫 구매 유도", target: 59, success: 37, created: "25.01.31", updated: "25.03.13", manager: "관리자" },
  { id: 5, type: "친구톡", status: "임시저장", title: "-", target: 0, success: 0, created: "24.12.13", updated: "24.12.13", manager: "관리자" },
  { id: 6, type: "친구톡", status: "실행중", title: "[자동 생성 템플릿] 첫 구매 유도", target: 888, success: 704, created: "24.10.02", updated: "25.04.02", manager: "관리자" },
  { id: 7, type: "친구톡", status: "일시정지", title: "[무료 제품 구매자 대상] 1만원 할인 쿠폰(당일 사용)", target: 0, success: 0, created: "24.10.01", updated: "24.10.10", manager: "관리자" },
  { id: 8, type: "친구톡", status: "일시정지", title: "[무료 제품 구매자 대상] 뉴스레터 #5", target: 0, success: 0, created: "24.10.01", updated: "24.10.10", manager: "관리자" },
  { id: 9, type: "친구톡", status: "일시정지", title: "[무료 제품 구매자 대상] 뉴스레터 #4", target: 0, success: 0, created: "24.10.01", updated: "24.10.10", manager: "관리자" },
  { id: 10, type: "친구톡", status: "일시정지", title: "[무료 제품 구매자 대상] 뉴스레터 #3", target: 0, success: 0, created: "24.10.01", updated: "24.10.10", manager: "관리자" },
];

const statusColor: Record<string, "secondary" | "default" | "destructive" | "outline"> = {
  "실행중": "secondary",
  "일시정지": "default",
  "임시저장": "outline",
};

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [channelTab, setChannelTab] = useState("알림톡");
  const [campaignType, setCampaignType] = useState("신규");
  const pageSize = 10;
  const router = useRouter();
  const filtered = campaigns.filter(c => c.title.includes(search));
  const paged = filtered.slice((page-1)*pageSize, page*pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  // 템플릿 카드 더미 데이터
  const templates: Record<string, { icon: string; color: string; title: string; desc: string }[]> = {
    "알림톡": [
      { icon: "%", color: "bg-fuchsia-500", title: "쿠폰 발급 안내", desc: "자동 발행 쿠폰(첫 회원가입, 첫 주문 완료, 생일) 발급을 안내하며 쿠폰 사용을 유도하는 알림톡을 발송해요" },
      { icon: "%", color: "bg-orange-400", title: "쿠폰 기간 만료 안내", desc: "쿠폰 만료 기간을 안내하며 쿠폰 사용을 유도하는 알림톡을 발송해요" },
      { icon: "👤", color: "bg-sky-400", title: "회원가입 환영", desc: "회원가입한 고객에게 환영 인사와 혜택 정보를 알림톡으로 보내요." },
      { icon: "⭐", color: "bg-yellow-400", title: "쇼핑 등급별 쿠폰 발급", desc: "쇼핑 등급이 변경된 고객에게 등급 변동 및 쿠폰 발급 안내를 알림톡으로 보내요." },
    ],
    "친구톡": [
      { icon: "%", color: "bg-fuchsia-500", title: "쿠폰 발급 안내", desc: "친구톡용 쿠폰 발급 안내 템플릿입니다." },
      { icon: "👤", color: "bg-sky-400", title: "회원가입 환영", desc: "친구톡용 회원가입 환영 템플릿입니다." },
    ],
  };

  const campaignTypes = ["신규", "리마인드", "소프트랜딩", "미등록"];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-extrabold">캠페인 목록</h1>
        <button
          className="bg-gray-800 text-white rounded-2xl px-8 py-6 text-xl font-extrabold shadow hover:bg-gray-700 transition"
          onClick={() => setDialogOpen(true)}
        >
          캠페인 만들기
        </button>
      </div>
      {/* 캠페인 매트릭스 다이어그램 */}
      {/* 팝업: 캠페인 유형/채널/템플릿 선택 (가로형) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold">채널 및 템플릿 선택</DialogTitle>
          </DialogHeader>
          <div className="text-gray-600 mb-4">원하는 캠페인 유형, 채널, 템플릿을 선택해 주세요</div>
          <div className="flex flex-col md:flex-row gap-6">
            {/* 좌측: 유형/채널 선택 */}
            <div className="flex flex-col gap-4 min-w-[180px] md:w-1/3">
              <div>
                <div className="font-bold mb-2">캠페인 유형</div>
                <Select value={campaignType} onValueChange={setCampaignType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="font-bold mb-2 mt-4">채널 선택</div>
                <Tabs value={channelTab} onValueChange={setChannelTab} className="">
                  <TabsList>
                    <TabsTrigger value="친구톡">친구톡</TabsTrigger>
                    <TabsTrigger value="알림톡">알림톡</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            {/* 우측: 템플릿 카드 리스트 */}
            <div className="flex-1 space-y-3 max-h-[420px] overflow-y-auto">
              {templates[channelTab].map((tpl: { icon: string; color: string; title: string; desc: string }, i: number) => (
                <Card
                  key={i}
                  className="flex items-center gap-4 p-4 border-2 border-gray-100 hover:border-gray-300 transition cursor-pointer"
                  onClick={() => {
                    setDialogOpen(false);
                    router.push(`/messages/campaigns/create?template=${encodeURIComponent(tpl.title)}&type=${encodeURIComponent(campaignType)}&channel=${encodeURIComponent(channelTab)}`);
                  }}
                >
                  <div className={`w-12 h-12 flex items-center justify-center rounded-2xl text-2xl text-white font-extrabold ${tpl.color}`}>{tpl.icon}</div>
                  <div>
                    <div className="font-bold text-lg mb-1">{tpl.title}</div>
                    <div className="text-gray-500 text-sm">{tpl.desc}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
              <th className="p-3 font-semibold">유형</th>
              <th className="p-3 font-semibold">제목</th>
              <th className="p-3 font-semibold">발송 대상</th>
              <th className="p-3 font-semibold">발송 성공</th>
              <th className="p-3 font-semibold">등록일 <span className="inline-block align-middle">↓</span></th>
              <th className="p-3 font-semibold">수정일</th>
              <th className="p-3 font-semibold">관리자</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c, i) => (
              <tr
                key={c.id}
                className={
                  (i%2 ? "bg-gray-50 " : "") +
                  "cursor-pointer hover:bg-blue-50 transition"
                }
                onClick={() => router.push(`/messages/campaigns/${c.id}`)}
              >
                <td className="p-3 align-middle">{c.type}</td>
                <td className="p-3 align-middle flex items-center gap-2">
                  <Badge variant={statusColor[c.status] || "secondary"}>{c.status}</Badge>
                  <span>{c.title}</span>
                </td>
                <td className="p-3 align-middle text-right">{c.target}</td>
                <td className="p-3 align-middle text-right">{c.success}</td>
                <td className="p-3 align-middle">{c.created}</td>
                <td className="p-3 align-middle">{c.updated}</td>
                <td className="p-3 align-middle">{c.manager}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={7} className="text-center p-8 text-gray-400">등록된 캠페인이 없습니다.</td></tr>
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
