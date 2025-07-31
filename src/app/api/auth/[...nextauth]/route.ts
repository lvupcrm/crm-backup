import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { loginSchema } from '@/lib/schemas'
import { ZodError } from 'zod'

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Zod 스키마로 입력 검증
          const validatedCredentials = loginSchema.parse(credentials);

          const user = await prisma.user.findUnique({
            where: { email: validatedCredentials.email },
            include: {
              role: true,
              branch: true
            }
          })

          if (!user) {
            // 보안상 이유로 사용자가 존재하지 않는다는 정보를 노출하지 않음
            return null
          }

          const isValidPassword = await bcrypt.compare(validatedCredentials.password, user.password);
          if (!isValidPassword) {
            return null
          }

          // 로그인 성공 로그
          console.log(`User logged in: ${user.email} (${user.id})`);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.name,
            roleId: user.roleId,
            branchId: user.branchId,
            permissions: user.role.permissions
          }
        } catch (error) {
          if (error instanceof ZodError) {
            console.error('Invalid credentials format:', error.errors);
          } else {
            console.error('Login error:', error);
          }
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.roleId = user.roleId
        token.branchId = user.branchId
        token.permissions = user.permissions
      }

      // 세션 업데이트 시 사용자 정보 재조회
      if (trigger === 'update' && session) {
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: {
            role: true,
            branch: true
          }
        });

        if (updatedUser) {
          token.name = updatedUser.name;
          token.role = updatedUser.role.name;
          token.roleId = updatedUser.roleId;
          token.branchId = updatedUser.branchId;
          token.permissions = updatedUser.role.permissions;
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.roleId = token.roleId as string
        session.user.branchId = token.branchId as string
        session.user.permissions = token.permissions as any
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8시간
  },
  jwt: {
    maxAge: 8 * 60 * 60, // 8시간
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`Sign in event: ${user.email}`);
    },
    async signOut({ session, token }) {
      console.log(`Sign out event: ${token?.email || 'unknown'}`);
    },
  },
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }