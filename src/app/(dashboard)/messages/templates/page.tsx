"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Edit2, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const CHANNELS = [
  { value: "alimtalk", label: "알림톡 템플릿" },
  { value: "friendtalk", label: "친구톡 템플릿" },
];

const CATEGORIES = [
  { value: "new", label: "신규" },
  { value: "remind", label: "리마인드" },
  { value: "softlanding", label: "소프트랜딩" },
];

const TEMPLATE_TYPES = [
  { value: "basic", label: "기본형", icon: null },
  { value: "emphasis", label: "강조표기형", icon: null },
  { value: "image", label: "이미지첨부형", icon: null },
  { value: "list", label: "리스트형", icon: null },
];

const FRIENDTALK_TEMPLATE_TYPES = [
  { value: "text", label: "텍스트형", icon: null },
  { value: "image", label: "이미지형", icon: null },
  { value: "wide_image", label: "와이드 이미지형", icon: null },
  { value: "wide_list", label: "와이드 아이템 리스트형", icon: null },
  { value: "carousel", label: "캐러셀 피드형", icon: null },
];

function ChannelBadge({ channel }: { channel: string }) {
  return (
    <Badge variant={channel === "알림톡" ? "default" : "secondary"}>{channel}</Badge>
  );
}

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

export default function TemplateListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [channelTab, setChannelTab] = useState("alimtalk");
  const [categoryTab, setCategoryTab] = useState("new");
  const [typeTab, setTypeTab] = useState("basic");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch templates
  const { data: templates, isLoading, isError } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { apiClient } = await import("@/lib/api/client");
      const response = await apiClient.get('/messages/templates');
      return response.data;
    },
    initialData: [],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { apiClient } = await import("@/lib/api/client");
      const response = await apiClient.delete(`/messages/templates/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setDeleteId(null);
    },
  });

  // Filtered and searched templates
  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    return templates.filter((t: any) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchesChannel = channelTab === "alimtalk" ? t.channel === "알림톡" : t.channel === "친구톡";
      const matchesType = channelTab === "alimtalk" ? t.type === typeTab : true;
      return matchesSearch && matchesChannel && matchesType;
    });
  }, [templates, search, channelTab, typeTab]);

  const typeOptions = channelTab === "alimtalk" ? TEMPLATE_TYPES : FRIENDTALK_TEMPLATE_TYPES;

  return (
    <div className="min-h-screen bg-[#f7f9fb] px-2 sm:px-6 md:px-10 py-4">
      {/* 상단 탭: 신청목록/승인된 템플릿 */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-4 w-full max-w-2xl justify-center">
          <button
            type="button"
            onClick={() => router.push("/messages/templates/requests")}
            className={`flex-1 min-w-[180px] max-w-xs h-10 px-4 rounded-full text-base font-bold transition-all border-2
              bg-gray-100 border-gray-200 text-gray-400
            `}
          >
            신청목록
          </button>
          <button
            type="button"
            className={`flex-1 min-w-[180px] max-w-xs h-10 px-4 rounded-full text-base font-bold transition-all border-2
              bg-white border-blue-400 text-blue-700 shadow-md
            `}
          >
            승인된 템플릿
          </button>
        </div>
      </div>
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">템플릿 목록</h1>
        {/* 채널 탭 (알림톡/친구톡) */}
        <div className="flex w-full justify-center mb-8">
          <div className="flex gap-4 w-full max-w-2xl">
            {CHANNELS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setChannelTab(c.value)}
                className={`flex-1 min-w-[180px] max-w-xs h-10 px-4 rounded-full text-base font-bold transition-all border-2
                  ${channelTab === c.value
                    ? 'bg-white border-blue-400 text-blue-700 shadow-md'
                    : 'bg-gray-100 border-gray-200 text-gray-400'}
                `}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        {channelTab && (
          <TemplateTypeSelector value={typeTab} onChange={setTypeTab} types={typeOptions} />
        )}
        <Tabs value={categoryTab} onValueChange={setCategoryTab} className="mb-6">
          <TabsList className="w-full flex gap-2 justify-center bg-transparent">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className={`flex-1 min-w-[120px] max-w-xs h-8 px-3 rounded-full text-sm font-semibold transition-all
                  border
                  ${categoryTab === cat.value
                    ? 'bg-white border-blue-400 text-blue-700 shadow-sm'
                    : 'bg-gray-100 border-gray-200 text-gray-400'}
                `}
                style={{ boxShadow: categoryTab === cat.value ? '0 2px 8px rgba(0,0,0,0.04)' : undefined }}
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-2 items-center justify-center mb-4">
          <Input
            placeholder="템플릿명 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => window.location.href = "/messages/templates/create"}>
            <Plus className="w-4 h-4 mr-1" /> 템플릿 추가
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin w-8 h-8 text-gray-400" /></div>
      ) : isError ? (
        <div className="text-center text-red-500 py-8">템플릿 목록을 불러오지 못했습니다.</div>
      ) : !filteredTemplates || filteredTemplates.length === 0 ? (
        <div className="col-span-full text-center text-gray-400 py-12 text-lg font-semibold">등록된 템플릿이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
          {filteredTemplates.map((t: any) => {
            // Split content for title/subtitle/body/footer (mimic KakaoStyleCard)
            const lines = (t.content || '').split('\n');
            const title = lines[0] || '';
            const subtitle = lines[1] || '';
            const body = lines.slice(2, lines.length - 2).join('\n');
            const footer = lines.slice(-2).join('\n');
            return (
              <div
                key={t.id}
                className="rounded-2xl shadow-xl overflow-hidden bg-[#e5efff] flex flex-col h-full transition-transform hover:scale-[1.03]"
                style={{ border: '1.5px solid #dbeafe', minHeight: 300 }}
              >
                <div className="flex items-center justify-between px-4 py-2" style={{ background: '#ffe812' }}>
                  <span className="text-xs font-bold text-gray-700 tracking-wide">{t.channel} 도착</span>
                  <div style={{
                    background: '#222', color: '#fff', borderRadius: '50%', width: 32, height: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, letterSpacing: '-1px', border: '2px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                  }}>{t.channel === '알림톡' ? 'kakao' : 'chingu'}</div>
                </div>
                <div className="flex-1 flex flex-col bg-white px-3 py-2">
                  <div className="text-xs text-gray-400 mb-1">스테이피트니스 둔전점</div>
                  <div className="text-base font-bold text-gray-900 mb-2" style={{ lineHeight: 1.2 }}>{title}</div>
                  <div className="text-sm font-semibold text-gray-800 mb-2">{subtitle}</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line mb-3">{body}</div>
                  <div className="border-t border-gray-200 my-2" />
                  <div className="text-xs text-gray-500 whitespace-pre-line mb-2">{footer}</div>
                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      className="w-full rounded bg-[#ffe812] text-gray-900 font-bold py-1.5 text-sm border border-[#ffe812] hover:bg-yellow-300 transition"
                      style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
                    >
                      채널 추가
                    </button>
                    <button
                      className="w-full rounded bg-gray-100 text-gray-700 font-semibold py-1.5 text-sm border border-gray-200 hover:bg-gray-200 transition"
                    >
                      {t.channel === '알림톡' ? '리뷰 작성하기' : '메시지 확인하기'}
                    </button>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => window.location.href = `/messages/templates/create?id=${t.id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 text-sm"
                      >
                        수정
                      </Button>
                      <Button
                        onClick={() => setDeleteId(t.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 text-sm"
                        variant="destructive"
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteId} onOpenChange={v => { if (!v) setDeleteId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>템플릿 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">정말로 이 템플릿을 삭제하시겠습니까?</div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>취소</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-1" /> : null}
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
