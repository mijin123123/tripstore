import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: '?´ë©”?¼ê³¼ ??ë¹„ë?ë²ˆí˜¸ê°€ ?„ìš”?©ë‹ˆ??' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'ë¹„ë?ë²ˆí˜¸??ìµœì†Œ 6???´ìƒ?´ì–´???©ë‹ˆ??' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // ?´ë‹¹ ?´ë©”?¼ì˜ ?¬ìš©??ì°¾ê¸°
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('?¬ìš©??ì¡°íšŒ ?¤ë¥˜:', getUserError);
      return NextResponse.json(
        { error: '?¬ìš©??ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.' },
        { status: 500 }
      );
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { error: '?´ë‹¹ ?´ë©”?¼ì˜ ?¬ìš©?ë? ì°¾ì„ ???†ìŠµ?ˆë‹¤.' },
        { status: 404 }
      );
    }

    // ê´€ë¦¬ì ê¶Œí•œ?¼ë¡œ ë¹„ë?ë²ˆí˜¸ ë³€ê²?
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('ë¹„ë?ë²ˆí˜¸ ë³€ê²??¤ë¥˜:', updateError);
      return NextResponse.json(
        { error: 'ë¹„ë?ë²ˆí˜¸ ë³€ê²?ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'ë¹„ë?ë²ˆí˜¸ê°€ ?±ê³µ?ìœ¼ë¡?ë³€ê²½ë˜?ˆìŠµ?ˆë‹¤.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('ë¹„ë?ë²ˆí˜¸ ?¬ì„¤??API ?¤ë¥˜:', error);
    return NextResponse.json(
      { error: '?œë²„ ?¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.' },
      { status: 500 }
    );
  }
}
