import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations, getFrequentlyBoughtTogether } from '@/src/services/recommendation.service';
import { logger } from '@/src/lib/logger';

export async function GET(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params;
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId') || '';
    const type = searchParams.get('type') || 'similar';

    let products;
    if (type === 'bought-together') {
      products = await getFrequentlyBoughtTogether(productId);
    } else {
      products = await getRecommendations(productId, categoryId);
    }

    return NextResponse.json(products);
  } catch (error) {
    logger.error('Error fetching recommendations', { error });
    return NextResponse.json([], { status: 200 });
  }
}
