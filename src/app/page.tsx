import { redirect } from 'next/navigation';

export default function Home() {
  // ودّي المستخدم دايمًا للداشبورد
  redirect('/dashboard');
}
