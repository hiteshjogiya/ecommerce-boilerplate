import { NextRequest, NextResponse } from 'next/server';
import { createPublicSupabaseClient } from '@/src/lib/supabase/public';
import { sanitizeSearchQuery } from '@/src/lib/input';
import { logger } from '@/src/lib/logger';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = sanitizeSearchQuery(searchParams.get('q') || '', 40);

    if (q.length < 2) return NextResponse.json([]);

    const supabase = createPublicSupabaseClient();
    const { data: products, error } = await supabase
      .from('products')
      .select('id, title, slug, categories(name)')
      .eq('active', true)
      .ilike('title', `%${q}%`)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      throw error;
    }

    const suggestions = (products ?? []).map((p) => {
      const categoryField = Array.isArray(p.categories) ? p.categories[0] : p.categories;
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: categoryField && typeof categoryField === 'object' && 'name' in categoryField ? categoryField.name : undefined,
      };
    });

    return NextResponse.json(suggestions, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    logger.error('Search suggestions error', { error });
    return NextResponse.json([]);
  }
}
