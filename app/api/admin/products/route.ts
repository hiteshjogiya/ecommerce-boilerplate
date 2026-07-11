import { NextRequest, NextResponse } from 'next/server';
import { getAdminProducts, createProduct } from '@/src/services/admin-product.service';
import { hasTrustedOrigin } from '@/src/lib/security';
import { assertAdminRole } from '@/src/services/admin-auth.service';
import { logger } from '@/src/lib/logger';

export async function GET(request: NextRequest) {
  try {
    await assertAdminRole();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const category_id = searchParams.get('category_id') || '';

    const { products, total } = await getAdminProducts({
      search: search || undefined,
      category_id: category_id || undefined,
      page,
      pageSize: 20,
    });

    return NextResponse.json({ products, total });
  } catch (error) {
    logger.error('Error fetching products', { error });

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    await assertAdminRole();

    const body = await request.json();

    const product = await createProduct({
      title: body.title,
      slug: body.slug,
      category_id: body.category_id,
      description: body.description,
      price: body.price,
      compare_price: body.compare_price,
      stock: body.stock,
      featured: body.featured,
      active: body.active,
      thumbnail: body.image_url,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    logger.error('Error creating product', { error });

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
