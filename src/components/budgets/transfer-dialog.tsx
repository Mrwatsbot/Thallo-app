'use client';

import { useState } from 'react';
import { ArrowLeftRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface CategoryBudget {
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  budgetId: string | null;
  budgeted: number;
  spent: number;
}

interface TransferDialogProps {
  categoryBudgets: CategoryBudget[];
  currentMonth: string;
  onTransferred: () => void;
}

export function TransferDialog({ categoryBudgets, currentMonth, onTransferred }: TransferDialogProps) {
  const [open, setOpen] = useState(false);
  const [fromCategoryId, setFromCategoryId] = useState<string>('');
  const [toCategoryId, setToCategoryId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories with remaining budget > 0
  const fromCategories = categoryBudgets.filter((b) => {
    const remaining = b.budgeted - b.spent;
    return remaining > 0;
  });

  // All budgeted categories
  const toCategories = categoryBudgets.filter((b) => b.budgetId);

  // Get remaining balance for selected categories
  const fromCategory = categoryBudgets.find((b) => b.categoryId === fromCategoryId);
  const toCategory = categoryBudgets.find((b) => b.categoryId === toCategoryId);
  const fromRemaining = fromCategory ? fromCategory.budgeted - fromCategory.spent : 0;
  const toRemaining = toCategory ? toCategory.budgeted - toCategory.spent : 0;

  const handleTransfer = async () => {
    if (!fromCategoryId || !toCategoryId || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amountNum > fromRemaining) {
      toast.error('Amount exceeds available budget');
      return;
    }

    if (fromCategoryId === toCategoryId) {
      toast.error('Cannot transfer to the same category');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/budgets/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_category_id: fromCategoryId,
          to_category_id: toCategoryId,
          amount: amountNum,
          month: currentMonth,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Transfer failed');
      }

      toast.success(`Transferred $${amountNum.toFixed(2)} from ${fromCategory?.categoryName} to ${toCategory?.categoryName}`);
      
      // Reset form
      setFromCategoryId('');
      setToCategoryId('');
      setAmount('');
      setOpen(false);
      
      // Refresh budget data
      onTransferred();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to transfer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowLeftRight className="w-4 h-4" />
          <span className="hidden sm:inline">Move Money</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-[#1a7a6d]" />
            Move Money Between Categories
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* From Category */}
          <div className="space-y-2">
            <Label htmlFor="from-category">From Category</Label>
            <Select value={fromCategoryId} onValueChange={setFromCategoryId}>
              <SelectTrigger id="from-category" className="w-full">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {fromCategories.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No categories with remaining budget
                  </div>
                ) : (
                  fromCategories.map((cat) => {
                    const remaining = cat.budgeted - cat.spent;
                    return (
                      <SelectItem key={cat.categoryId} value={cat.categoryId}>
                        <span className="flex items-center justify-between w-full">
                          <span>{cat.categoryIcon} {cat.categoryName}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ${remaining.toFixed(2)} left
                          </span>
                        </span>
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
            {fromCategory && (
              <p className="text-xs text-muted-foreground">
                Remaining: ${fromRemaining.toFixed(2)}
              </p>
            )}
          </div>

          {/* To Category */}
          <div className="space-y-2">
            <Label htmlFor="to-category">To Category</Label>
            <Select value={toCategoryId} onValueChange={setToCategoryId}>
              <SelectTrigger id="to-category" className="w-full">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {toCategories.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No budgeted categories available
                  </div>
                ) : (
                  toCategories
                    .filter((cat) => cat.categoryId !== fromCategoryId)
                    .map((cat) => {
                      const remaining = cat.budgeted - cat.spent;
                      return (
                        <SelectItem key={cat.categoryId} value={cat.categoryId}>
                          <span className="flex items-center justify-between w-full">
                            <span>{cat.categoryIcon} {cat.categoryName}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ${remaining.toFixed(2)} left
                            </span>
                          </span>
                        </SelectItem>
                      );
                    })
                )}
              </SelectContent>
            </Select>
            {toCategory && (
              <p className="text-xs text-muted-foreground">
                Current remaining: ${toRemaining.toFixed(2)}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              max={fromRemaining}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!fromCategoryId}
            />
            {fromCategory && amount && parseFloat(amount) > 0 && (
              <p className="text-xs text-muted-foreground">
                After transfer: {fromCategory.categoryName} will have ${(fromRemaining - parseFloat(amount)).toFixed(2)} left
              </p>
            )}
          </div>

          {/* Transfer Button */}
          <Button
            onClick={handleTransfer}
            disabled={!fromCategoryId || !toCategoryId || !amount || isSubmitting}
            className="w-full bg-[#1a7a6d] hover:bg-[#1a7a6d]/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Transferring...
              </>
            ) : (
              <>
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Transfer Money
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
