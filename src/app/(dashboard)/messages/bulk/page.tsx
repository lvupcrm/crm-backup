"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const SENDER_PROFILES = ["발신프로필", "프로필A", "프로필B"];
const TEMPLATES = ["템플릿1", "템플릿2"];

export default function BulkMessagePage() {
  const [tab, setTab] = useState("alimtalk");
  const [profile, setProfile] = useState(SENDER_PROFILES[0]);
  const [template, setTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [reserve, setReserve] = useState(false);
  const [uniqueOnly, setUniqueOnly] = useState(true);

  return (
    <div className="p-6 bg-[#f7f9fb] min-h-screen">
      {/* 상단 탭 */}
      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList className="w-full flex gap-2">
          <TabsTrigger value="sms" className="flex-1">문자</TabsTrigger>
          <TabsTrigger value="alimtalk" className="flex-1">알림톡</TabsTrigger>
          <TabsTrigger value="friendtalk" className="flex-1">친구톡</TabsTrigger>
          <TabsTrigger value="kakao" className="flex-1">카카오톡 설정</TabsTrigger>
          <TabsTrigger value="guide" className="flex-1">이용안내</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* 탭별 내용 */}
      {(tab === "alimtalk" || tab === "friendtalk" || tab === "sms") && (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* 좌측: 미리보기+가이드 */}
          <div className="flex-1 min-w-[320px]">
            <Card className="mb-4 bg-blue-50 border-blue-200">
              <div className="p-3 text-blue-700 font-bold text-sm border-b border-blue-100">
                {tab === "alimtalk" && "알림톡 이렇게 보낼 수 있어요!"}
                {tab === "friendtalk" && "친구톡 이렇게 보낼 수 있어요!"}
                {tab === "sms" && "문자 이렇게 보낼 수 있어요!"}
              </div>
              <div className="p-4 text-xs text-blue-700">
                {tab === "alimtalk" && <><div className="mb-2">① 정보성 메시지만 발송 가능(광고성 메시지는 친구톡을 이용해주세요)</div><div className="mb-2">② 채널 추가하지 않은 이용자에게도 발송 가능</div></>}
                {tab === "friendtalk" && <><div className="mb-2">① 광고성 메시지 발송 가능</div><div className="mb-2">② 친구 추가된 이용자만 발송 가능</div></>}
                {tab === "sms" && <><div className="mb-2">① 모든 휴대폰 번호로 발송 가능</div><div className="mb-2">② 장문/포토/SMS/MMS 지원</div></>}
              </div>
            </Card>
            <Card className="p-0 overflow-hidden">
              <div className="bg-yellow-200 text-gray-800 font-bold text-xs px-3 py-2 border-b border-yellow-300">발송톡 미리보기</div>
              <textarea
                className="w-full min-h-[120px] p-4 text-base bg-yellow-50 border-0 focus:ring-0 resize-none"
                placeholder="템플릿 내용을 입력하세요."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </Card>
          </div>
          {/* 우측: 발신/템플릿/번호입력/받는사람 */}
          <div className="flex-1 min-w-[340px]">
            <div className="flex gap-2 mb-3">
              <Select value={profile} onValueChange={setProfile}>
                <SelectTrigger className="w-48"><SelectValue placeholder="발신프로필" /></SelectTrigger>
                <SelectContent>
                  {SENDER_PROFILES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline">발신프로필 등록</Button>
            </div>
            <div className="flex gap-2 mb-3">
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger className="w-48"><SelectValue placeholder="템플릿 선택" /></SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline">신규 템플릿 등록</Button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Button variant="outline">불러오기</Button>
              <Button variant="outline">직접입력</Button>
              <Button variant="outline">최근 발송 내역</Button>
              <Button variant="outline">주소록 불러오기</Button>
              <Button variant="outline">메모장 불러오기</Button>
              <Button variant="outline">엑셀 불러오기</Button>
            </div>
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">받는사람</div>
                <textarea
                  className="w-full min-h-[100px] p-3 border rounded bg-gray-50 text-sm"
                  placeholder="받는사람 번호를 입력하거나 불러오세요."
                  value={recipients.join("\n")}
                  onChange={e => setRecipients(e.target.value.split("\n"))}
                />
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              <Button variant="outline" className="flex-1">주소록에 저장</Button>
              <Button variant="outline" className="flex-1">전체삭제</Button>
            </div>
            <div className="flex justify-between items-center bg-gray-100 rounded px-4 py-2 mt-2">
              <span className="text-sm">전체</span>
              <span className="font-bold text-lg">{recipients.length}명</span>
            </div>
            <div className="flex justify-between items-center mt-6 mb-2 border-t pt-4 border-dashed border-gray-300">
              <label className="flex items-center gap-2 text-base font-medium">
                <Checkbox checked={reserve} onCheckedChange={checked => setReserve(checked === true)} />
                예약 발송 설정
              </label>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Checkbox checked={uniqueOnly} onCheckedChange={checked => setUniqueOnly(checked === true)} />
              <span className="text-base font-medium">중복번호 한 번만 발송하기</span>
              <span className="text-xs text-red-600 ml-2">중복번호는 한 번만 발송됩니다.</span>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-6 rounded-none mt-6">발송하기</Button>
          </div>
        </div>
      )}
      {tab === "kakao" && (
        <Card className="p-8 text-center text-lg font-bold text-gray-700 bg-white">카카오톡 발신/템플릿/채널 설정 안내 및 관리 기능이 여기에 들어갑니다.</Card>
      )}
      {tab === "guide" && (
        <Card className="p-8 text-center text-lg font-bold text-gray-700 bg-white">이용안내 및 발송 정책, 주의사항, FAQ 등이 여기에 들어갑니다.</Card>
      )}
    </div>
  );
} 