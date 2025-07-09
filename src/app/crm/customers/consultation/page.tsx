'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface ConsultationCustomer {
  id: string;
  name: string;
  phone: string;
  appointmentDate: string;
  inquiryChannel: string;
  sport: string;
  appointmentPurpose: string;
  consultationStatus: string;
  registrationStatus: string;
  memo?: string;
}

const initialForm = {
  name: '',
  phone: '',
  appointmentDate: '',
  inquiryChannel: '',
  sport: '',
  appointmentPurpose: '',
  consultationStatus: '미상담',
  registrationStatus: '미등록',
  memo: '',
};

export default function ConsultationCustomersPage() {
  const [customers, setCustomers] = useState<ConsultationCustomer[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('consultationCustomers');
    if (stored) setCustomers(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('consultationCustomers', JSON.stringify(customers));
  }, [customers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingId ? { ...form, id: editingId } : c))
      );
      setEditingId(null);
    } else {
      setCustomers((prev) => [
        ...prev,
        { ...form, id: crypto.randomUUID() },
      ]);
    }
    setForm(initialForm);
  };

  const handleEdit = (id: string) => {
    const customer = customers.find((c) => c.id === id);
    if (customer) {
      setForm({
        ...customer,
        memo: customer.memo ?? '',
      });
      setEditingId(id);
      setOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) {
      setForm(initialForm);
      setEditingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">상담 고객 관리</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setForm(initialForm); setEditingId(null); }}>상담 고객 추가</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingId ? '상담 고객 수정' : '상담 고객 등록'}</DialogTitle>
            </DialogHeader>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { handleSubmit(e); setOpen(false); }}>
              <div className="flex flex-col gap-1">
                <Label htmlFor="name">이름</Label>
                <Input id="name" name="name" placeholder="이름" value={form.name} onChange={handleChange} required />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="phone">연락처</Label>
                <Input id="phone" name="phone" placeholder="연락처" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="appointmentDate">예약일시</Label>
                <Input id="appointmentDate" name="appointmentDate" type="datetime-local" value={form.appointmentDate} onChange={handleChange} required />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="inquiryChannel">문의경로</Label>
                <select id="inquiryChannel" name="inquiryChannel" value={form.inquiryChannel} onChange={handleChange} className="border rounded p-2">
                  <option value="">선택</option>
                  <option value="전화">전화</option>
                  <option value="카카오톡">카카오톡</option>
                  <option value="방문">방문</option>
                  <option value="지인소개">지인소개</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="sport">종목</Label>
                <select id="sport" name="sport" value={form.sport} onChange={handleChange} className="border rounded p-2">
                  <option value="">선택</option>
                  <option value="PT">PT</option>
                  <option value="필라테스">필라테스</option>
                  <option value="요가">요가</option>
                  <option value="GX">GX</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="appointmentPurpose">예약목적</Label>
                <select id="appointmentPurpose" name="appointmentPurpose" value={form.appointmentPurpose} onChange={handleChange} className="border rounded p-2">
                  <option value="">선택</option>
                  <option value="상담">상담</option>
                  <option value="체험">체험</option>
                  <option value="등록">등록</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="consultationStatus">상담상태</Label>
                <select id="consultationStatus" name="consultationStatus" value={form.consultationStatus} onChange={handleChange} className="border rounded p-2">
                  <option value="미상담">미상담</option>
                  <option value="상담완료">상담완료</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="registrationStatus">등록상태</Label>
                <select id="registrationStatus" name="registrationStatus" value={form.registrationStatus} onChange={handleChange} className="border rounded p-2">
                  <option value="미등록">미등록</option>
                  <option value="등록완료">등록완료</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <Label htmlFor="memo">메모</Label>
                <Input id="memo" name="memo" placeholder="메모" value={form.memo} onChange={handleChange} />
              </div>
              <Button type="submit" className="col-span-1 md:col-span-2 mt-2">
                {editingId ? '수정 완료' : '고객 등록'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">이름</th>
              <th className="p-2">연락처</th>
              <th className="p-2">예약일시</th>
              <th className="p-2">문의경로</th>
              <th className="p-2">종목</th>
              <th className="p-2">예약목적</th>
              <th className="p-2">상담상태</th>
              <th className="p-2">등록상태</th>
              <th className="p-2">메모</th>
              <th className="p-2">작업</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.phone}</td>
                <td className="p-2">{c.appointmentDate.replace('T', ' ')}</td>
                <td className="p-2">{c.inquiryChannel}</td>
                <td className="p-2">{c.sport}</td>
                <td className="p-2">{c.appointmentPurpose}</td>
                <td className="p-2">{c.consultationStatus}</td>
                <td className="p-2">{c.registrationStatus}</td>
                <td className="p-2">{c.memo}</td>
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
            {customers.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center p-4 text-gray-400">등록된 상담 고객이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 