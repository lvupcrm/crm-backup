"use client";
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TemplateRequest = {
  id: string;
  name: string;
  content: string;
  channel: string;
  type: string;
  status: '대기중' | '승인완료' | '반려';
  createdAt: string;
  variables: string[];
  fromExample?: boolean;
};

function TemplateRequestsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [newRequest, setNewRequest] = useState<TemplateRequest>({
    id: '',
    name: '',
    content: '',
    channel: '알림톡',
    type: 'basic',
    status: '대기중',
    createdAt: new Date().toISOString(),
    variables: [],
    fromExample: false,
  });

  // URL 파라미터에서 예시 데이터 확인
  useEffect(() => {
    const fromExample = searchParams.get('fromExample');
    if (fromExample === 'true') {
      const name = searchParams.get('name');
      const content = searchParams.get('content');
      const channel = searchParams.get('channel');
      const type = searchParams.get('type');
      const variables = searchParams.get('variables');

      if (name && content) {
        setNewRequest({
          id: Date.now().toString(),
          name: name,
          content: content,
          channel: channel || '알림톡',
          type: type || 'basic',
          status: '대기중',
          createdAt: new Date().toISOString(),
          variables: variables ? variables.split(',') : [],
          fromExample: true,
        });
        setShowNewRequestDialog(true);
      }
    }
  }, [searchParams]);

  // 모든 템플릿 불러오기
  const { data: templates, isLoading, isError } = useQuery({
    queryKey: ["templates-all"],
    queryFn: async () => {
      const { apiClient } = await import("@/lib/api/client");
      const response = await apiClient.get('/messages/templates');
      return response.data;
    },
    initialData: [],
  });

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    return templates.filter((t: any) => t.name.toLowerCase().includes(search.toLowerCase()));
  }, [templates, search]);

  const handleSubmitRequest = () => {
    // 템플릿 신청 처리 로직
    console.log('템플릿 신청:', newRequest);
    setShowNewRequestDialog(false);
    // 실제로는 API 호출하여 신청 처리
  };

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
              <th className="p-3">등록일</th>
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
                <td className="p-3 align-middle">{new Date(t.createdAt).toLocaleDateString()}</td>
                <td className="p-3 align-middle">
                  <Button size="sm" variant="outline">템플릿 정보</Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-500">등록된 템플릿이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 새 템플릿 신청 다이얼로그 */}
      <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {newRequest.fromExample ? '예시 템플릿 신청' : '새 템플릿 신청'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>템플릿 이름</Label>
              <Input
                value={newRequest.name}
                onChange={(e) => setNewRequest({ ...newRequest, name: e.target.value })}
                placeholder="템플릿 이름을 입력하세요"
              />
            </div>
            <div>
              <Label>채널</Label>
              <Select value={newRequest.channel} onValueChange={(value) => setNewRequest({ ...newRequest, channel: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="알림톡">알림톡</SelectItem>
                  <SelectItem value="친구톡">친구톡</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>템플릿 유형</Label>
              <Select value={newRequest.type} onValueChange={(value) => setNewRequest({ ...newRequest, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">기본형</SelectItem>
                  <SelectItem value="emphasis">강조표기형</SelectItem>
                  <SelectItem value="image">이미지첨부형</SelectItem>
                  <SelectItem value="list">리스트형</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>템플릿 내용</Label>
              <Textarea
                value={newRequest.content}
                onChange={(e) => setNewRequest({ ...newRequest, content: e.target.value })}
                rows={6}
                placeholder="템플릿 내용을 입력하세요"
              />
            </div>
            {newRequest.variables.length > 0 && (
              <div>
                <Label>사용 변수</Label>
                <div className="flex flex-wrap gap-2">
                  {newRequest.variables.map((variable, index) => (
                    <Badge key={index} variant="secondary">{variable}</Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewRequestDialog(false)}>
                취소
              </Button>
              <Button onClick={handleSubmitRequest}>
                신청하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function TemplateRequestsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TemplateRequestsPageContent />
    </Suspense>
  );
} 