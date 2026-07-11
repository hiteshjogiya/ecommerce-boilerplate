import { NextRequest, NextResponse } from 'next/server';
import { updateCategory, deleteCategory, getCategoryById } from '@/src/services/admin-category.service';
import { hasTrustedOrigin } from '@/src/lib/security';
import { assertAdminRole } from '@/src/services/admin-auth.service';
import { logger } from '@/src/lib/logger';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await assertAdminRole();

    const { id } = await params;

    const category = await getCategoryById(id);

    return NextResponse.json(category);
  } catch (error) {
    logger.error('Error fetching category', { error });

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
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

    const category = await updateCategory({
      id,
      name: body.name,
      slug: body.slug,
      image: body.image_url,
    });

    return NextResponse.json(category);
  } catch (error) {
    logger.error('Error updating category', { error });

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    await assertAdminRole();

    const { id } = await params;

    await deleteCategory(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting category', { error });

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      if (error.message.includes('Cannot delete category'))
        return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
