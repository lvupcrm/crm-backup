"use client";
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function TemplateRequestsPage() {
  const [search, setSearch] = useState("");
  // 모든 템플릿 불러오기
  const { data: templates, isLoading, isError } = useQuery({
    queryKey: ["templates-all"],
    queryFn: () => import("@/lib/api/client").then((m) => m.api.getTemplates()).then((res: any) => res.data),
  });
  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    return templates.filter((t: any) => t.name.toLowerCase().includes(search.toLowerCase()));
  }, [templates, search]);

  return (
    <div className="min-h-screen bg-[#f7f9fb] px-2 sm:px-6 md:px-10 py-4">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">템플릿 신청목록</h1>
        <div className="flex gap-2 items-center justify-center mb-4">
          <Input placeholder="템플릿명 검색" value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
          <Button variant="outline" onClick={() => setSearch("")}>검색 초기화</Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3"><Checkbox /></th>
              <th className="p-3">템플릿 이름</th>
              <th className="p-3">상태</th>
              <th className="p-3">템플릿 유형</th>
              <th className="p-3">템플릿 내용</th>
              <th className="p-3">템플릿 관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredTemplates && filteredTemplates.length > 0 ? filteredTemplates.map((t: any) => (
              <tr key={t.id} className="border-b">
                <td className="p-3"><Checkbox /></td>
                <td className="p-3 align-middle">{t.name}</td>
                <td className="p-3 align-middle">
                  <Badge variant={t.status === '승인완료' ? 'default' : t.status === '반려' ? 'destructive' : 'secondary'}>{t.status}</Badge>
                </td>
                <td className="p-3 align-middle">{t.type}</td>
                <td className="p-3 align-middle truncate max-w-xs">{t.content}</td>
                <td className="p-3 align-middle">
                  <Button size="sm" variant="outline">템플릿 정보</Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500">등록된 템플릿이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 