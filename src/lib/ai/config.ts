// AI Model Configuration
// Maps tasks to specific models via OpenRouter

export type AITask = 
  | 'categorize'        // Categorize transactions
  | 'analyze_spending'  // Deep spending analysis  
  | 'find_savings'      // Find subscriptions/savings opportunities
  | 'bill_analysis'     // Analyze bills, find alternatives
  | 'negotiation_script'// Write negotiation scripts
  | 'chat'              // General chat/Q&A
  | 'quick_response';   // Fast, simple responses

// Model assignments - easily swap these
export const MODEL_CONFIG: Record<AITask, string> = {
  // Analysis tasks - need reasoning
  categorize: 'mistralai/mistral-7b-instruct',        // Fast & cheap for simple categorization
  analyze_spending: 'x-ai/grok-4.1-fast',             // Grok 4.1 fast for deep analysis
  find_savings: 'x-ai/grok-4.1-fast',                 // Grok 4.1 fast for finding patterns
  bill_analysis: 'anthropic/claude-3.5-sonnet',       // Claude for research-style tasks
  
  // Writing tasks - need good output
  negotiation_script: 'anthropic/claude-3.5-sonnet',  // Claude excels at writing
  
  // Chat tasks - balance of speed/quality
  chat: 'openai/gpt-4o',                              // GPT-4o for general chat
  quick_response: 'openai/gpt-4o-mini',               // Fast & cheap for simple responses
};

// Fallback models if primary fails
export const FALLBACK_MODELS: Record<AITask, string> = {
  categorize: 'openai/gpt-4o-mini',
  analyze_spending: 'anthropic/claude-3.5-sonnet',
  find_savings: 'anthropic/claude-3.5-sonnet',
  bill_analysis: 'openai/gpt-4o',
  negotiation_script: 'openai/gpt-4o',
  chat: 'anthropic/claude-3.5-sonnet',
  quick_response: 'mistralai/mistral-7b-instruct',
};

// Temperature settings per task
export const TEMPERATURE_CONFIG: Record<AITask, number> = {
  categorize: 0.1,           // Very deterministic
  analyze_spending: 0.3,     // Slight creativity for insights
  find_savings: 0.2,         // Mostly factual
  bill_analysis: 0.3,        // Some creativity for alternatives
  negotiation_script: 0.5,   // More creative writing
  chat: 0.7,                 // Conversational
  quick_response: 0.3,       // Balanced
};

// Max tokens per task
export const MAX_TOKENS_CONFIG: Record<AITask, number> = {
  categorize: 100,           // Just need category name
  analyze_spending: 1500,    // Detailed analysis
  find_savings: 1000,        // List of findings
  bill_analysis: 1200,       // Research + alternatives
  negotiation_script: 800,   // Script text
  chat: 1000,                // Conversation
  quick_response: 200,       // Brief response
};
