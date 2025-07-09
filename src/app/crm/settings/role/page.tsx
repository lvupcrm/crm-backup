'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}

const initialForm = {
  name: '',
  description: '',
  permissions: [] as string[],
  isActive: true,
};

const availablePermissions = [
  '고객 조회',
  '고객 등록',
  '고객 수정',
  '고객 삭제',
  '상품 조회',
  '상품 등록',
  '상품 수정',
  '상품 삭제',
  '메시지 발송',
  '통계 조회',
  '사용자 관리',
  '설정 관리',
];

export default function RoleSettingsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('roles');
    if (stored) setRoles(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('roles', JSON.stringify(roles));
  }, [roles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter((p) => p !== permission),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setRoles((prev) =>
        prev.map((r) => (r.id === editingId ? { ...form, id: editingId } : r))
      );
      setEditingId(null);
    } else {
      setRoles((prev) => [
        ...prev,
        { ...form, id: crypto.randomUUID() },
      ]);
    }
    setForm(initialForm);
  };

  const handleEdit = (id: string) => {
    const role = roles.find((r) => r.id === id);
    if (role) {
      setForm(role);
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) {
      setForm(initialForm);
      setEditingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">역할 관리</h2>
      <Card className="mb-6 p-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input name="name" placeholder="역할명" value={form.name} onChange={handleChange} required />
            <Input name="description" placeholder="설명" value={form.description} onChange={handleChange} />
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">권한 설정</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availablePermissions.map((permission) => (
                <label key={permission} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.permissions.includes(permission)}
                    onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                  />
                  <span className="text-sm">{permission}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            <span>활성화</span>
          </div>
          <Button type="submit">
            {editingId ? '수정 완료' : '역할 등록'}
          </Button>
        </form>
      </Card>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">역할명</th>
              <th className="p-2">설명</th>
              <th className="p-2">권한</th>
              <th className="p-2">활성여부</th>
              <th className="p-2">작업</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.description}</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-1">
                    {r.permissions.map((p) => (
                      <span key={p} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
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
            {roles.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-400">등록된 역할이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 