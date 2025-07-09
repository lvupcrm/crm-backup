'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'

export function RecentCustomers() {
  const { data: customers } = useQuery({
    queryKey: ['recent-customers'],
    queryFn: api.getRecentRegisteredCustomers,
  })

  return (
    <div className="space-y-4">
      {customers?.map((customer: any) => (
        <div key={customer.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {customer.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{customer.name}</p>
            <p className="text-sm text-muted-foreground">
              {customer.membershipType} · {customer.trainer?.name || '미배정'}
            </p>
          </div>
          <div className="ml-auto font-medium text-sm">
            {new Date(customer.joinDate).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
} 