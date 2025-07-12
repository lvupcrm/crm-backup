'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CustomerTable } from '@/components/customers/CustomerTable';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { api } from '@/lib/api/client';

export default function RegisteredCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: customers, isLoading } = useQuery({
    queryKey: ['registered-customers', searchTerm],
    queryFn: async () => {
      const res = await api.getRegisteredCustomers(searchTerm);
      return res || [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">등록 고객 목록</h1>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="이름, 연락처로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : (
          <CustomerTable
            customers={customers || []}
            type="registered"
          />
        )}
      </div>
    </div>
  );
}
