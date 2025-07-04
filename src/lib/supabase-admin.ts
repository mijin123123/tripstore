"use client";

import { createClient } from '@/lib/supabase';

/**
 * 관리자 API 호출용 Supabase 클라이언트
 */
export const supabase = createClient();
