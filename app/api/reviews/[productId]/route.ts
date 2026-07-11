import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/src/lib/supabase/server';
import { hasTrustedOrigin } from '@/src/lib/security';
import { logger } from '@/src/lib/logger';
import {
  getProductReviews,
  getProductRatingSummary,
  getUserReviewForProduct,
  canUserReviewProduct,
  createReview,
} from '@/src/services/review.service';

export async function GET(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const sort = (searchParams.get('sort') || 'newest') as 'newest' | 'highest' | 'lowest';

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    const [{ reviews, total }, summary, userReview, canReview] = await Promise.all([
      getProductReviews(productId, page, 10, sort),
      getProductRatingSummary(productId),
      user ? getUserReviewForProduct(user.id, productId) : Promise.resolve(null),
      user ? canUserReviewProduct(user.id, productId) : Promise.resolve(false),
    ]);

    return NextResponse.json({ reviews, total, summary, userReview, canReview });
  } catch (error) {
    logger.error('Error fetching reviews', { error });
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    const { productId } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const canReview = await canUserReviewProduct(user.id, productId);
    if (!canReview) return NextResponse.json({ error: 'Only verified purchasers can review' }, { status: 403 });

    const body = await request.json();
    const review = await createReview({ user_id: user.id, product_id: productId, ...body });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    logger.error('Error creating review', { error });
    const msg = error instanceof Error && error.message.includes('duplicate') ? 'You already reviewed this product' : 'Failed to create review';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
