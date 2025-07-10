'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Users,
  MessageSquare,
  Package,
  BarChart3,
  Settings,
  ChevronDown,
  UserCheck,
  UserX,
  UserPlus,
  Mail,
  FileText,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: '고객관리',
    icon: Users,
    submenu: [
      { title: '상담 고객', href: '/customers/consultation', icon: UserCheck },
      { title: '미등록 고객', href: '/customers/unregistered', icon: UserX },
      { title: '신규 등록 고객', href: '/customers/registered', icon: UserPlus },
    ],
  },
  // 메시지 관리가 캠페인 관리보다 먼저 오도록 위치 변경
  {
    title: '메시지 관리',
    icon: MessageSquare,
    submenu: [
      { title: '템플릿 만들기', href: '/messages/templates/create', icon: FileText },
      { title: '템플릿 목록', href: '/messages/templates', icon: FileText },
      { title: '템플릿 예시 목록', href: '/messages/templates/examples', icon: FileText },
      { title: '단체 메시지 발송', href: '/messages/bulk', icon: Mail },
      { title: '메시지 발송 내역', href: '/messages/logs', icon: Mail },
    ],
  },
  {
    title: '캠페인 관리',
    icon: Mail,
    submenu: [
      { title: '캠페인 만들기', href: '/messages/campaigns/create', icon: Mail },
      { title: '캠페인 목록', href: '/messages/campaigns', icon: Mail },
      { title: '캠페인 예시 목록', href: '/messages/campaigns/examples', icon: Mail },
      { title: '캠페인 성과', href: '/messages/campaigns/performance', icon: Mail },
    ],
  },
  {
    title: '상품/결제관리',
    icon: Package,
    href: '/products',
  },
  {
    title: '통계',
    icon: BarChart3,
    href: '/statistics',
  },
  {
    title: '설정',
    icon: Settings,
    href: '/settings',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['고객관리', '메시지 관리'])

  const toggleExpand = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  return (
    <div className="bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="pt-3 pb-4 pl-2 pr-2">
        <h2 className="text-2xl font-semibold text-left mb-4">Fitness CRM</h2>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.submenu ? (
              <>
                <button
                  onClick={() => toggleExpand(item.title)}
                  className={cn(
                    "w-full flex items-center justify-between py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700",
                    expandedItems.includes(item.title) && "bg-gray-700"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      expandedItems.includes(item.title) && "rotate-180"
                    )}
                  />
                </button>
                {expandedItems.includes(item.title) && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center space-x-3 py-2 px-4 rounded transition duration-200 hover:bg-gray-700",
                          pathname === subItem.href && "bg-blue-600 hover:bg-blue-700"
                        )}
                      >
                        <subItem.icon className="w-4 h-4" />
                        <span className="text-sm">{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href!}
                className={cn(
                  "flex items-center space-x-3 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700",
                  pathname === item.href && "bg-blue-600 hover:bg-blue-700"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}