import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/src/lib/supabase/server';
import { updateReview, deleteReview } from '@/src/services/review.service';
import { hasTrustedOrigin } from '@/src/lib/security';
import { logger } from '@/src/lib/logger';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const review = await updateReview(id, user.id, body);
    return NextResponse.json(review);
  } catch (error) {
    logger.error('Error updating review', { error });
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await deleteReview(id, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting review', { error });
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
