"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import { Loader2, Plus, Edit2 } from "lucide-react";

const SEND_CONDITIONS = [
  { value: "consultation_after_1d", label: "상담 후 1일" },
  { value: "consultation_after_3d", label: "상담 후 3일" },
  { value: "consultation_after_7d", label: "상담 후 7일" },
  { value: "registration_immediate", label: "등록 즉시" },
  { value: "membership_expire_7d", label: "만료 7일 전" },
];

function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge variant={active ? "default" : "secondary"}>
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}

export default function CampaignsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState<any | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    sendCondition: "consultation_after_1d",
    templateId: "",
    active: true,
  });

  // Fetch campaigns
  const { data: campaigns, isLoading, isError } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => api.getCampaigns().then((res: any) => res.data),
  });

  // Fetch templates for selection
  const { data: templates } = useQuery({
    queryKey: ["templates"],
    queryFn: () => api.getTemplates().then((res: any) => res.data),
  });

  // Create or update campaign
  const mutation = useMutation({
    mutationFn: (payload: any) =>
      editCampaign
        ? api.updateCampaign(editCampaign.id, payload)
        : api.createCampaign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      setModalOpen(false);
      setEditCampaign(null);
      setForm({
        name: "",
        description: "",
        sendCondition: "consultation_after_1d",
        templateId: "",
        active: true,
      });
    },
  });

  // Toggle active/inactive
  const toggleMutation = useMutation({
    mutationFn: (c: any) =>
      api.updateCampaign(c.id, { ...c, active: !c.active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["campaigns"] }),
  });

  const openEdit = (c: any) => {
    setEditCampaign(c);
    setForm({
      name: c.name,
      description: c.description,
      sendCondition: c.sendCondition,
      templateId: c.templateId,
      active: c.active,
    });
    setModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">캠페인 관리</h1>
        <Button onClick={() => { setModalOpen(true); setEditCampaign(null); setForm({ name: "", description: "", sendCondition: "consultation_after_1d", templateId: "", active: true }); }}>
          <Plus className="w-4 h-4 mr-1" /> 캠페인 추가
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin w-8 h-8 text-gray-400" /></div>
      ) : isError ? (
        <div className="text-center text-red-500 py-8">캠페인 목록을 불러오지 못했습니다.</div>
      ) : !campaigns || campaigns.length === 0 ? (
        <div className="text-center text-gray-400 py-16">등록된 캠페인이 없습니다.</div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c: any) => (
            <Card key={c.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{c.name}</span>
                  <StatusBadge active={c.active} />
                </div>
                <div className="text-gray-500 text-sm mt-1">{c.description}</div>
                <div className="text-xs mt-1">
                  <span className="font-medium">조건:</span> {SEND_CONDITIONS.find((sc) => sc.value === c.sendCondition)?.label || c.sendCondition}
                  {templates && c.templateId && (
                    <span className="ml-4 font-medium">템플릿:</span>
                  )}
                  {templates && c.templateId && (
                    <span className="ml-1">{templates.find((t: any) => t.id === c.templateId)?.name || c.templateId}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={c.active} onCheckedChange={() => toggleMutation.mutate(c)} />
                <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editCampaign ? "캠페인 수정" : "캠페인 등록"}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={e => {
              e.preventDefault();
              mutation.mutate(form);
            }}
          >
            <div>
              <Label htmlFor="name">캠페인명</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="description">설명</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={2} />
            </div>
            <div>
              <Label htmlFor="sendCondition">발송 조건</Label>
              <select
                id="sendCondition"
                name="sendCondition"
                value={form.sendCondition}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              >
                {SEND_CONDITIONS.map((sc) => (
                  <option key={sc.value} value={sc.value}>{sc.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="templateId">템플릿 선택</Label>
              <select
                id="templateId"
                name="templateId"
                value={form.templateId}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              >
                <option value="">템플릿 선택</option>
                {templates && templates.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} />
              <span>{form.active ? "활성화" : "비활성화"}</span>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-1" /> : null}
                {editCampaign ? "수정" : "등록"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">취소</Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
