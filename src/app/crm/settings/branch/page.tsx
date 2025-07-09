'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  isActive: boolean;
}

const initialForm = {
  name: '',
  address: '',
  phone: '',
  manager: '',
  isActive: true,
};

export default function BranchSettingsPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('branches');
    if (stored) setBranches(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('branches', JSON.stringify(branches));
  }, [branches]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setBranches((prev) =>
        prev.map((b) => (b.id === editingId ? { ...form, id: editingId } : b))
      );
      setEditingId(null);
    } else {
      setBranches((prev) => [
        ...prev,
        { ...form, id: crypto.randomUUID() },
      ]);
    }
    setForm(initialForm);
  };

  const handleEdit = (id: string) => {
    const branch = branches.find((b) => b.id === id);
    if (branch) {
      setForm(branch);
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
    if (editingId === id) {
      setForm(initialForm);
      setEditingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">지점 관리</h2>
      <Card className="mb-6 p-4">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <Input name="name" placeholder="지점명" value={form.name} onChange={handleChange} required />
          <Input name="manager" placeholder="담당자" value={form.manager} onChange={handleChange} />
          <Input name="address" placeholder="주소" value={form.address} onChange={handleChange} />
          <Input name="phone" placeholder="전화번호" value={form.phone} onChange={handleChange} />
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            <span>활성화</span>
          </div>
          <Button type="submit" className="col-span-1 md:col-span-2 mt-2">
            {editingId ? '수정 완료' : '지점 등록'}
          </Button>
        </form>
      </Card>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">지점명</th>
              <th className="p-2">담당자</th>
              <th className="p-2">주소</th>
              <th className="p-2">전화번호</th>
              <th className="p-2">활성여부</th>
              <th className="p-2">작업</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr key={b.id} className="border-b">
                <td className="p-2">{b.name}</td>
                <td className="p-2">{b.manager}</td>
                <td className="p-2">{b.address}</td>
                <td className="p-2">{b.phone}</td>
                <td className="p-2">{b.isActive ? '활성' : '비활성'}</td>
                <td className="p-2 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(b.id)}>
                    수정
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(b.id)}>
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
            {branches.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-400">등록된 지점이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 