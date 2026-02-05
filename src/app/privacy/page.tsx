import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy – Thallo',
  description: 'How Thallo collects, uses, and protects your financial data. Your privacy is our priority.',
  openGraph: {
    title: 'Privacy Policy – Thallo',
    description: 'How Thallo collects, uses, and protects your financial data.',
    type: 'website',
    url: 'https://usethallo.com/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3D6B52] to-[#2D5440] flex items-center justify-center p-1">
            <img src="/new-logo-white.svg" alt="Thallo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-display font-bold">Thallo</span>
        </Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </nav>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium mb-6 text-sm">
            <Shield className="w-4 h-4" />
            Privacy Policy
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground leading-tight">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last Updated: February 3, 2025
          </p>
        </div>

        <div className="space-y-8 text-card-foreground leading-relaxed">
          {/* Introduction */}
          <section>
            <p>
              At Thallo (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), we take your privacy seriously. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our budgeting and financial health application (the &quot;Service&quot;).
            </p>
            <p className="mt-4">
              By using Thallo, you agree to the terms of this Privacy Policy. If you do not agree, please do not use our Service.
            </p>
          </section>

          {/* What We Collect */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              1. Information We Collect
            </h2>
            
            <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
              1.1 Information You Provide
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Email address, name (optional), password (encrypted)</li>
              <li><strong>Financial Data:</strong> Budgets, transactions, debt accounts, savings goals, income information</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store full credit card numbers)</li>
            </ul>

            <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
              1.2 Information from Third Parties
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Bank Connection Data:</strong> If you choose to connect your bank accounts via Plaid, we receive read-only access to transaction data and account balances. We never see or store your bank login credentials.</li>
            </ul>

            <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
              1.3 Automatically Collected Information
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Data:</strong> Log data, session information, device information</li>
              <li><strong>Cookies:</strong> We use essential cookies for authentication (via Supabase Auth). We do not use tracking pixels or third-party analytics cookies.</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              2. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Provide and maintain the Thallo Service</li>
              <li>Calculate your Financial Health Score</li>
              <li>Generate budgets, insights, and recommendations</li>
              <li>Process transactions and payments</li>
              <li>Send service-related notifications and updates</li>
              <li>Improve and personalize your experience</li>
              <li>Detect and prevent fraud or security issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* AI Processing */}
          <section className="glass-card rounded-xl p-6 border-primary/20">
            <div className="flex items-start gap-3 mb-3">
              <Lock className="w-5 h-5 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-display font-bold mb-2 text-foreground">
                  3. AI Processing & Data Anonymization
                </h2>
                <p>
                  Thallo uses AI (via OpenRouter) to provide smart budgeting insights, auto-categorization, spending analysis, and receipt scanning.
                </p>
                <p className="mt-3">
                  <strong>Important:</strong> Before any financial data is sent to AI services, we anonymize it by removing all personally identifiable information (PII), including your name, email, account numbers, and other identifiers. The AI only sees anonymized spending categories and amounts — never who you are.
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              4. Third-Party Services
            </h2>
            <p>We work with trusted third-party service providers:</p>
            
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="glass-card rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-foreground">Supabase</h4>
                <p className="text-sm text-muted-foreground">Database and authentication. Data stored in US data centers.</p>
              </div>
              <div className="glass-card rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-foreground">Plaid</h4>
                <p className="text-sm text-muted-foreground">Secure bank connections. Subject to <a href="https://plaid.com/legal/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Plaid&apos;s Privacy Policy</a>.</p>
              </div>
              <div className="glass-card rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-foreground">OpenRouter</h4>
                <p className="text-sm text-muted-foreground">AI processing. Receives only anonymized financial data (no PII).</p>
              </div>
              <div className="glass-card rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-foreground">Stripe</h4>
                <p className="text-sm text-muted-foreground">Payment processing for subscriptions.</p>
              </div>
              <div className="glass-card rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-foreground">Vercel</h4>
                <p className="text-sm text-muted-foreground">Hosting infrastructure.</p>
              </div>
            </div>

            <p className="mt-4">
              These providers are contractually bound to protect your data and use it only for providing services to Thallo.
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              5. How We Share Your Information
            </h2>
            <p>We do <strong>not</strong> sell your personal information. We may share your information only in these limited circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
              <li><strong>Service Providers:</strong> With third parties who help us operate the Service (see Section 4)</li>
              <li><strong>Legal Requirements:</strong> To comply with laws, court orders, or legal processes</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Safety & Security:</strong> To protect against fraud, abuse, or security threats</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              6. Data Retention
            </h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide you services. If you close your account, we will delete or anonymize your data within 90 days, except where we must retain it for legal or regulatory reasons.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              7. Your Privacy Rights
            </h2>
            
            <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
              7.1 General Rights
            </h3>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Export your data in a machine-readable format (coming soon)</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails (we don&apos;t send many anyway!)</li>
            </ul>

            <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
              7.2 GDPR Rights (EU Users)
            </h3>
            <p>If you are in the European Economic Area (EEA), you have additional rights under GDPR:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Right to object to processing</li>
              <li>Right to restrict processing</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>

            <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
              7.3 CCPA Rights (California Users)
            </h3>
            <p>If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed (we don&apos;t sell data)</li>
              <li>Right to opt-out of the sale of personal information (not applicable — we don&apos;t sell)</li>
              <li>Right to deletion</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>

            <p className="mt-6">
              To exercise any of these rights, contact us at <a href="mailto:support@usethallo.com" className="text-primary hover:underline">support@usethallo.com</a>.
            </p>
          </section>

          {/* Security */}
          <section className="glass-card rounded-xl p-6 border-primary/20">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-foreground">
                  8. Data Security
                </h2>
                <p>
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li><strong>AES-256 Encryption:</strong> Data encrypted at rest and in transit</li>
                  <li><strong>Row-Level Security:</strong> Database isolation per user</li>
                  <li><strong>Secure Authentication:</strong> Passwords hashed with bcrypt</li>
                  <li><strong>SOC 2 Certified Providers:</strong> Supabase and Vercel are SOC 2 compliant</li>
                  <li><strong>Regular Security Audits:</strong> Ongoing monitoring and testing</li>
                </ul>
                <p className="mt-3">
                  No method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                </p>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              9. Children&apos;s Privacy
            </h2>
            <p>
              Thallo is not intended for use by children under the age of 13 (or 16 in the EEA). We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately at <a href="mailto:support@usethallo.com" className="text-primary hover:underline">support@usethallo.com</a>, and we will delete it.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              10. International Data Transfers
            </h2>
            <p>
              Thallo is based in the United States, and your data is stored on servers in the US. If you are accessing the Service from outside the US, your information will be transferred to, stored, and processed in the US. By using Thallo, you consent to this transfer.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              11. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or through the Service. The &quot;Last Updated&quot; date at the top will reflect when changes were made. Continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              12. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your privacy rights, contact us:
            </p>
            <div className="mt-4 glass-card rounded-lg p-6 flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-semibold text-foreground">Thallo Support</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Email: <a href="mailto:support@usethallo.com" className="text-primary hover:underline">support@usethallo.com</a>
                </p>
                <p className="text-sm text-muted-foreground">
                  Alternative: <a href="mailto:ted@usethallo.com" className="text-primary hover:underline">ted@usethallo.com</a>
                </p>
              </div>
            </div>
          </section>

          {/* Financial Disclaimer */}
          <section className="mt-12 pt-8 border-t border-border">
            <div className="glass-card rounded-xl p-6 bg-muted/30">
              <h3 className="text-lg font-display font-semibold mb-3 text-foreground">
                Financial Disclaimer
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Thallo is a budgeting and financial education tool. It does not provide financial, investment, or tax advice. The Financial Health Score is for informational purposes only and is not a credit score or lending metric. Consult a qualified financial advisor for personalized financial advice.
              </p>
            </div>
          </section>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Back to Thallo
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
