import { redirect } from 'next/navigation';

export default function Home() {
  // 인증된 사용자는 대시보드로, 미인증 사용자는 로그인으로 리다이렉트
  redirect('/customers/consultation');
}
