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

function ChannelBadge({ channel }: { channel: string }) {
  return (
    <Badge variant={channel === "알림톡" ? "default" : "secondary"}>{channel}</Badge>
  );
}

function TemplateTypeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-4">
      <div className="font-bold text-base mb-2 text-center mx-auto w-full" style={{maxWidth:'max-content'}}>
        템플릿 유형
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
        {TEMPLATE_TYPES.map((type) => {
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
                <div className="w-full">
                  <div className="h-2 w-8 rounded bg-yellow-300 mx-auto mb-1" />
                  <div className="h-2 w-6 rounded bg-gray-300 mx-auto mb-0.5" />
                  {type.value === 'image' && <div className="flex justify-end"><span className="inline-block w-4 h-4 bg-blue-100 text-blue-500 text-xs rounded-full flex items-center justify-center">📷</span></div>}
                  {type.value === 'list' && <div className="flex flex-col gap-0.5 mt-1"><div className="h-1 w-6 bg-gray-300 rounded mx-auto" /><div className="h-1 w-6 bg-gray-300 rounded mx-auto" /></div>}
                </div>
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
    queryFn: () =>
      // api.getTemplates() should return { data: Template[] }
      import("@/lib/api/client").then((m) => m.api.getTemplates()).then((res: any) => res.data),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      import("@/lib/api/client").then((m) => m.api.deleteTemplate(id)),
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

  return (
    <div className="min-h-screen bg-[#f7f9fb] px-2 sm:px-6 md:px-10 py-4">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">템플릿 목록</h1>
        {/* 상단 탭 */}
        <Tabs defaultValue="approved" className="mb-6">
          <TabsList className="w-full flex gap-4 justify-center bg-transparent mb-3">
            <TabsTrigger value="requests" onClick={() => router.push("/messages/templates/requests")}>신청목록</TabsTrigger>
            <TabsTrigger value="approved">승인된 템플릿</TabsTrigger>
          </TabsList>
        </Tabs>
        {channelTab === "alimtalk" && (
          <TemplateTypeSelector value={typeTab} onChange={setTypeTab} />
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
          {filteredTemplates.map((t: any) => (
            <Card key={t.id} className="p-3 flex flex-col justify-between h-full rounded-2xl shadow-xl transition-transform hover:scale-[1.03]" style={{ minHeight: 300 }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-bold">{t.name}</span>
                  <ChannelBadge channel={t.channel} />
                </div>
                <div className="text-xs text-gray-500 mb-2">변수 {t.variables ? t.variables.length : 0}개</div>
                <div className="bg-gray-100 rounded p-2 text-xs text-gray-700 line-clamp-3 mb-2 min-h-[48px]">
                  {t.content}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => window.location.href = `/messages/templates/create?id=${t.id}`}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteId(t.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
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
