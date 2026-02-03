'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ExportFormat = 'csv' | 'pdf';
type ExportRange = 'month' | '3months' | 'year' | 'all';
type ExportType = 'transactions' | 'budgets' | 'savings';

interface ExportDialogProps {
  mode?: 'transactions' | 'full';
  trigger?: React.ReactNode;
}

export function ExportDialog({ mode = 'full', trigger }: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [range, setRange] = useState<ExportRange>('month');
  const [include, setInclude] = useState<Set<ExportType>>(
    new Set(['transactions', 'budgets', 'savings'])
  );
  const [exporting, setExporting] = useState(false);

  const handleToggleInclude = (type: ExportType) => {
    const newInclude = new Set(include);
    if (newInclude.has(type)) {
      newInclude.delete(type);
    } else {
      newInclude.add(type);
    }
    setInclude(newInclude);
  };

  const handleExport = async () => {
    if (include.size === 0) {
      toast.error('Select at least one item to export');
      return;
    }

    setExporting(true);
    try {
      const includeParam = Array.from(include).join(',');
      const url = `/api/export?format=${format}&range=${range}&include=${includeParam}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Export failed');
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `thallo-export-${new Date().toISOString().split('T')[0]}.${format}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      // Download the file
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('Export downloaded successfully');
      setOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const rangeOptions: { value: ExportRange; label: string }[] = [
    { value: 'month', label: 'This month' },
    { value: '3months', label: 'Last 3 months' },
    { value: 'year', label: 'Last 12 months' },
    { value: 'all', label: 'All time' },
  ];

  const includeOptions: { value: ExportType; label: string }[] = 
    mode === 'transactions'
      ? [{ value: 'transactions', label: 'Transactions' }]
      : [
          { value: 'transactions', label: 'Transactions' },
          { value: 'budgets', label: 'Budgets' },
          { value: 'savings', label: 'Savings Goals' },
        ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Your Data</DialogTitle>
          <DialogDescription>
            {mode === 'transactions'
              ? 'Download your transaction history'
              : 'Download your financial data'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Toggle */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Format</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={format === 'csv' ? 'default' : 'outline'}
                className={cn(
                  'flex-1',
                  format === 'csv' && 'gradient-btn border-0'
                )}
                onClick={() => setFormat('csv')}
              >
                CSV
              </Button>
              <Button
                type="button"
                variant={format === 'pdf' ? 'default' : 'outline'}
                className={cn(
                  'flex-1',
                  format === 'pdf' && 'gradient-btn border-0'
                )}
                onClick={() => setFormat('pdf')}
                disabled
              >
                PDF <span className="ml-1 text-xs opacity-60">(Soon)</span>
              </Button>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              {rangeOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={range === option.value ? 'default' : 'outline'}
                  className={cn(
                    'justify-start',
                    range === option.value && 'gradient-btn border-0'
                  )}
                  onClick={() => setRange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* What to Export */}
          {mode === 'full' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">What to Export</Label>
              <div className="space-y-2">
                {includeOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={include.has(option.value)}
                      onCheckedChange={() => handleToggleInclude(option.value)}
                    />
                    <Label
                      htmlFor={option.value}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={exporting || include.size === 0}
            className="w-full gradient-btn border-0"
            size="lg"
          >
            {exporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export {format.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
