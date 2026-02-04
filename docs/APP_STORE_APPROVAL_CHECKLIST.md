# Thallo — Apple App Store Approval Checklist

Based on Apple's App Review Guidelines (reviewed Feb 2026). Every item mapped to Thallo specifically.

---

## 🔴 BLOCKERS — Must fix before submission

### 1. Privacy Policy (Guideline 5.1)
- [ ] **Privacy policy page on usethallo.com** — Required. Must explain:
  - What data we collect (email, financial data, bank connections via Plaid)
  - How data is used (budgeting, AI insights, scoring)
  - Third-party services (Supabase, OpenRouter/AI, Plaid, Stripe)
  - Data retention and deletion rights
  - Contact info for privacy questions
- [ ] **Privacy policy URL in App Store Connect** — Link to the page above
- [ ] **Apple Privacy Nutrition Labels** — Must declare in App Store Connect:
  - Data used to track you: None (we don't track across apps)
  - Data linked to you: Email, financial data, usage data
  - Data not linked to you: Analytics/crash data

### 2. Demo Account for Reviewer (Guideline 2.1)
- [ ] **Create a demo account** with pre-populated data:
  - Sample budgets, transactions, debts, savings goals
  - Financial Health Score already calculated
  - All AI features accessible (needs Plus/Pro tier)
  - Demo credentials: provide in App Review Notes
- [ ] **Keep backend live** during review (Supabase + Vercel must be up)

### 3. In-App Purchases via StoreKit (Guideline 3.1.1)
- [ ] **Cannot use Stripe for iOS subscriptions** — Apple requires StoreKit IAP
  - Must implement: Plus ($79/yr) and Pro ($149/yr) as auto-renewable subscriptions
  - Apple takes 30% cut (15% if enrolled in Small Business Program <$1M revenue)
- [ ] **Alternative:** Direct users to web for subscription (gray area)
  - Allowed in US via StoreKit External Purchase Link Entitlement
  - Must apply for the entitlement
  - Safest route: implement StoreKit IAP for iOS, keep Stripe for web
- [ ] **Restore purchases** mechanism required
- [ ] **Subscription info clear before paywall** — must show:
  - Price and billing period
  - What's included in each tier
  - Free tier capabilities
  - How to cancel

### 4. Financial App Requirements (Guideline 3.2.1.viii)
- [ ] **Finance category** — Select "Finance" in App Store Connect
- [ ] **No financial advice disclaimers** — Thallo provides tools/education, not licensed financial advice
  - Add disclaimer: "Thallo is a budgeting tool. It does not provide financial, investment, or tax advice."
  - Add in Settings and/or About screen
- [ ] **Accurate data claims** — Financial Health Score methodology should be transparent
  - We already show score breakdowns — good
  - Don't claim it replaces credit scores for lending decisions

---

## 🟡 REQUIRED — Standard items for any app

### 5. App Completeness (Guideline 2.1)
- [ ] No placeholder text anywhere in the app
- [ ] No broken links or dead pages
- [ ] No "coming soon" features visible
- [ ] All screens functional and tested
- [ ] No crashes on any standard user flow
- [ ] Works on iPhone SE (smallest screen) through iPhone 15 Pro Max
- [ ] Works on iPad (Guideline 2.4.1 — iPhone apps should work on iPad)

### 6. Accurate Metadata (Guideline 2.3)
- [ ] **App name:** "Thallo" (under 30 chars ✅)
- [ ] **Subtitle:** "Get Financially Fit" or "AI Budget & Financial Health"
- [ ] **Description:** Accurate, no false claims, matches actual features
- [ ] **Keywords:** budgeting, finance, budget tracker, financial health, debt payoff, savings, AI budget, money management
- [ ] **Screenshots** (Guideline 2.3.3):
  - Must show app IN USE (not just splash screen or login)
  - Show: Dashboard, Budgets, Score, Debts, AI features
  - Required sizes:
    - 6.7" (iPhone 15 Pro Max): 1290 × 2796
    - 6.5" (iPhone 14 Plus): 1284 × 2778  
    - 5.5" (iPhone 8 Plus): 1242 × 2208
  - Use fictional data in screenshots (Guideline 2.3.9)
- [ ] **Age rating:** 4+ (no objectionable content)
- [ ] **Category:** Finance (primary), Productivity (secondary)

### 7. Minimum Functionality (Guideline 4.2)
- [ ] App must not be just a "repackaged website"
- [ ] Must have native features beyond what the website offers:
  - ✅ Native camera for receipt scanning
  - ✅ Push notifications for bill reminders
  - ✅ Face ID / Touch ID for app lock
  - ✅ Haptic feedback
  - ✅ Native splash screen
  - These are critical — Apple rejects pure WebView wrappers

### 8. Design Standards (Guideline 4.0)
- [ ] Follows iOS Human Interface Guidelines
- [ ] Safe area handling (notch, Dynamic Island, home indicator)
- [ ] Supports dark mode (already does ✅)
- [ ] Readable text sizes (supports Dynamic Type if possible)
- [ ] Accessible (VoiceOver labels on key elements)
- [ ] No references to other mobile platforms (Android, etc.) in the app
- [ ] Back navigation works via swipe gesture

---

## 🟢 GOOD TO HAVE — Reduces rejection risk

### 9. Data Security (Guideline 1.6)
- [ ] HTTPS everywhere (already using ✅)
- [ ] Supabase RLS enabled on all tables (already ✅)
- [ ] API rate limiting (already ✅)
- [ ] No secrets in client code (already audited ✅)
- [ ] Secure Plaid token handling (encrypted ✅)

### 10. Network Handling
- [ ] App works on IPv6-only networks (Guideline 2.5.5)
- [ ] Graceful offline behavior — show cached data or clear error message
- [ ] Loading states for all API calls (no blank screens)

### 11. User Account Features
- [ ] **Account deletion** — Apple requires apps with account creation to offer account deletion (Guideline 5.1.1)
  - Must be in-app, not just "email us to delete"
  - Must actually delete data, not just deactivate
- [ ] **Sign in with Apple** (Guideline 4.8) — Required if you offer any third-party social login
  - We use Supabase Auth — need to add Apple as a provider
  - If we only offer email/password, this is NOT required

### 12. App Review Notes
- [ ] Explain the Financial Health Score (what it measures, it's educational not financial advice)
- [ ] Provide demo account credentials
- [ ] Explain Plaid integration (connects to banks, read-only)
- [ ] Explain AI features (uses OpenRouter, anonymized data)
- [ ] Note the free tier — reviewer can test without payment

---

## 📋 Pre-Submission Final Checklist

```
[ ] Apple Developer Account enrolled and active
[ ] Bundle ID registered: com.usethallo.app
[ ] App icons generated (all sizes, 1024x1024 base)
[ ] Splash screen configured
[ ] Privacy policy live at usethallo.com/privacy
[ ] Demo account created and working
[ ] All screenshots captured with fictional data
[ ] StoreKit IAP configured (or web-only payment decision made)
[ ] Account deletion feature working
[ ] Sign in with Apple (if using social login)
[ ] Financial disclaimer in app
[ ] Tested on real device via TestFlight
[ ] No crashes in any flow
[ ] No placeholder content
[ ] App Review Notes written
[ ] Support URL live and accessible
[ ] IPv6 compatible
```

---

## 🚫 Common Finance App Rejections

Based on App Store review patterns for finance/budgeting apps:

1. **Missing privacy policy** — #1 reason. Must be thorough and accessible.
2. **No account deletion** — Apple started enforcing this hard in 2022+.
3. **WebView-only app** — Need native plugins to pass Guideline 4.2.
4. **IAP not implemented** — Can't use Stripe alone for digital subscriptions on iOS.
5. **Broken during review** — Backend goes down = automatic rejection.
6. **Misleading screenshots** — Show what the app actually looks like, not mockups.
7. **Missing demo credentials** — Reviewer can't log in = rejection.
8. **No financial disclaimer** — "Not financial advice" language needed.
9. **Claiming to replace credit scores** — Be careful with Health Score marketing.
10. **Third-party data sharing without disclosure** — Must list all third parties.

---

## 💰 In-App Purchase Decision

### Option A: StoreKit IAP (Safest)
- Implement auto-renewable subscriptions via StoreKit
- Plus: $79/yr → Apple gets $23.70 (30%) or $11.85 (15% small business)
- Pro: $149/yr → Apple gets $44.70 (30%) or $22.35 (15% small business)
- Web users continue using Stripe (Apple has no say over web)
- Requires StoreKit code in the app

### Option B: Web-Only Payments (Riskier)
- Use StoreKit External Purchase Link Entitlement (US only)
- Link users to usethallo.com to subscribe
- Apple may reject if not done correctly
- Only works in US storefront

### Option C: Free App + Web Upgrade
- iOS app is free with all free-tier features
- No IAP at all — keep it simple
- Users who want Plus/Pro upgrade on the website
- No "buy" buttons in the app at all
- Lowest rejection risk but might lose iOS conversions

### Recommendation: Start with Option C for v1.0
Get approved first with the free tier. Add StoreKit IAP in v1.1 once we're in the store. This avoids the IAP complexity being a blocker for initial approval.

---

## Timeline

| Phase | Task | Time | Blocker? |
|-------|------|------|----------|
| Now | Capacitor setup + native plugins | 1-2 days | No |
| Now | Privacy policy page | 2 hours | No |
| Now | Financial disclaimer in app | 30 min | No |
| Now | Account deletion feature | 2-3 hours | No |
| Waiting | Apple Developer enrollment | 24-48 hrs | **Yes** |
| After enrollment | App Store Connect setup | 1 hour | No |
| After enrollment | TestFlight build + test | 1 day | No |
| After testing | Screenshots + metadata | 2-3 hours | No |
| After testing | Submit for review | 24-48 hrs wait | No |
| **Total** | **~1 week from developer account approval** | | |
