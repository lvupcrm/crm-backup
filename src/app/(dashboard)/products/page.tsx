"use client";
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function formatPrice(price) {
  return price.toLocaleString();
}

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [tab, setTab] = useState("products");
  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    validityPeriod: "",
    isActive: true,
  });

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { apiClient } = await import("@/lib/api/client");
      const response = await apiClient.get('/products');
      return response.data;
    },
    initialData: [],
  });
  // Fetch payments
  const { data: payments } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { apiClient } = await import("@/lib/api/client");
      const response = await apiClient.get('/payments');
      return response.data;
    },
    initialData: [],
  });

  // Add/Edit product
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { apiClient } = await import("@/lib/api/client");
      if (editProduct) {
        const response = await apiClient.put(`/products/${editProduct.id}`, payload);
        return response.data;
      } else {
        const response = await apiClient.post('/products', payload);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setModalOpen(false);
      setEditProduct(null);
      setForm({ productName: "", description: "", price: "", validityPeriod: "", isActive: true });
    },
  });

  // Toggle active status
  const toggleMutation = useMutation({
    mutationFn: async (p) => {
      const { apiClient } = await import("@/lib/api/client");
      const response = await apiClient.put(`/products/${p.id}`, { ...p, isActive: !p.isActive });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  // Summary stats
  const totalProducts = products?.length || 0;
  const activeProducts = products?.filter((p) => p.isActive).length || 0;
  const monthlyRevenue = useMemo(() => {
    if (!payments) return 0;
    const now = new Date();
    return payments
      .filter((pay) => new Date(pay.paymentDate).getMonth() === now.getMonth() && new Date(pay.paymentDate).getFullYear() === now.getFullYear())
      .reduce((sum, pay) => sum + pay.amount, 0);
  }, [payments]);

  // Payment history (recent 10)
  const recentPayments = useMemo(() => {
    if (!payments) return [];
    return payments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)).slice(0, 10);
  }, [payments]);

  // Handlers
  const openAdd = () => {
    setEditProduct(null);
    setForm({ productName: "", description: "", price: "", validityPeriod: "", isActive: true });
    setModalOpen(true);
  };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      productName: p.productName,
      description: p.description,
      price: p.price,
      validityPeriod: p.validityPeriod,
      isActive: p.isActive,
    });
    setModalOpen(true);
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      price: Number(form.price),
      validityPeriod: Number(form.validityPeriod),
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] px-2 sm:px-6 md:px-10 py-4">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-4">상품 관리</h1>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 flex flex-col items-center"><div className="text-lg font-bold">총 상품</div><div className="text-2xl font-extrabold text-blue-600">{totalProducts}</div></Card>
        <Card className="p-4 flex flex-col items-center"><div className="text-lg font-bold">활성 상품</div><div className="text-2xl font-extrabold text-green-600">{activeProducts}</div></Card>
        <Card className="p-4 flex flex-col items-center"><div className="text-lg font-bold">월 매출</div><div className="text-2xl font-extrabold text-yellow-600">{formatPrice(monthlyRevenue)}원</div></Card>
      </div>
      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList className="w-full flex gap-4 justify-center bg-transparent mb-3">
          <TabsTrigger value="products">상품 목록</TabsTrigger>
          <TabsTrigger value="payments">결제 내역</TabsTrigger>
        </TabsList>
      </Tabs>
      {tab === "products" && (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={openAdd}>+ 상품 등록</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products && products.length > 0 ? products.map((p) => (
              <Card key={p.id} className="p-4 flex flex-col justify-between h-full rounded-2xl shadow-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold">{p.productName}</span>
                    <Badge variant={p.isActive ? "default" : "secondary"}>{p.isActive ? "활성" : "비활성"}</Badge>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">{p.description}</div>
                  <div className="text-base font-semibold mb-1">가격: <span className="text-blue-700">{formatPrice(p.price)}원</span></div>
                  <div className="text-sm mb-1">유효기간: {p.validityPeriod}일</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(p)}>수정</Button>
                  <Switch checked={p.isActive} onCheckedChange={() => toggleMutation.mutate(p)} />
                </div>
              </Card>
            )) : (
              <div className="col-span-full text-center text-gray-400 py-12 text-lg font-semibold">등록된 상품이 없습니다.</div>
            )}
          </div>
        </>
      )}
      {tab === "payments" && (
        <Card className="p-4">
          <div className="text-lg font-bold mb-4">최근 결제 내역</div>
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">고객명</th>
                <th className="p-2">상품명</th>
                <th className="p-2">결제금액</th>
                <th className="p-2">결제일</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.length > 0 ? recentPayments.map((pay, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{pay.customerName || pay.customer?.name || "-"}</td>
                  <td className="p-2">{pay.productName || pay.product?.productName || "-"}</td>
                  <td className="p-2">{formatPrice(pay.amount)}원</td>
                  <td className="p-2">{new Date(pay.paymentDate).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="text-center p-8 text-gray-500">결제 내역이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editProduct ? "상품 수정" : "상품 등록"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="productName">상품명</Label>
              <Input id="productName" name="productName" value={form.productName} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="description">설명</Label>
              <Input id="description" name="description" value={form.description} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="price">가격(원)</Label>
              <Input id="price" name="price" type="number" value={form.price} onChange={handleChange} required min={0} />
            </div>
            <div>
              <Label htmlFor="validityPeriod">유효기간(일)</Label>
              <Input id="validityPeriod" name="validityPeriod" type="number" value={form.validityPeriod} onChange={handleChange} required min={1} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))} />
              <Label>활성화</Label>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>취소</Button>
              <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "저장 중..." : editProduct ? "수정" : "등록"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
