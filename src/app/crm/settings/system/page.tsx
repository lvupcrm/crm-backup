'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
}

const initialForm = {
  key: '',
  value: '',
  description: '',
  category: '',
};

const defaultSettings = [
  { key: 'company_name', value: '피트니스 CRM', description: '회사명', category: '기본정보' },
  { key: 'max_customers', value: '1000', description: '최대 고객 수', category: '제한사항' },
  { key: 'auto_backup', value: 'true', description: '자동 백업', category: '백업' },
  { key: 'notification_email', value: 'admin@fitness.com', description: '알림 이메일', category: '알림' },
];

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('systemSettings');
    if (stored) {
      setSettings(JSON.parse(stored));
    } else {
      // 기본 설정으로 초기화
      const defaultSettingsWithIds = defaultSettings.map(setting => ({
        ...setting,
        id: crypto.randomUUID(),
      }));
      setSettings(defaultSettingsWithIds);
      localStorage.setItem('systemSettings', JSON.stringify(defaultSettingsWithIds));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setSettings((prev) =>
        prev.map((s) => (s.id === editingId ? { ...form, id: editingId } : s))
      );
      setEditingId(null);
    } else {
      setSettings((prev) => [
        ...prev,
        { ...form, id: crypto.randomUUID() },
      ]);
    }
    setForm(initialForm);
  };

  const handleEdit = (id: string) => {
    const setting = settings.find((s) => s.id === id);
    if (setting) {
      setForm(setting);
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setSettings((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) {
      setForm(initialForm);
      setEditingId(null);
    }
  };

  const categories = ['기본정보', '제한사항', '백업', '알림', '기타'];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">시스템 설정</h2>
      <Card className="mb-6 p-4">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <Input name="key" placeholder="설정 키" value={form.key} onChange={handleChange} required />
          <Input name="value" placeholder="설정 값" value={form.value} onChange={handleChange} required />
          <Input name="description" placeholder="설명" value={form.description} onChange={handleChange} />
          <select name="category" value={form.category} onChange={handleChange} className="border rounded p-2">
            <option value="">카테고리 선택</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <Button type="submit" className="col-span-1 md:col-span-2 mt-2">
            {editingId ? '수정 완료' : '설정 등록'}
          </Button>
        </form>
      </Card>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">설정 키</th>
              <th className="p-2">설정 값</th>
              <th className="p-2">설명</th>
              <th className="p-2">카테고리</th>
              <th className="p-2">작업</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-2 font-mono text-sm">{s.key}</td>
                <td className="p-2">{s.value}</td>
                <td className="p-2">{s.description}</td>
                <td className="p-2">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {s.category}
                  </span>
                </td>
                <td className="p-2 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(s.id)}>
                    수정
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id)}>
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 