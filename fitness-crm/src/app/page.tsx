import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard/customers/consultation');
  return null;
}
