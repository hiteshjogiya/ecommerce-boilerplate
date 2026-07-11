import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/src/lib/supabase/server';
import { subscribeToStockNotification, unsubscribeFromStockNotification, isUserSubscribed } from '@/src/services/stock-notification.service';
import { hasTrustedOrigin } from '@/src/lib/security';
import { logger } from '@/src/lib/logger';

export async function POST(request: NextRequest) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId, action } = await request.json();
    if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    if (action === 'unsubscribe') {
      await unsubscribeFromStockNotification(user.id, productId);
      return NextResponse.json({ subscribed: false });
    }

    await subscribeToStockNotification(user.id, productId);
    return NextResponse.json({ subscribed: true });
  } catch (error) {
    logger.error('Error managing stock notification', { error });
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ subscribed: false });

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    if (!productId) return NextResponse.json({ subscribed: false });

    const subscribed = await isUserSubscribed(user.id, productId);
    return NextResponse.json({ subscribed });
  } catch {
    return NextResponse.json({ subscribed: false });
  }
}
