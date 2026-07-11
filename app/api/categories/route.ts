import { NextResponse } from 'next/server';
import { getCategories } from '@/src/services/category.service';
import { logger } from '@/src/lib/logger';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    logger.error('Error fetching categories', { error });
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
