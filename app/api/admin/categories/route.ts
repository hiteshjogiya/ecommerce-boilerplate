import { NextRequest, NextResponse } from 'next/server';
import { getAdminCategories, createCategory } from '@/src/services/admin-category.service';
import { hasTrustedOrigin } from '@/src/lib/security';
import { assertAdminRole } from '@/src/services/admin-auth.service';
import { logger } from '@/src/lib/logger';

export async function GET(request: NextRequest) {
  try {
    await assertAdminRole();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';

    const { categories, total } = await getAdminCategories({
      search: search || undefined,
      page,
      pageSize: 20,
    });

    return NextResponse.json({ categories, total });
  } catch (error) {
    logger.error('Error fetching categories', { error });

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    await assertAdminRole();

    const body = await request.json();

    const category = await createCategory({
      name: body.name,
      slug: body.slug,
      image: body.image_url,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    logger.error('Error creating category', { error });

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
