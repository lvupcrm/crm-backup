'use client'

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface Stat {
  label: string;
  value: number;
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    // 집계 예시: 고객, 상담, 상품, 메시지
    const consult = JSON.parse(localStorage.getItem('consultCustomers') || '[]');
    const unreg = JSON.parse(localStorage.getItem('unregisteredCustomers') || '[]');
    const reg = JSON.parse(localStorage.getItem('registeredCustomers') || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const messages = JSON.parse(localStorage.getItem('messageHistory') || '[]');
    setStats([
      { label: '상담 고객', value: consult.length },
      { label: '미등록 고객', value: unreg.length },
      { label: '신규 등록 고객', value: reg.length },
      { label: '상품', value: products.length },
      { label: '메시지 발송', value: messages.length },
    ]);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">통계</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-6 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">{s.label}</span>
            <span className="text-3xl font-bold">{s.value.toLocaleString()}</span>
          </Card>
        ))}
      </div>
    </div>
  );
} 