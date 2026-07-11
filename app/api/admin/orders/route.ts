import { NextRequest, NextResponse } from 'next/server';
import { getAdminOrders, type OrderStatus } from '@/src/services/admin-order.service';
import { assertAdminRole } from '@/src/services/admin-auth.service';
import { logger } from '@/src/lib/logger';

export async function GET(request: NextRequest) {
  try {
    await assertAdminRole();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const statusParam = searchParams.get('status');
    const status = statusParam ? (statusParam as OrderStatus) : undefined;

    const { orders, total } = await getAdminOrders({
      search: search || undefined,
      status,
      page,
      pageSize: 20,
    });

    return NextResponse.json({ orders, total });
  } catch (error) {
    logger.error('Error fetching orders', { error });

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
