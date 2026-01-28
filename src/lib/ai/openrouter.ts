import { 
  AITask, 
  MODEL_CONFIG, 
  FALLBACK_MODELS, 
  TEMPERATURE_CONFIG, 
  MAX_TOKENS_CONFIG 
} from './config';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface AIRequestOptions {
  task: AITask;
  messages: Message[];
  overrideModel?: string;  // Force a specific model
  overrideTemp?: number;   // Override temperature
}

export async function callAI(options: AIRequestOptions): Promise<AIResponse> {
  const { task, messages, overrideModel, overrideTemp } = options;
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const model = overrideModel || MODEL_CONFIG[task];
  const temperature = overrideTemp ?? TEMPERATURE_CONFIG[task];
  const maxTokens = MAX_TOKENS_CONFIG[task];

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'BudgetWise',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`OpenRouter error (${model}):`, error);
      
      // Try fallback model
      if (!overrideModel) {
        console.log(`Trying fallback model for ${task}...`);
        return callAI({
          ...options,
          overrideModel: FALLBACK_MODELS[task],
        });
      }
      
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0]?.message?.content || '',
      model: data.model || model,
      usage: data.usage,
    };
  } catch (error) {
    // Try fallback on any error
    if (!overrideModel) {
      console.log(`Error with ${model}, trying fallback...`);
      return callAI({
        ...options,
        overrideModel: FALLBACK_MODELS[task],
      });
    }
    throw error;
  }
}

// Convenience functions for specific tasks
export async function analyzeSpending(transactionData: string): Promise<string> {
  const response = await callAI({
    task: 'analyze_spending',
    messages: [
      {
        role: 'system',
        content: `You are a personal finance expert analyzing spending data. Provide actionable insights in a friendly, encouraging tone. Focus on:
1. Spending patterns and trends
2. Areas of concern or overspending
3. Specific, actionable recommendations
4. Positive observations to encourage good habits

Keep insights concise and prioritized. Use bullet points. Be specific with numbers.`,
      },
      {
        role: 'user',
        content: `Analyze this spending data and provide insights:\n\n${transactionData}`,
      },
    ],
  });
  return response.content;
}

export async function findSavings(transactionData: string): Promise<string> {
  const response = await callAI({
    task: 'find_savings',
    messages: [
      {
        role: 'system',
        content: `You are a savings expert hunting for ways to reduce expenses. Look for:
1. Subscriptions that might be unused or redundant
2. Recurring charges that could be negotiated
3. Spending categories where costs seem high
4. Potential alternatives or switches that could save money

Be specific with amounts. Estimate potential monthly/yearly savings. Prioritize by impact.`,
      },
      {
        role: 'user',
        content: `Find savings opportunities in this spending data:\n\n${transactionData}`,
      },
    ],
  });
  return response.content;
}

export async function analyzeBill(billData: string): Promise<string> {
  const response = await callAI({
    task: 'bill_analysis',
    messages: [
      {
        role: 'system',
        content: `You are a bill analysis expert. For the given bill:
1. Identify what service/product it's for
2. Research typical market rates for similar services
3. Identify potential alternatives or competitors
4. Suggest negotiation angles
5. Provide a recommendation (keep, negotiate, or switch)

Be specific with competitor names and estimated savings.`,
      },
      {
        role: 'user',
        content: `Analyze this bill and find alternatives:\n\n${billData}`,
      },
    ],
  });
  return response.content;
}

export async function generateNegotiationScript(billInfo: string): Promise<string> {
  const response = await callAI({
    task: 'negotiation_script',
    messages: [
      {
        role: 'system',
        content: `You are an expert negotiator helping someone reduce their bills. Create a phone script that:
1. Opens professionally and states the purpose
2. Mentions customer loyalty and tenure
3. References competitor offers (be specific)
4. Has responses for common objections
5. Includes an escalation path if initial rep can't help

Format as a clear, easy-to-follow script with speaker labels.`,
      },
      {
        role: 'user',
        content: `Create a negotiation script for this bill:\n\n${billInfo}`,
      },
    ],
  });
  return response.content;
}

export async function categorizeTransaction(transaction: string): Promise<string> {
  const response = await callAI({
    task: 'categorize',
    messages: [
      {
        role: 'system',
        content: `Categorize the transaction into one of these categories. Reply with ONLY the category name:
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Utilities
- Health
- Subscriptions
- Personal Care
- Income
- Transfer
- Other`,
      },
      {
        role: 'user',
        content: transaction,
      },
    ],
  });
  return response.content.trim();
}

export async function chat(userMessage: string, context?: string): Promise<string> {
  const response = await callAI({
    task: 'chat',
    messages: [
      {
        role: 'system',
        content: `You are BudgetWise AI, a friendly and knowledgeable personal finance assistant. You help users understand their finances, make better money decisions, and achieve their financial goals. Be conversational, supportive, and give actionable advice.${context ? `\n\nContext about the user's finances:\n${context}` : ''}`,
      },
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });
  return response.content;
}
