'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api/client'
import { MessageTemplate } from '@/lib/types'

const VARIABLE_TAGS = [
  { label: '이름', value: '{{이름}}' },
  { label: '연락처', value: '{{연락처}}' },
  { label: '날짜', value: '{{날짜}}' },
  { label: '시간', value: '{{시간}}' },
  { label: '지점명', value: '{{지점명}}' },
  { label: '상품명', value: '{{상품명}}' },
  { label: '금액', value: '{{금액}}' },
]

export default function CreateTemplatePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    templateName: '',
    channel: '알림톡',
    templateCode: '',
    content: '',
  })

  const createMutation = useMutation({
    mutationFn: (data: Partial<MessageTemplate>) => api.createMessageTemplate(data),
    onSuccess: () => {
      router.push('/messages/templates')
    },
  })

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = formData.content
    const newText = text.substring(0, start) + variable + text.substring(end)
    
    setFormData({ ...formData, content: newText })
    
    // 커서 위치 조정
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + variable.length
      textarea.focus()
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 변수 추출
    const variables = formData.content.match(/{{[^}]+}}/g) || []
    const uniqueVariables = [...new Set(variables)]
    
    createMutation.mutate({
      ...formData,
      variables: uniqueVariables,
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">메시지 템플릿 만들기</h1>
        <p className="text-gray-600 mt-2">고객에게 발송할 메시지 템플릿을 생성합니다</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="templateName">템플릿 이름 *</Label>
              <Input
                id="templateName"
                value={formData.templateName}
                onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                placeholder="예: 상담 예약 확인 메시지"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="channel">발송 채널 *</Label>
                <Select
                  value={formData.channel}
                  onValueChange={(value) => setFormData({ ...formData, channel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="알림톡">알림톡</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="templateCode">템플릿 코드</Label>
                <Input
                  id="templateCode"
                  value={formData.templateCode}
                  onChange={(e) => setFormData({ ...formData, templateCode: e.target.value })}
                  placeholder="예: CONSULT_CONFIRM_001"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>메시지 내용</CardTitle>
            <CardDescription>
              변수를 클릭하여 메시지에 삽입할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>사용 가능한 변수</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {VARIABLE_TAGS.map((tag) => (
                  <Badge
                    key={tag.value}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => insertVariable(tag.value)}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="content">메시지 내용 *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                placeholder={`안녕하세요 {{이름}}님,\n\n{{날짜}} {{시간}}에 예약하신 상담 일정을 안내드립니다.\n장소: {{지점명}}\n\n감사합니다.`}
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                {formData.channel === '알림톡' ? '최대 1000자' : 'SMS는 90자, LMS는 2000자까지 입력 가능'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg p-4 max-w-sm mx-auto">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-500 mb-2">{formData.channel}</div>
                <div className="whitespace-pre-wrap text-sm">
                  {formData.content || '메시지 내용을 입력하세요'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/messages/templates')}
          >
            취소
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? '저장 중...' : '템플릿 생성'}
          </Button>
        </div>
      </form>
    </div>
  )
}