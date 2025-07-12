import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { email, password, name } = await req.json()

  if (!email || !password || !name) {
    return NextResponse.json({ error: '모든 필드를 입력하세요.' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: '이미 존재하는 이메일입니다.' }, { status: 409 })
  }

  // 기본 역할을 찾거나 생성
  let defaultRole = await prisma.role.findFirst({
    where: { name: 'staff' }
  })

  if (!defaultRole) {
    defaultRole = await prisma.role.create({
      data: {
        name: 'staff',
        permissions: {
          customers: {
            view: true,
            create: false,
            edit: false,
            delete: false
          },
          messages: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            send: false
          },
          products: {
            view: true,
            create: false,
            edit: false,
            delete: false
          },
          statistics: {
            view: false
          },
          settings: {
            view: false,
            edit: false
          }
        }
      }
    })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      roleId: defaultRole.id,
    }
  })

  return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } })
} 