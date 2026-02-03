import { NextRequest, NextResponse } from 'next/server';
import { apiGuard } from '@/lib/api-guard';

export async function POST(request: NextRequest) {
  const guard = await apiGuard(30);
  if (guard.error) return guard.error;
  const { user, supabase } = guard;

  try {
    const body = await request.json();
    const { transaction_id } = body;

    if (!transaction_id) {
      return NextResponse.json(
        { error: 'transaction_id is required' },
        { status: 400 }
      );
    }

    // Verify the transaction exists and belongs to the user
    const { data: parentTransaction, error: fetchError } = await (supabase as any)
      .from('transactions')
      .select('id, is_split')
      .eq('id', transaction_id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !parentTransaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (!parentTransaction.is_split) {
      return NextResponse.json(
        { error: 'Transaction is not split' },
        { status: 400 }
      );
    }

    // Delete all child transactions
    const { error: deleteError } = await (supabase as any)
      .from('transactions')
      .delete()
      .eq('parent_transaction_id', transaction_id)
      .eq('user_id', user.id);

    if (deleteError) {
      throw deleteError;
    }

    // Reset parent is_split flag
    const { error: updateError } = await (supabase as any)
      .from('transactions')
      .update({ is_split: false })
      .eq('id', transaction_id)
      .eq('user_id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction unsplit successfully',
    });
  } catch (error: any) {
    console.error('Unsplit transaction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to unsplit transaction' },
      { status: 500 }
    );
  }
}
