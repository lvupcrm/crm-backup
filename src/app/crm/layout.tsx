'use client'

import { Sidebar } from '@/components/layout/Sidebar';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        {/* 상단 헤더 - 사이드바와 같은 색상 */}
        <header className="h-12 flex items-center px-6 bg-gray-900 text-white text-sm font-medium w-full">
          <span className="bg-gray-800 rounded-full px-2 py-0.5 text-xs mr-2">PRO</span>
          <span className="mr-2">문자 잔여 <b>4883건</b></span>
          <span className="bg-gray-700 rounded px-2 py-0.5 text-xs mr-2">충전</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-400 hover:bg-gray-800 transition ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-400 hover:bg-gray-800 transition ml-1">
            <RotateCcw className="w-5 h-5 text-gray-300" />
          </button>
          <span className="flex-1" />
          <div className="flex items-center space-x-2">
            <select className="bg-gray-700 rounded px-2 py-0.5 text-xs border-none outline-none">
              <option>스테이피트니스 (둔전점)</option>
              <option>스테이피트니스 (강남점)</option>
            </select>
            <span className="text-gray-400">|</span>
            <span>🏳 센터 박석영</span>
            <button className="bg-white text-gray-900 rounded px-2 py-0.5 text-xs font-bold">변경</button>
            <span className="text-gray-400">|</span>
            <button className="hover:underline">로그아웃</button>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
} 