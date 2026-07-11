import { NextRequest, NextResponse } from 'next/server';
import { getAdminOrderById, updateOrderStatus } from '@/src/services/admin-order.service';
import { assertAdminRole } from '@/src/services/admin-auth.service';
import { hasTrustedOrigin } from '@/src/lib/security';
import { logger } from '@/src/lib/logger';

export async function GET(request: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    await assertAdminRole();

    const { orderNumber } = await params;

    const order = await getAdminOrderById(orderNumber);

    return NextResponse.json(order);
  } catch (error) {
    logger.error('Error fetching order', { error });

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    await assertAdminRole();

    const { orderNumber } = await params;
    const { status } = await request.json();

    const order = await updateOrderStatus(orderNumber, status);

    return NextResponse.json(order);
  } catch (error) {
    logger.error('Error updating order', { error });

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
