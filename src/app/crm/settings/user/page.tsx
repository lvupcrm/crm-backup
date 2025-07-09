'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  isActive: boolean;
}

const initialForm = {
  username: '',
  name: '',
  email: '',
  role: '',
  branch: '',
  isActive: true,
};

export default function UserSettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('users');
    if (stored) setUsers(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      setUsers((prev) =>
        prev.map((u) => (u.id === editingId ? { ...form, id: editingId } : u))
      );
      setEditingId(null);
    } else {
      setUsers((prev) => [
        ...prev,
        { ...form, id: crypto.randomUUID() },
      ]);
    }
    setForm(initialForm);
  };

  const handleEdit = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setForm(user);
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (editingId === id) {
      setForm(initialForm);
      setEditingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">사용자 관리</h2>
      <Card className="mb-6 p-4">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
          <Input name="username" placeholder="아이디" value={form.username} onChange={handleChange} required />
          <Input name="name" placeholder="이름" value={form.name} onChange={handleChange} required />
          <Input name="email" type="email" placeholder="이메일" value={form.email} onChange={handleChange} />
          <select name="role" value={form.role} onChange={handleChange} className="border rounded p-2">
            <option value="">역할 선택</option>
            <option value="admin">관리자</option>
            <option value="manager">매니저</option>
            <option value="staff">직원</option>
          </select>
          <Input name="branch" placeholder="소속 지점" value={form.branch} onChange={handleChange} />
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            <span>활성화</span>
          </div>
          <Button type="submit" className="col-span-1 md:col-span-3 mt-2">
            {editingId ? '수정 완료' : '사용자 등록'}
          </Button>
        </form>
      </Card>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">아이디</th>
              <th className="p-2">이름</th>
              <th className="p-2">이메일</th>
              <th className="p-2">역할</th>
              <th className="p-2">소속 지점</th>
              <th className="p-2">활성여부</th>
              <th className="p-2">작업</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.branch}</td>
                <td className="p-2">{u.isActive ? '활성' : '비활성'}</td>
                <td className="p-2 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(u.id)}>
                    수정
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}>
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-400">등록된 사용자가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 