"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CHANNELS = [
  { value: "alimtalk", label: "알림톡 템플릿 예시" },
  { value: "friendtalk", label: "친구톡 템플릿 예시" },
];

const CATEGORIES = [
  { value: "new", label: "신규" },
  { value: "remind", label: "리마인드" },
  { value: "softlanding", label: "소프트랜딩" },
];

const TEMPLATE_TYPES = [
  { value: "basic", label: "기본형", icon: null },
  { value: "emphasis", label: "강조표기형", icon: null },
  { value: "image", label: "이미지첨부형", icon: null },
  { value: "list", label: "리스트형", icon: null },
];

type Example = {
  id: number;
  name: string;
  channel: string;
  content: string;
  variables: string[];
  type: string;
};

type ExampleCategory = Record<string, Example[]>;

type ExampleData = Record<string, ExampleCategory>;

// Dummy example data
const EXAMPLES: ExampleData = {
  alimtalk: {
    new: [
      { id: 1, name: "리뷰 요청 안내", channel: "알림톡", content: `#\u007B고객명\u007D 회원님,\n스테이피트니스 등록 감사합니다 😊\n\n회원님의 소중한 리뷰는 서비스 개선에 큰 힘이 됩니다.\n\n💬 영수증이 필요하신 경우 데스크로 문의 주세요.\n\n채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기`, variables: ["고객명"], type: "basic" },
      { id: 2, name: "강조 안내", channel: "알림톡", content: `중요 안내\n\n[이름]님, 꼭 확인해주세요!`, variables: ["이름"], type: "emphasis" },
      { id: 3, name: "이미지 안내", channel: "알림톡", content: `이미지 첨부 예시\n\n[이름]님, 이미지를 확인하세요.`, variables: ["이름"], type: "image" },
      { id: 4, name: "리스트 안내", channel: "알림톡", content: `리스트 안내\n\n- 항목1\n- 항목2\n- 항목3`, variables: [], type: "list" },
    ],
    remind: [
      { id: 5, name: "상담 예약 리마인드", channel: "알림톡", content: "[이름]님, 내일 상담 예약이 있습니다.", variables: ["이름"], type: "basic" },
    ],
    softlanding: [
      { id: 6, name: "소프트랜딩 안내", channel: "알림톡", content: "[이름]님, 오랜만에 방문해주셔서 감사합니다.", variables: ["이름"], type: "basic" },
    ],
  },
  friendtalk: {
    new: [
      { id: 7, name: "친구톡 신규 안내", channel: "친구톡", content: `#\u007B고객명\u007D 회원님,\n스테이피트니스 친구톡 신규 안내입니다!\n\n친구톡으로 다양한 소식을 받아보세요.\n\n💬 문의사항은 언제든 연락주세요.\n\n채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기`, variables: ["고객명"], type: "basic" },
      { id: 8, name: "강조 안내", channel: "친구톡", content: `중요 안내\n\n[이름]님, 꼭 확인해주세요!`, variables: ["이름"], type: "emphasis" },
      { id: 9, name: "이미지 안내", channel: "친구톡", content: `이미지 첨부 예시\n\n[이름]님, 이미지를 확인하세요.`, variables: ["이름"], type: "image" },
      { id: 10, name: "리스트 안내", channel: "친구톡", content: `리스트 안내\n\n- 항목1\n- 항목2\n- 항목3`, variables: [], type: "list" },
    ],
    remind: [
      { id: 11, name: "친구톡 리마인드", channel: "친구톡", content: "[이름]님, 친구톡 리마인드 메시지입니다.", variables: ["이름"], type: "basic" },
    ],
    softlanding: [
      { id: 12, name: "친구톡 소프트랜딩", channel: "친구톡", content: "[이름]님, 친구톡 소프트랜딩 안내입니다.", variables: ["이름"], type: "basic" },
    ],
  },
};

function KakaoLogo({ channel }: { channel: string }) {
  const text = channel === "알림톡" ? "kakao" : "chingu";
  return (
    <div style={{
      background: '#222',
      color: '#fff',
      borderRadius: '50%',
      width: 32,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: '-1px',
      border: '2px solid #fff',
      boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
    }}>
      {text}
    </div>
  );
}

function KakaoStyleCard({ ex }: { ex: Example }) {
  const lines = ex.content.split('\n');
  const title = lines[0];
  const subtitle = lines[1];
  const body = lines.slice(2, lines.length - 2).join('\n');
  const footer = lines.slice(-2).join('\n');
  const topBarText = ex.channel === "알림톡" ? "알림톡 도착" : "친구톡 도착";
  return (
    <div
      className="rounded-2xl shadow-xl overflow-hidden bg-[#e5efff] flex flex-col h-full transition-transform hover:scale-[1.03]"
      style={{ border: '1.5px solid #dbeafe', minHeight: 300 }}
    >
      <div className="flex items-center justify-between px-4 py-2" style={{ background: '#ffe812' }}>
        <span className="text-xs font-bold text-gray-700 tracking-wide">{topBarText}</span>
        <KakaoLogo channel={ex.channel} />
      </div>
      <div className="flex-1 flex flex-col bg-white px-3 py-2">
        <div className="text-xs text-gray-400 mb-1">스테이피트니스 둔전점</div>
        <div className="text-base font-bold text-gray-900 mb-2" style={{ lineHeight: 1.2 }}>{title}</div>
        <div className="text-sm font-semibold text-gray-800 mb-2">{subtitle}</div>
        <div className="text-xs text-gray-700 whitespace-pre-line mb-3">{body}</div>
        <div className="border-t border-gray-200 my-2" />
        <div className="text-xs text-gray-500 whitespace-pre-line mb-2">{footer}</div>
        <div className="flex flex-col gap-2 mt-4">
          <button
            className="w-full rounded bg-[#ffe812] text-gray-900 font-bold py-1.5 text-sm border border-[#ffe812] hover:bg-yellow-300 transition"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
          >
            채널 추가
          </button>
          <button
            className="w-full rounded bg-gray-100 text-gray-700 font-semibold py-1.5 text-sm border border-gray-200 hover:bg-gray-200 transition"
          >
            {ex.channel === "알림톡" ? "리뷰 작성하기" : "메시지 확인하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChannelBadge({ channel }: { channel: string }) {
  return (
    <Badge variant={channel === "알림톡" ? "default" : "secondary"}>{channel}</Badge>
  );
}

function TemplateTypeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-4">
      <div className="font-bold text-base mb-2 text-center mx-auto w-full" style={{maxWidth:'max-content'}}>
        템플릿 유형
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
        {TEMPLATE_TYPES.map((type) => {
          const selected = value === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              className={`relative flex flex-col items-center justify-center rounded-2xl border bg-gray-50 px-2 py-3 shadow-lg transition-all
                ${selected ? 'border-blue-500 ring-2 ring-blue-200 bg-white' : 'border-gray-200 hover:border-blue-300'}
              `}
              style={{ minHeight: 80 }}
            >
              <div className="w-10 h-6 mb-1 flex items-center justify-center">
                <div className="w-full">
                  <div className="h-2 w-8 rounded bg-yellow-300 mx-auto mb-1" />
                  <div className="h-2 w-6 rounded bg-gray-300 mx-auto mb-0.5" />
                  {type.value === 'image' && <div className="flex justify-end"><span className="inline-block w-4 h-4 bg-blue-100 text-blue-500 text-xs rounded-full flex items-center justify-center">📷</span></div>}
                  {type.value === 'list' && <div className="flex flex-col gap-0.5 mt-1"><div className="h-1 w-6 bg-gray-300 rounded mx-auto" /><div className="h-1 w-6 bg-gray-300 rounded mx-auto" /></div>}
                </div>
              </div>
              <span className={`mt-1 text-sm font-bold ${selected ? 'text-blue-600' : 'text-gray-700'}`}>{type.label}</span>
              <span className={`absolute top-1 right-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected ? 'border-pink-500 bg-white' : 'border-gray-300 bg-white'}`}>
                {selected && <span className="w-2 h-2 rounded-full bg-pink-500 block" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TemplateExamplesPage() {
  const [channelTab, setChannelTab] = useState<keyof ExampleData>("alimtalk");
  const [categoryTab, setCategoryTab] = useState<keyof ExampleCategory>("new");
  const [typeTab, setTypeTab] = useState<string>("basic");

  const allExamples: Example[] = EXAMPLES[channelTab][categoryTab] || [];
  const examples = channelTab === "alimtalk"
    ? allExamples.filter((ex) => ex.type === typeTab)
    : allExamples;

  return (
    <div className="min-h-screen bg-[#f7f9fb] px-2 sm:px-6 md:px-10 py-4">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">카카오톡 템플릿 예시</h1>
        <Tabs value={channelTab} onValueChange={v => setChannelTab(v as keyof ExampleData)} className="mb-6">
          <TabsList className="w-full flex gap-4 justify-center bg-transparent mb-3">
            {CHANNELS.map((c) => (
              <TabsTrigger
                key={c.value}
                value={c.value}
                className={`flex-1 min-w-[180px] max-w-xs h-10 px-4 rounded-full text-base font-bold transition-all
                  border-2
                  ${channelTab === c.value
                    ? 'bg-white border-blue-400 text-blue-700 shadow-md'
                    : 'bg-gray-100 border-gray-200 text-gray-400'}
                `}
                style={{ boxShadow: channelTab === c.value ? '0 2px 12px rgba(0,0,0,0.06)' : undefined }}
              >
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {channelTab === "alimtalk" && (
          <TemplateTypeSelector value={typeTab} onChange={setTypeTab} />
        )}
        <Tabs value={categoryTab} onValueChange={v => setCategoryTab(v as keyof ExampleCategory)} className="mb-6">
          <TabsList className="w-full flex gap-2 justify-center bg-transparent">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className={`flex-1 min-w-[120px] max-w-xs h-8 px-3 rounded-full text-sm font-semibold transition-all
                  border
                  ${categoryTab === cat.value
                    ? 'bg-white border-blue-400 text-blue-700 shadow-sm'
                    : 'bg-gray-100 border-gray-200 text-gray-400'}
                `}
                style={{ boxShadow: categoryTab === cat.value ? '0 2px 8px rgba(0,0,0,0.04)' : undefined }}
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
        {examples.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12 text-lg font-semibold">예시가 없습니다.</div>
        ) : (
          examples.map((ex: Example) => (
            <KakaoStyleCard key={ex.id} ex={ex} />
          ))
        )}
      </div>
    </div>
  );
} 