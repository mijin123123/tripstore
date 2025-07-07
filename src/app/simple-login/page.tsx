import { redirect } from 'next/navigation';

export default function SimpleLoginRedirect() {
  // 서버 사이드에서 즉시 리다이렉트
  redirect('/login');
}