'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shield,
  Brain,
  Target,
  Flame,
  Trophy,
  CreditCard,
  PiggyBank,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Zap,
  Lock,
  Eye,
  Gauge,
  ArrowUpRight,
  Star,
} from 'lucide-react';

// ============================================================
// ANIMATED SCORE RING — Hero centerpiece
// ============================================================
function AnimatedScoreRing({ targetScore = 742 }: { targetScore?: number }) {
  const [score, setScore] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 2000;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 4); // ease-out quart

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setScore(Math.round(ease(progress) * targetScore));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [visible, targetScore]);

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (score / 1000) * circumference;

  const getColor = () => {
    if (score >= 750) return '#22c55e';
    if (score >= 600) return '#1a7a6d';
    if (score >= 400) return '#eab308';
    return '#ef4444';
  };

  return (
    <div ref={ref} className="relative w-[280px] h-[280px] mx-auto">
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-full blur-[60px] opacity-40 transition-all duration-1000"
        style={{ background: `radial-gradient(circle, ${getColor()}44, transparent)` }}
      />
      <svg viewBox="0 0 260 260" className="w-full h-full -rotate-90">
        {/* Track */}
        <circle
          cx="130" cy="130" r="120"
          fill="none"
          stroke="rgba(26, 122, 109, 0.1)"
          strokeWidth="8"
        />
        {/* Progress */}
        <circle
          cx="130" cy="130" r="120"
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-100"
          style={{ filter: `drop-shadow(0 0 8px ${getColor()}66)` }}
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-6xl font-display font-bold tracking-tight" style={{ color: getColor() }}>
          {score}
        </span>
        <span className="text-sm text-muted-foreground mt-1">/ 1,000</span>
        <span className="text-xs font-medium text-[#1a7a6d] mt-2 px-3 py-1 rounded-full bg-[#1a7a6d]/10">
          Wealth Builder
        </span>
      </div>
    </div>
  );
}

// ============================================================
// ANIMATED COUNTER
// ============================================================
function AnimatedCounter({ target, prefix = '', suffix = '', decimals = 0 }: {
  target: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [value, setValue] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 1500;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(ease * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [visible, target]);

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()}{suffix}
    </span>
  );
}

// ============================================================
// SCROLL-TRIGGERED FADE IN
// ============================================================
function FadeIn({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      {children}
    </div>
  );
}

// ============================================================
// PILLAR BAR VISUALIZATION
// ============================================================
function PillarBars() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const pillars = [
    { name: 'Trajectory', score: 320, max: 400, color: '#3b82f6', desc: 'Where you\'re headed' },
    { name: 'Behavior', score: 280, max: 350, color: '#22c55e', desc: 'How you handle money' },
    { name: 'Position', score: 142, max: 250, color: '#eab308', desc: 'Where you are now' },
  ];

  return (
    <div ref={ref} className="space-y-4">
      {pillars.map((p, i) => (
        <div key={p.name} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="font-medium">{p.name}</span>
              <span className="text-muted-foreground text-xs">— {p.desc}</span>
            </div>
            <span className="tabular-nums font-mono text-xs text-muted-foreground">
              {visible ? p.score : 0}/{p.max}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-[#1a2826] overflow-hidden">
            <div
              className="h-full rounded-full transition-all ease-out"
              style={{
                width: visible ? `${(p.score / p.max) * 100}%` : '0%',
                backgroundColor: p.color,
                transitionDuration: `${1200 + i * 200}ms`,
                transitionDelay: `${200 + i * 150}ms`,
                boxShadow: `0 0 12px ${p.color}44`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// FAQ ACCORDION
// ============================================================
function FAQ({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left hover:text-[#1a7a6d] transition-colors"
      >
        <span className="font-medium pr-8">{question}</span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '200px' : '0', opacity: open ? 1 : 0 }}
      >
        <p className="pb-5 text-muted-foreground text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// ============================================================
// FLOATING PARTICLES (subtle background depth)
// ============================================================
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#1a7a6d]"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            opacity: 0.15 + Math.random() * 0.15,
            animation: `float-particle ${8 + Math.random() * 12}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* CSS for floating particles */}
      <style jsx global>{`
        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.2); }
          50% { transform: translate(-15px, -50px) scale(0.8); }
          75% { transform: translate(25px, -20px) scale(1.1); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .score-comparison-table td, .score-comparison-table th {
          padding: 12px 16px;
          text-align: left;
        }
      `}</style>

      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1a7a6d]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-[400px] h-[400px] bg-[#1a7a6d]/3 rounded-full blur-[100px] pointer-events-none" />

      {/* ============================================================
          NAVIGATION
          ============================================================ */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a7a6d] to-[#146b5f] flex items-center justify-center p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/thallo-logo-white.png" alt="Thallo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-bold">Thallo</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/demo" className="hidden sm:block">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Demo</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Pricing</Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Log in</Button>
          </Link>
          <Link href="/signup" className="hidden sm:block">
            <Button className="gradient-btn border-0">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/signup" className="sm:hidden">
            <Button size="sm" className="gradient-btn border-0">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* ============================================================
          HERO SECTION
          ============================================================ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <FloatingParticles />
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — Copy */}
          <div>
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm mb-8">
                <Sparkles className="w-4 h-4 text-[#1a7a6d]" />
                <span className="text-muted-foreground">Your money deserves better than FICO</span>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight mb-6 leading-[1.1]">
                The score that
                <br />
                <span className="gradient-text">actually helps you</span>
                <br />
                build wealth.
              </h1>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                FICO measures how profitable you are to banks. Thallo measures your <em>real</em> financial health — and gives you AI-powered tools to improve it.
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
                <Link href="/signup">
                  <Button size="lg" className="shimmer-btn border-0 px-8 h-13 text-base">
                    Start Free <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="px-8 h-13 text-base border-border hover:bg-secondary">
                    Try the Demo
                  </Button>
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1a7a6d]" /> Free forever tier
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1a7a6d]" /> No credit card
                </span>
                <span className="flex items-center gap-1.5 hidden sm:flex">
                  <CheckCircle2 className="w-4 h-4 text-[#1a7a6d]" /> 2 min setup
                </span>
              </div>
            </FadeIn>
          </div>

          {/* Right — Animated Score Ring */}
          <FadeIn delay={200} className="flex justify-center">
            <div className="relative">
              <AnimatedScoreRing targetScore={742} />
              {/* Floating detail cards */}
              <div className="absolute -left-4 top-8 glass-card rounded-xl px-3 py-2 text-xs animate-[float-particle_6s_ease-in-out_infinite]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">+47 pts this month</span>
                </div>
              </div>
              <div className="absolute -right-2 bottom-12 glass-card rounded-xl px-3 py-2 text-xs animate-[float-particle_7s_ease-in-out_infinite_1s]">
                <div className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-medium">12-day streak</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================
          SOCIAL PROOF BAR
          ============================================================ */}
      <section className="relative z-10 border-y border-border bg-[#0a1211]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <FadeIn>
              <div>
                <p className="text-3xl font-display font-bold">
                  <AnimatedCounter target={1000} suffix="+" />
                </p>
                <p className="text-sm text-muted-foreground mt-1">Score points possible</p>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div>
                <p className="text-3xl font-display font-bold">
                  <AnimatedCounter target={6} />
                </p>
                <p className="text-sm text-muted-foreground mt-1">Health factors tracked</p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div>
                <p className="text-3xl font-display font-bold">
                  <AnimatedCounter target={100} suffix="%" />
                </p>
                <p className="text-sm text-muted-foreground mt-1">Your data, your control</p>
              </div>
            </FadeIn>
            <FadeIn delay={300}>
              <div>
                <p className="text-3xl font-display font-bold text-[#1a7a6d]">
                  $0
                </p>
                <p className="text-sm text-muted-foreground mt-1">To get started</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============================================================
          THE PROBLEM — Why FICO is broken
          ============================================================ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-[#1a7a6d] mb-3 tracking-wide uppercase">The Problem</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Your credit score doesn&apos;t work for <em>you</em>.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              FICO was designed to measure risk for <strong>lenders</strong>. It rewards having more credit lines, 
              penalizes you for paying off debt, and ignores savings entirely.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* FICO column */}
          <FadeIn delay={100}>
            <div className="glass-card rounded-2xl p-8 border-red-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-400" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-400">FICO / Credit Score</h3>
                  <p className="text-xs text-muted-foreground">Built for banks</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  'Rewards having MORE debt (credit utilization)',
                  'Ignores savings & investments completely',
                  'Penalizes closing paid-off accounts',
                  'Doesn\'t track budgeting or spending habits',
                  'Opaque — you can\'t see the formula',
                  'Measures bank profitability, not your health',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-red-400 mt-0.5">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Thallo column */}
          <FadeIn delay={200}>
            <div className="glass-card rounded-2xl p-8 border-[#1a7a6d]/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1a7a6d] to-[#22c55e]" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#1a7a6d]/15 flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-[#1a7a6d]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a7a6d]">Thallo Health Score</h3>
                  <p className="text-xs text-muted-foreground">Built for you</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  'Rewards paying OFF debt — not having more',
                  'Tracks savings, investments & wealth building',
                  'Celebrates becoming debt-free',
                  'Measures budgeting discipline & consistency',
                  'Fully transparent — see every factor',
                  'Measures YOUR actual financial health',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1a7a6d] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================
          THREE PILLARS — How the score works
          ============================================================ */}
      <section className="relative z-10 bg-[#0a1211] border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-[#1a7a6d] mb-3 tracking-wide uppercase">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Three pillars of financial health
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your 0–1,000 score is built from three pillars, each measuring what actually matters for your financial future.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — Pillar visualization */}
            <FadeIn delay={100}>
              <div className="glass-card rounded-2xl p-8">
                <PillarBars />
                <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Score</p>
                    <p className="text-3xl font-display font-bold gradient-text">742</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="text-sm font-medium text-[#1a7a6d]">Wealth Builder</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right — Pillar descriptions */}
            <div className="space-y-6">
              <FadeIn delay={200}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Trajectory <span className="text-muted-foreground font-normal text-sm">— 400 pts</span></h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Where you&apos;re <em>headed</em> matters more than where you are. Wealth building rate and debt payoff velocity.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={300}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Behavior <span className="text-muted-foreground font-normal text-sm">— 350 pts</span></h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Good habits compound. Payment consistency and budget discipline — the daily choices that build wealth.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={400}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Position <span className="text-muted-foreground font-normal text-sm">— 250 pts</span></h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your safety net and debt burden. Emergency buffer months and true debt-to-income ratio.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURES — The full toolkit
          ============================================================ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-[#1a7a6d] mb-3 tracking-wide uppercase">Features</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything you need to win with money
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              AI-powered tools that work together to give you a complete picture — and a clear path forward.
            </p>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: 'AI Budget Assistant',
              desc: 'Auto-categorize transactions, generate budgets, analyze spending patterns. Ask it anything about your money.',
              color: '#1a7a6d',
            },
            {
              icon: CreditCard,
              title: 'Smart Debt Crusher',
              desc: 'Avalanche or snowball strategies with AI-optimized payoff plans. See exactly when you\'ll be debt-free.',
              color: '#3b82f6',
            },
            {
              icon: PiggyBank,
              title: 'Savings Goals',
              desc: 'Emergency fund, retirement, custom goals — track contributions and watch your wealth building rate rise.',
              color: '#22c55e',
            },
            {
              icon: Target,
              title: 'Challenges & Streaks',
              desc: 'No-spend weekends, lunch packing weeks, subscription audits. Gamified goals that actually save you money.',
              color: '#eab308',
            },
            {
              icon: Trophy,
              title: 'Achievements',
              desc: 'Unlock badges as you hit milestones. First budget month, debt-free day, emergency fund complete.',
              color: '#ec4899',
            },
            {
              icon: Zap,
              title: 'Receipt & Statement Scan',
              desc: 'Point your camera at a receipt or upload a bank statement. AI extracts every line item instantly.',
              color: '#f97316',
            },
          ].map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 80}>
              <div className="glass-card rounded-2xl p-6 h-full group hover:border-[#1a7a6d]/30 transition-all duration-300">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300"
                  style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ============================================================
          DEBT WEIGHTING — Unique differentiator
          ============================================================ */}
      <section className="relative z-10 bg-[#0a1211] border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <p className="text-sm font-medium text-[#1a7a6d] mb-3 tracking-wide uppercase">Smart Debt Weighting</p>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Not all debt is created equal.
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  A mortgage and a payday loan are nothing alike — but credit scores treat them similarly. 
                  Thallo weights each debt type by real financial risk: interest rate, asset backing, and delinquency data.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span>Payday Loans</span>
                    <span className="font-mono text-red-400">2.5× weight</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span>Credit Cards (carried)</span>
                    <span className="font-mono text-orange-400">1.5× weight</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span>Student Loans</span>
                    <span className="font-mono text-yellow-400">0.5× weight</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span>Mortgage</span>
                    <span className="font-mono text-emerald-400">0.3× weight</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>Credit Card (paid monthly)</span>
                    <span className="font-mono text-[#1a7a6d]">0.05× weight</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="glass-card rounded-2xl p-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">Research-backed multipliers from</p>
                <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                  <div className="p-3 rounded-lg bg-[#1a2826]">
                    <p className="font-medium text-foreground mb-1">NY Fed</p>
                    <p>Delinquency rates</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1a2826]">
                    <p className="font-medium text-foreground mb-1">CFPB</p>
                    <p>Consumer risk data</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1a2826]">
                    <p className="font-medium text-foreground mb-1">Fannie Mae</p>
                    <p>Asset guidelines</p>
                  </div>
                </div>
                <div className="mt-8 p-4 rounded-xl bg-[#1a7a6d]/10 border border-[#1a7a6d]/20">
                  <p className="text-sm text-[#1a7a6d] font-medium mb-1">The result?</p>
                  <p className="text-sm text-muted-foreground">
                    Someone with a $200k mortgage scores <em>higher</em> than someone with $5k in payday loans — 
                    because that&apos;s the financial reality.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============================================================
          PRIVACY SECTION
          ============================================================ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <FadeIn>
          <div className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1a7a6d]/5 rounded-full blur-[80px]" />
            <div className="grid md:grid-cols-2 gap-8 items-center relative">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a7a6d]/10 text-xs font-medium text-[#1a7a6d] mb-4">
                  <Lock className="w-3.5 h-3.5" /> Privacy First
                </div>
                <h2 className="text-3xl font-display font-bold mb-4">
                  Your financial data is sacred.
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We don&apos;t sell your data. We don&apos;t share it with advertisers. We don&apos;t even see your bank passwords — 
                  Plaid handles that connection securely. Your money, your business.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Lock, label: 'Bank-level encryption', detail: 'AES-256 at rest' },
                  { icon: Shield, label: 'Row-level security', detail: 'Data isolation per user' },
                  { icon: Eye, label: 'No data selling', detail: 'Ever. Period.' },
                  { icon: Star, label: 'SOC 2 infrastructure', detail: 'Via Supabase + Vercel' },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl bg-[#0d1514] border border-border">
                    <item.icon className="w-5 h-5 text-[#1a7a6d] mb-2" />
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ============================================================
          FAQ
          ============================================================ */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-24">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Frequently asked questions</h2>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div>
            <FAQ
              question="Is Thallo really free?"
              answer="Yes! The free tier includes full budgeting, debt tracking, savings goals, and your Financial Health Score. Pro ($4.99/mo) adds AI features like smart categorization, spending analysis, receipt scanning, and the AI budget assistant."
            />
            <FAQ
              question="How is this different from Mint, YNAB, or other budget apps?"
              answer="Most budget apps just track where your money went. Thallo gives you a comprehensive financial health score that actually measures your progress, AI that works for you, and gamification that makes budgeting something you want to do — not a chore."
            />
            <FAQ
              question="Do I need to connect my bank?"
              answer="Nope! You can manually add transactions and accounts. If you want automatic imports, we use Plaid — the same secure service used by Venmo, Robinhood, and thousands of other apps. We never see your bank credentials."
            />
            <FAQ
              question="What AI model powers the features?"
              answer="We use state-of-the-art language models via OpenRouter, with your data anonymized before it reaches any AI. Your personal identifiers are stripped out — the AI sees spending patterns, not your name or account numbers."
            />
            <FAQ
              question="Can I export my data?"
              answer="Your data is yours. We're building CSV/JSON export features. You can also access everything through the app at any time."
            />
            <FAQ
              question="How is the Financial Health Score calculated?"
              answer="It's fully transparent! Six factors across three pillars: Trajectory (wealth building rate + debt velocity), Behavior (payment consistency + budget discipline), and Position (emergency buffer + debt-to-income). Every factor is visible with clear explanations."
            />
          </div>
        </FadeIn>
      </section>

      {/* ============================================================
          FINAL CTA
          ============================================================ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <FadeIn>
          <div className="glass-card rounded-2xl p-12 md:p-16 text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a7a6d]/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#1a7a6d]/8 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
                Stop measuring your health
                <br />
                <span className="gradient-text">by someone else&apos;s rules.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                Join Thallo and get a financial score that actually works for you — not for banks.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="shimmer-btn border-0 px-10 h-14 text-lg">
                    Get Your Score <ArrowUpRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Free forever. No credit card required. Set up in 2 minutes.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="relative z-10 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a7a6d] to-[#146b5f] flex items-center justify-center p-0.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/thallo-logo-white.png" alt="Thallo" className="w-full h-full object-contain" />
                </div>
                <span className="font-semibold">Thallo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Financial health, measured right.
              </p>
            </div>
            <div>
              <p className="font-medium text-sm mb-3">Product</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/signup" className="hover:text-foreground transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-sm mb-3">Score</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="cursor-default">How It Works</span></li>
                <li><span className="cursor-default">Debt Weighting</span></li>
                <li><span className="cursor-default">vs FICO</span></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-sm mb-3">Legal</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="cursor-default">Privacy Policy</span></li>
                <li><span className="cursor-default">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Thallo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
