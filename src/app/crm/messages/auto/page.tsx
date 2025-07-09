'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface AutoRule {
  id: string;
  name: string;
  trigger: string;
  message: string;
  isActive: boolean;
}

const initialForm = {
  name: '',
  trigger: '',
  message: '',
  isActive: true,
};

export default function AutoMessagesPage() {
  const [rules, setRules] = useState<AutoRule[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('autoRules');
    if (stored) setRules(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('autoRules', JSON.stringify(rules));
  }, [rules]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setRules((prev) =>
        prev.map((r) => (r.id === editingId ? { ...form, id: editingId } : r))
      );
      setEditingId(null);
    } else {
      setRules((prev) => [
        ...prev,
        { ...form, id: crypto.randomUUID() },
      ]);
    }
    setForm(initialForm);
  };

  const handleEdit = (id: string) => {
    const rule = rules.find((r) => r.id === id);
    if (rule) {
      setForm(rule);
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) {
      setForm(initialForm);
      setEditingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">자동 발송 관리</h2>
      <Card className="mb-6 p-4">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
          <Input name="name" placeholder="규칙 이름" value={form.name} onChange={handleChange} required />
          <Input name="trigger" placeholder="트리거 (예: 생일, 결제 등)" value={form.trigger} onChange={handleChange} />
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            <span>활성화</span>
          </div>
          <textarea name="message" placeholder="메시지 내용" value={form.message} onChange={handleChange} className="border rounded p-2 col-span-1 md:col-span-3" />
          <Button type="submit" className="col-span-1 md:col-span-3 mt-2">
            {editingId ? '수정 완료' : '규칙 등록'}
          </Button>
        </form>
      </Card>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">이름</th>
              <th className="p-2">트리거</th>
              <th className="p-2">메시지</th>
              <th className="p-2">활성여부</th>
              <th className="p-2">작업</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.trigger}</td>
                <td className="p-2">{r.message}</td>
                <td className="p-2">{r.isActive ? '활성' : '비활성'}</td>
                <td className="p-2 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(r.id)}>
                    수정
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(r.id)}>
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-400">등록된 규칙이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 