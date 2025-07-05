"use client";
import { createBrowserClient } from "@supabase/ssr";

let client: any = null;

export function createClient() {
  // 싱글톤 패턴으로 클라이언트 재사용
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
