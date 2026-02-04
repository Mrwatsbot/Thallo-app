import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertCircle, CreditCard, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service – Thallo',
  description: 'Terms and conditions for using Thallo, the budgeting and financial health app.',
  openGraph: {
    title: 'Terms of Service – Thallo',
    description: 'Terms and conditions for using Thallo.',
    type: 'website',
    url: 'https://usethallo.com/terms',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a7a6d] to-[#146b5f] flex items-center justify-center p-1">
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
            <FileText className="w-4 h-4" />
            Terms of Service
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground leading-tight">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last Updated: February 3, 2025
          </p>
        </div>

        <div className="space-y-8 text-card-foreground leading-relaxed">
          {/* Introduction */}
          <section>
            <p>
              Welcome to Thallo! These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Thallo budgeting and financial health application (the &quot;Service&quot;). By creating an account or using Thallo, you agree to these Terms.
            </p>
            <p className="mt-4">
              If you do not agree to these Terms, you may not use the Service. Please read them carefully.
            </p>
          </section>

          {/* Acceptance */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Thallo, you represent that you are at least 18 years old (or the age of majority in your jurisdiction) and have the legal capacity to enter into these Terms. If you are using Thallo on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
            </p>
          </section>

          {/* Account Responsibility */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              2. Account Responsibility
            </h2>
            
            <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
              2.1 Account Creation
            </h3>
            <p>
              You must create an account to use Thallo. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized access to your account</li>
            </ul>

            <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
              2.2 Account Security
            </h3>
            <p>
              You are solely responsible for all activity that occurs under your account. We are not liable for any loss or damage arising from your failure to maintain account security.
            </p>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              3. Acceptable Use
            </h2>
            <p>You agree to use Thallo only for lawful purposes. You will <strong>not</strong>:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Violate any applicable laws or regulations</li>
              <li>Upload false, misleading, or fraudulent information</li>
              <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
              <li>Reverse engineer, decompile, or disassemble the Service</li>
              <li>Use automated tools (bots, scrapers) without our written permission</li>
              <li>Transmit viruses, malware, or any other malicious code</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use the Service for any illegal financial activity, including money laundering or fraud</li>
            </ul>
            <p className="mt-4">
              We reserve the right to suspend or terminate your account if you violate these terms.
            </p>
          </section>

          {/* Subscriptions and Payments */}
          <section className="glass-card rounded-xl p-6 border-primary/20">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-foreground">
                  4. Subscriptions and Payments
                </h2>
                
                <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-4">
                  4.1 Free and Pro Plans
                </h3>
                <p>
                  Thallo offers a free tier with core budgeting features and a Pro subscription with advanced AI tools and features. Subscription pricing is displayed on our Pricing page and may change with notice.
                </p>

                <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
                  4.2 Billing and Renewals
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Pro subscriptions are billed monthly or annually, depending on your plan</li>
                  <li>Your subscription will automatically renew unless canceled before the renewal date</li>
                  <li>All payments are processed securely through Stripe</li>
                  <li>Prices are in USD unless otherwise stated</li>
                </ul>

                <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
                  4.3 Cancellation and Refunds
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You may cancel your Pro subscription at any time from your account settings</li>
                  <li>Cancellations take effect at the end of your current billing period</li>
                  <li>We do not offer refunds for partial months or unused subscription time, except as required by law</li>
                  <li>If you cancel, you will retain Pro access until the end of your billing period</li>
                </ul>

                <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
                  4.4 Failed Payments
                </h3>
                <p>
                  If a payment fails, we may suspend your Pro access until payment is resolved. Repeated failed payments may result in account termination.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              5. Intellectual Property
            </h2>
            
            <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
              5.1 Our Property
            </h3>
            <p>
              Thallo, including all content, software, design, logos, and trademarks, is owned by Thallo or our licensors. You may not copy, modify, distribute, sell, or lease any part of our Service without our written permission.
            </p>

            <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
              5.2 Your Data
            </h3>
            <p>
              You retain ownership of all financial data you input into Thallo. By using the Service, you grant us a limited license to use, store, and process your data solely to provide and improve the Service, as described in our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              6. Third-Party Services
            </h2>
            <p>
              Thallo integrates with third-party services, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Plaid:</strong> For bank account connections. Use of Plaid is subject to <a href="https://plaid.com/legal/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Plaid&apos;s terms and privacy policy</a>.</li>
              <li><strong>Stripe:</strong> For payment processing.</li>
              <li><strong>OpenRouter:</strong> For AI-powered features.</li>
            </ul>
            <p className="mt-4">
              We are not responsible for the actions, policies, or services of these third parties. Your use of third-party services is at your own risk.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="glass-card rounded-xl p-6 border-yellow-500/20 bg-yellow-500/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-1" />
              <div>
                <h2 className="text-2xl font-display font-bold mb-3 text-foreground">
                  7. Disclaimers
                </h2>
                
                <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-4">
                  7.1 No Financial Advice
                </h3>
                <p>
                  <strong>Thallo is a budgeting and financial education tool.</strong> It does not provide financial, investment, tax, or legal advice. The Financial Health Score is for informational purposes only and is not a credit score or lending metric.
                </p>
                <p className="mt-3">
                  All financial decisions are your responsibility. You should consult a qualified financial advisor, accountant, or legal professional before making significant financial decisions.
                </p>

                <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
                  7.2 No Guarantees
                </h3>
                <p>
                  We strive to provide accurate and helpful tools, but we make no guarantees about:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>The accuracy, completeness, or reliability of information in the Service</li>
                  <li>The performance or availability of the Service</li>
                  <li>Specific financial outcomes from using Thallo</li>
                </ul>

                <h3 className="text-xl font-display font-semibold mb-3 text-foreground mt-6">
                  7.3 &quot;As-Is&quot; Service
                </h3>
                <p>
                  Thallo is provided &quot;as is&quot; and &quot;as available,&quot; without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              8. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Thallo and its founders, employees, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Loss of profits, revenue, or data</li>
              <li>Financial losses resulting from your use or inability to use the Service</li>
              <li>Errors, bugs, or inaccuracies in the Service</li>
              <li>Unauthorized access to your account or data</li>
            </ul>
            <p className="mt-4">
              Our total liability to you for any claims arising from these Terms or your use of Thallo shall not exceed the amount you paid us in the 12 months prior to the claim, or $100, whichever is greater.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability. In such cases, our liability will be limited to the maximum extent permitted by law.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              9. Indemnification
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless Thallo and its affiliates, officers, employees, and agents from any claims, losses, liabilities, damages, costs, or expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any applicable laws or regulations</li>
              <li>Your violation of any third-party rights</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              10. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your account and access to Thallo at any time, with or without cause, and with or without notice, including if:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>You violate these Terms</li>
              <li>We detect fraudulent or illegal activity</li>
              <li>Your account remains inactive for an extended period</li>
            </ul>
            <p className="mt-4">
              Upon termination, your right to use the Service will immediately cease. You may delete your account at any time from your account settings.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              11. Governing Law and Dispute Resolution
            </h2>
            <p>
              These Terms are governed by the laws of the State of [Your State], United States, without regard to conflict of law principles.
            </p>
            <p className="mt-4">
              Any disputes arising from these Terms or your use of Thallo will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except where prohibited by law. You waive your right to participate in class-action lawsuits.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              12. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. If we make material changes, we will notify you by email or through the Service. The &quot;Last Updated&quot; date at the top will reflect when changes were made.
            </p>
            <p className="mt-4">
              Your continued use of Thallo after changes take effect constitutes acceptance of the updated Terms. If you do not agree to the new Terms, you must stop using the Service and close your account.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              13. Contact Us
            </h2>
            <p>
              If you have questions about these Terms, contact us:
            </p>
            <div className="mt-4 glass-card rounded-lg p-6 flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-1" />
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
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
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
