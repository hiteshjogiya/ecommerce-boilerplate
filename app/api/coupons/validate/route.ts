import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/src/lib/supabase/server';
import { validateCoupon } from '@/src/services/coupon.service';
import { logger } from '@/src/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { code, orderTotal } = await request.json();
    if (!code || typeof orderTotal !== 'number') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const result = await validateCoupon(code, user.id, orderTotal);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ coupon: result.coupon, discount: result.discount });
  } catch (error) {
    logger.error('Error validating coupon', { error });
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
