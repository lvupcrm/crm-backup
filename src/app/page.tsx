'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLoading } from '@/components/ui/loading';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 고객 관리 페이지로 리다이렉트
    router.push('/customers/consultation');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Fitness CRM</h1>
        <PageLoading />
      </div>
    </div>
  );
}
