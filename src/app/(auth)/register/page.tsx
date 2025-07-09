'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSuccess(false)

    // LocalStorage에 유저 저장
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find((u: any) => u.email === form.email)) {
      setError('이미 존재하는 이메일입니다.')
      setLoading(false)
      return
    }
    users.push(form)
    localStorage.setItem('users', JSON.stringify(users))
    setSuccess(true)
    setTimeout(() => router.push('/login'), 1500)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default">
                <AlertDescription>회원가입 성공! 로그인 페이지로 이동합니다.</AlertDescription>
              </Alert>
            )}
            <div>
              <Label htmlFor="name">이름</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">이메일</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '가입 중...' : '회원가입'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 