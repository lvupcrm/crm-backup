'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { api } from '@/lib/api/client'

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchTerm],
    queryFn: async () => {
      const res = await api.getProducts()
      return res || []
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">상품 관리</h1>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="상품명으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products && products.length > 0 ? (
              products.map((product: any) => (
                <Card key={product.id} className="p-4">
                  <h3 className="text-lg font-semibold">{product.productName}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-lg font-bold text-blue-600">
                    {product.price?.toLocaleString()}원
                  </p>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                등록된 상품이 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
