'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Campaign {
  id: string;
  name: string;
  description: string;
  sendCondition: string;
  isActive: boolean;
}

const initialForm = {
  name: '',
  description: '',
  sendCondition: '',
  isActive: true,
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('campaigns');
    if (stored) setCampaigns(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === editingId ? { ...form, id: editingId } : c))
      );
      setEditingId(null);
    } else {
      setCampaigns((prev) => [
        ...prev,
        { ...form, id: crypto.randomUUID() },
      ]);
    }
    setForm(initialForm);
  };

  const handleEdit = (id: string) => {
    const campaign = campaigns.find((c) => c.id === id);
    if (campaign) {
      setForm(campaign);
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) {
      setForm(initialForm);
      setEditingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">캠페인 관리</h2>
      <Card className="mb-6 p-4">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
          <Input name="name" placeholder="캠페인 이름" value={form.name} onChange={handleChange} required />
          <Input name="sendCondition" placeholder="발송조건" value={form.sendCondition} onChange={handleChange} />
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            <span>활성화</span>
          </div>
          <textarea name="description" placeholder="설명" value={form.description} onChange={handleChange} className="border rounded p-2 col-span-1 md:col-span-3" />
          <Button type="submit" className="col-span-1 md:col-span-3 mt-2">
            {editingId ? '수정 완료' : '캠페인 등록'}
          </Button>
        </form>
      </Card>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">이름</th>
              <th className="p-2">설명</th>
              <th className="p-2">발송조건</th>
              <th className="p-2">활성여부</th>
              <th className="p-2">작업</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.description}</td>
                <td className="p-2">{c.sendCondition}</td>
                <td className="p-2">{c.isActive ? '활성' : '비활성'}</td>
                <td className="p-2 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(c.id)}>
                    수정
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-400">등록된 캠페인이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 