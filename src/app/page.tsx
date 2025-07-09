'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      setUser(JSON.parse(stored));
      // 로그인된 사용자는 CRM으로 리다이렉트
      router.replace('/crm');
    } else {
      // 로그인되지 않은 사용자는 로그인 페이지로 리다이렉트
      router.replace('/login');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </main>
    );
  }

  return null;
}
