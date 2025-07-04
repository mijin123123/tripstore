import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { checkAdminPermissionServer } from '@/lib/admin-auth-server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const supabase = createClient();
    
    // ê³µì??¬í•­ ëª©ë¡ ê°€?¸ì˜¤ê¸?
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('ê³µì??¬í•­ ëª©ë¡ ì¡°íšŒ ?¤ë¥˜:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('ê³µì??¬í•­ ëª©ë¡ ì¡°íšŒ ì¤??ˆì™¸ ë°œìƒ:', error);
    return new NextResponse(
      JSON.stringify({ error: 'ê³µì??¬í•­ ëª©ë¡ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.' }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // ê´€ë¦¬ì ê¶Œí•œ ?•ì¸
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'ë¡œê·¸?¸ì´ ?„ìš”?©ë‹ˆ??' }),
        { status: 401 }
      );
    }
    
    const isAdmin = await checkAdminPermissionServer(session.user.email);
    
    if (!isAdmin) {
      return new NextResponse(
        JSON.stringify({ error: 'ê´€ë¦¬ì ê¶Œí•œ???†ìŠµ?ˆë‹¤.' }),
        { status: 403 }
      );
    }
    
    // ?”ì²­ ?°ì´???Œì‹±
    const noticeData = await request.json();
    
    // UUID ?ì„±
    const uuid = crypto.randomUUID();
    noticeData.id = uuid;
    
    // Supabase???°ì´???½ì…
    const { data, error } = await supabase
      .from('notices')
      .insert(noticeData)
      .select()
      .single();
    
    if (error) {
      console.error('ê³µì??¬í•­ ?ì„± ?¤ë¥˜:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('ê³µì??¬í•­ ?ì„± ì¤??ˆì™¸ ë°œìƒ:', error);
    return new NextResponse(
      JSON.stringify({ error: 'ê³µì??¬í•­ ?ì„± ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.' }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createClient();
    
    // Supabase?ì„œ ê³µì??¬í•­ ì¡°íšŒ
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('ê³µì??¬í•­ ì¡°íšŒ ?¤ë¥˜:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('ê³µì??¬í•­ ì¡°íšŒ ì¤??ˆì™¸ ë°œìƒ:', error);
    return new NextResponse(
      JSON.stringify({ error: 'ê³µì??¬í•­ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.' }),
      { status: 500 }
    );
  }
}
