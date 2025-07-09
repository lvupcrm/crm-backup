'use client'

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface MessageHistory {
  id: string;
  recipient: string;
  content: string;
  sentAt: string;
  status: '성공' | '실패';
}

export default function MessageHistoryPage() {
  const [history, setHistory] = useState<MessageHistory[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('messageHistory');
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">메시지 발송 내역</h2>
      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">수신자</th>
                <th className="p-2">내용</th>
                <th className="p-2">발송일시</th>
                <th className="p-2">상태</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-b">
                  <td className="p-2">{h.recipient}</td>
                  <td className="p-2">{h.content}</td>
                  <td className="p-2">{h.sentAt}</td>
                  <td className="p-2">{h.status}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-400">발송 내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 