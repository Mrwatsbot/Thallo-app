'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, CreditCard, PiggyBank, Banknote, Briefcase, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const accountTypes = [
  { value: 'checking', label: 'Checking', icon: Wallet, description: 'Your main spending account' },
  { value: 'savings', label: 'Savings', icon: PiggyBank, description: 'For your savings goals' },
  { value: 'credit_card', label: 'Credit Card', icon: CreditCard, description: 'Track credit card spending' },
  { value: 'cash', label: 'Cash', icon: Banknote, description: 'Physical cash on hand' },
];

interface OnboardingFormProps {
  userId: string;
}

export function OnboardingForm({ userId }: OnboardingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    type: 'checking',
    name: '',
    balance: '',
  });

  // Auto-suggest account name based on type
  const suggestedNames: Record<string, string> = {
    checking: 'Main Checking',
    savings: 'Savings',
    credit_card: 'Credit Card',
    cash: 'Cash',
  };

  const handleTypeSelect = (type: string) => {
    setFormData(f => ({
      ...f,
      type,
      name: f.name || suggestedNames[type] || '',
    }));
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      
      const { error } = await supabase.from('accounts').insert({
        user_id: userId,
        name: formData.name || suggestedNames[formData.type],
        type: formData.type,
        balance: formData.balance ? parseFloat(formData.balance) : 0,
      } as any);

      if (error) throw error;

      toast.success('Account created! Redirecting to dashboard...');
      
      // Small delay for the toast to show
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {step === 1 ? 'What type of account?' : 'Account Details'}
        </CardTitle>
        <CardDescription>
          {step === 1 
            ? 'Choose the type of account you want to track'
            : 'Enter your account details'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <div className="grid gap-3">
            {accountTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleTypeSelect(type.value)}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left',
                  'hover:border-primary hover:bg-primary/5',
                  formData.type === type.value 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border'
                )}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <type.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{type.label}</p>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                {formData.type === type.value && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                placeholder={suggestedNames[formData.type]}
                value={formData.name}
                onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="balance">Current Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-7"
                  value={formData.balance}
                  onChange={(e) => setFormData(f => ({ ...f, balance: e.target.value }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                What's your current balance? You can update this later.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account & Continue
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
