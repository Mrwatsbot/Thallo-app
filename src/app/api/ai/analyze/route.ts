import { NextRequest, NextResponse } from 'next/server';
import { analyzeSpending, findSavings } from '@/lib/ai/openrouter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (!action || !data) {
      return NextResponse.json(
        { error: 'Missing action or data' },
        { status: 400 }
      );
    }

    let result: string;

    switch (action) {
      case 'analyze_spending':
        result = await analyzeSpending(data);
        break;
      case 'find_savings':
        result = await findSavings(data);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'AI analysis failed' },
      { status: 500 }
    );
  }
}
