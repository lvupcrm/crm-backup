'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  productName: string;
  description?: string;
  price: number;
  validityPeriod: number;
  branchId?: string;
  branch?: {
    id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // 실제로는 API에서 데이터를 가져와야 함. 예시는 localStorage 사용
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const found = products.find((p: Product) => p.id === params.id);
    setProduct(found || null);
  }, [params.id]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div>제품 정보를 찾을 수 없습니다.</div>
        <Button onClick={() => router.back()} className="mt-4">뒤로가기</Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{product.productName} 상세</CardTitle>
        </CardHeader>
        <CardContent>
          <div>제품명: {product.productName}</div>
          <div>설명: {product.description || '-'}</div>
          <div>가격: {product.price.toLocaleString()}원</div>
          <div>유효기간: {product.validityPeriod}일</div>
          <div>지점: {product.branch?.name || '-'}</div>
          <div>상태: {product.isActive ? '활성' : '비활성'}</div>
          <div>생성일: {new Date(product.createdAt).toLocaleDateString()}</div>
          <div>수정일: {new Date(product.updatedAt).toLocaleDateString()}</div>
        </CardContent>
      </Card>
      <Button onClick={() => router.back()} className="mt-4">뒤로가기</Button>
    </div>
  );
}
