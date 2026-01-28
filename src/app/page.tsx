import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PiggyBank, Sparkles, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <PiggyBank className="h-7 w-7 text-primary" />
            <span>BudgetApp</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Budgeting made{' '}
              <span className="text-primary">simple</span> and{' '}
              <span className="text-primary">smart</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              The AI-powered budget app that actually understands your spending. 
              Simpler than YNAB. Smarter than spreadsheets. Half the price.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">See Features</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required • 14-day free trial
            </p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container py-24 border-t">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why switch to BudgetApp?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Automatic categorization, payee cleanup, and spending insights. 
                  No more manual sorting.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Dead Simple</h3>
                <p className="text-muted-foreground">
                  No complicated philosophy to learn. Just add transactions, 
                  set budgets, and watch your savings grow.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Half the Price</h3>
                <p className="text-muted-foreground">
                  Starting at $29/year. That's 73% less than the competition. 
                  Same features, better AI.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing preview */}
        <section className="container py-24 border-t">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground mb-8">
              Start free. Upgrade when you're ready.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border p-6">
                <h3 className="font-semibold">Basic</h3>
                <div className="mt-2 text-3xl font-bold">$29<span className="text-lg font-normal text-muted-foreground">/yr</span></div>
                <p className="mt-2 text-sm text-muted-foreground">Manual entry + AI</p>
              </div>
              <div className="rounded-lg border-2 border-primary p-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Popular
                </div>
                <h3 className="font-semibold">Plus</h3>
                <div className="mt-2 text-3xl font-bold">$49<span className="text-lg font-normal text-muted-foreground">/yr</span></div>
                <p className="mt-2 text-sm text-muted-foreground">+ Receipt scanning</p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="font-semibold">Pro</h3>
                <div className="mt-2 text-3xl font-bold">$89<span className="text-lg font-normal text-muted-foreground">/yr</span></div>
                <p className="mt-2 text-sm text-muted-foreground">+ Bank sync</p>
              </div>
            </div>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/signup">Start Your Free Trial</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              © 2025 BudgetApp. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
