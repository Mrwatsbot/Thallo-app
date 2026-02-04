import { AlertCircle } from 'lucide-react';

interface FinancialDisclaimerProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function FinancialDisclaimer({ variant = 'default', className = '' }: FinancialDisclaimerProps) {
  if (variant === 'compact') {
    return (
      <div className={`text-xs text-muted-foreground ${className}`}>
        <strong>Disclaimer:</strong> Thallo is a budgeting and financial education tool. It does not provide financial, investment, or tax advice. The Financial Health Score is for informational purposes only and is not a credit score or lending metric.
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-xl p-6 bg-muted/30 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div>
          <h3 className="text-lg font-display font-semibold mb-2 text-foreground">
            Financial Disclaimer
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Thallo is a budgeting and financial education tool. It does not provide financial, investment, or tax advice. The Financial Health Score is for informational purposes only and is not a credit score or lending metric. Consult a qualified financial advisor for personalized financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
