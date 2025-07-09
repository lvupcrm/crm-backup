'use client';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full flex items-center justify-between pt-3 pb-4 pl-2 pr-2 bg-gray-900 shadow">
      {/* Left: PRO, 문자 잔여, 충전, 뒤로가기, 새로고침 */}
      <div className="flex items-center gap-2">
        <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">PRO</span>
        <span className="text-sm text-gray-100">문자 잔여 <span className="font-bold">4883건</span></span>
        <button className="ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded">충전</button>
        <button className="ml-2 p-2 rounded hover:bg-gray-800 text-gray-200">
          <ArrowLeft size={20} />
        </button>
        <button className="p-2 rounded hover:bg-gray-800 text-gray-200">
          <RotateCcw size={20} />
        </button>
      </div>
      {/* Right: Branch select, center name, change, logout */}
      <div className="flex items-center gap-2">
        <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white">
          <option className="text-black">스테이피트니스 (둔전점)</option>
        </select>
        <span className="text-sm text-gray-400">|</span>
        <span className="text-sm text-gray-100">센터 박석영</span>
        <button className="ml-1 px-2 py-1 text-xs bg-gray-800 text-white rounded">변경</button>
        <span className="text-sm text-gray-400">|</span>
        <button className="ml-1 px-2 py-1 text-xs bg-gray-800 text-white rounded">로그아웃</button>
      </div>
    </header>
  );
}
