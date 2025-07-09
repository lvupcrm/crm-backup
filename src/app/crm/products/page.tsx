'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
}

const initialForm = {
  name: '',
  price: 0,
  description: '',
  isActive: true,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...form, id: editingId } : p))
      );
      setEditingId(null);
    } else {
      setProducts((prev) => [
        ...prev,
        { ...form, id: crypto.randomUUID() },
      ]);
    }
    setForm(initialForm);
  };

  const handleEdit = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setForm(product);
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) {
      setForm(initialForm);
      setEditingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">상품 관리</h2>
      <Card className="mb-6 p-4">
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleSubmit}>
          <Input name="name" placeholder="상품명" value={form.name} onChange={handleChange} required />
          <Input name="price" type="number" placeholder="가격" value={form.price} onChange={handleChange} required min={0} />
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            <span>판매중</span>
          </div>
          <textarea name="description" placeholder="설명" value={form.description} onChange={handleChange} className="border rounded p-2 col-span-1 md:col-span-4" />
          <Button type="submit" className="col-span-1 md:col-span-4 mt-2">
            {editingId ? '수정 완료' : '상품 등록'}
          </Button>
        </form>
      </Card>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">상품명</th>
              <th className="p-2">가격</th>
              <th className="p-2">설명</th>
              <th className="p-2">판매여부</th>
              <th className="p-2">작업</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.price.toLocaleString()}원</td>
                <td className="p-2">{p.description}</td>
                <td className="p-2">{p.isActive ? '판매중' : '중지'}</td>
                <td className="p-2 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(p.id)}>
                    수정
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-400">등록된 상품이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 