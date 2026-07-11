import { NextRequest, NextResponse } from 'next/server';
import { toggleProductActive } from '@/src/services/admin-product.service';
import { assertAdminRole } from '@/src/services/admin-auth.service';
import { hasTrustedOrigin } from '@/src/lib/security';
import { logger } from '@/src/lib/logger';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    await assertAdminRole();

    const { id } = await params;
    const { active } = await request.json();

    const product = await toggleProductActive(id, active);

    return NextResponse.json(product);
  } catch (error) {
    logger.error('Error toggling product', { error });

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to toggle product' }, { status: 500 });
  }
}
