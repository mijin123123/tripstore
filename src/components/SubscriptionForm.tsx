
"use client";

import { useState } from 'react';
import { Send, Mail } from 'lucide-react';

export default function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 여기에 실제 구독 로직을 추가할 수 있습니다 (예: API 호출).
    console.log(`Subscribing with email: ${email}`);
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 5000); // 5초 후 메시지 숨김
  };

  return (
    <section className="py-20 bg-neutral-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <Mail className="mx-auto h-12 w-12 text-blue-400 mb-4" />
        <h2 className="text-3xl font-extrabold tracking-tight mb-3">
          여행 소식을 가장 먼저 받아보세요
        </h2>
        <p className="text-neutral-300 max-w-2xl mx-auto mb-8">
          새로운 여행 상품, 특별 할인, 유용한 여행 팁을 이메일로 보내드립니다.
        </p>
        {isSubscribed ? (
          <div className="text-lg font-semibold text-green-400 bg-green-900/50 rounded-lg py-3 px-6 inline-block">
            구독해주셔서 감사합니다!
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소를 입력하세요"
              required
              className="flex-grow px-5 py-3 rounded-lg bg-neutral-700 border border-neutral-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-white placeholder-neutral-400"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-blue-500"
            >
              <Send className="mr-2 h-5 w-5" />
              구독하기
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
