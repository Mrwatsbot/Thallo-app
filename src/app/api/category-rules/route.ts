import { NextRequest, NextResponse } from 'next/server';
import { apiGuard } from '@/lib/api-guard';

export async function GET(request: NextRequest) {
  const guard = await apiGuard(10);
  if (guard.error) return guard.error;
  const { user, supabase } = guard;

  const { data: rules, error } = await (supabase.from as any)('category_rules')
    .select(`
      id,
      payee_pattern,
      match_type,
      created_at,
      category:categories(id, name, icon, color)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rules: rules || [] });
}

export async function POST(request: NextRequest) {
  const guard = await apiGuard(10);
  if (guard.error) return guard.error;
  const { user, supabase } = guard;

  try {
    const body = await request.json();
    const { payee_pattern, category_id, match_type = 'contains' } = body;

    if (!payee_pattern || !category_id) {
      return NextResponse.json(
        { error: 'payee_pattern and category_id are required' },
        { status: 400 }
      );
    }

    // Check if rule already exists
    const { data: existing } = await (supabase.from as any)('category_rules')
      .select('id')
      .eq('user_id', user.id)
      .eq('payee_pattern', payee_pattern)
      .eq('match_type', match_type)
      .maybeSingle();

    if (existing) {
      // Update existing rule
      const { data, error } = await (supabase.from as any)('category_rules')
        .update({ category_id })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ rule: data });
    }

    // Create new rule
    const { data, error } = await (supabase.from as any)('category_rules')
      .insert({
        user_id: user.id,
        payee_pattern,
        category_id,
        match_type,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ rule: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create rule' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const guard = await apiGuard(10);
  if (guard.error) return guard.error;
  const { user, supabase } = guard;

  try {
    const body = await request.json();
    const { id, payee_pattern, category_id, match_type } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (payee_pattern !== undefined) updateData.payee_pattern = payee_pattern;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (match_type !== undefined) updateData.match_type = match_type;

    const { data, error } = await (supabase.from as any)('category_rules')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ rule: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update rule' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const guard = await apiGuard(10);
  if (guard.error) return guard.error;
  const { user, supabase } = guard;

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const { error } = await (supabase.from as any)('category_rules')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete rule' },
      { status: 500 }
    );
  }
}
