import { NextRequest, NextResponse } from 'next/server';
import { updateProduct, deleteProduct, getProductById } from '@/src/services/admin-product.service';
import { hasTrustedOrigin } from '@/src/lib/security';
import { assertAdminRole } from '@/src/services/admin-auth.service';
import { logger } from '@/src/lib/logger';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await assertAdminRole();

    const { id } = await params;

    const product = await getProductById(id);

    return NextResponse.json(product);
  } catch (error) {
    logger.error('Error fetching product', { error });

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    await assertAdminRole();

    const { id } = await params;
    const body = await request.json();

    const product = await updateProduct({
      id,
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

    return NextResponse.json(product);
  } catch (error) {
    logger.error('Error updating product', { error });

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    await assertAdminRole();

    const { id } = await params;

    await deleteProduct(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting product', { error });

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      if (error.message === 'Cannot delete product with existing orders') {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
