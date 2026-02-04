# Thallo iOS App — Build Plan

## Overview
Wrap the existing Next.js web app using Capacitor to create a native iOS app for the App Store. Same codebase, same backend — native shell with iOS-specific enhancements.

## Architecture
```
budget-app/app/           ← existing Next.js app (unchanged)
  ├── src/                ← React components, API routes
  ├── ios/                ← Capacitor iOS project (NEW)
  ├── capacitor.config.ts ← Capacitor config (NEW)
  └── public/             ← app icons, splash screens
```

**How it works:**
- Web: `vercel deploy` → budgetwise-puce.vercel.app (unchanged)
- iOS: Capacitor builds a native WKWebView shell that loads the app
- Both use the same Supabase backend, same API routes, same auth
- Native plugins add iOS-specific features (camera, push, biometrics)

---

## Prerequisites
- [ ] Apple Developer Account ($99/yr) — Ted needs to enroll at developer.apple.com
- [ ] App name "Thallo" availability check on App Store
- [ ] Bundle ID: `com.usethallo.app` (or similar)
- [ ] macOS build environment (Xcode 16+) — cloud CI or local Mac

---

## Phase 1: Capacitor Setup & Basic Shell ⏱️ ~2 hours
**Goal:** App loads in iOS simulator, auth works, basic navigation works.

### Tasks:
1. Install Capacitor core + iOS platform
2. Create `capacitor.config.ts` with app metadata
3. Configure build output for Capacitor (static export or server URL)
4. Initialize iOS project (`npx cap add ios`)
5. Generate app icons (1024x1024 → all required sizes)
6. Generate splash screens
7. Configure `Info.plist` (permissions, URL schemes)
8. Test in Xcode Simulator

### Key Decision — Build Strategy:
**Option A: Live URL (recommended for now)**
- Capacitor loads `https://budgetwise-puce.vercel.app` in the native shell
- Pros: Zero build changes, instant updates without App Store review
- Cons: Requires internet, slightly slower initial load
- Apple allows this as long as there's meaningful native integration

**Option B: Static export + bundled**
- Export Next.js as static HTML and bundle into the app
- Pros: Offline capable, faster load
- Cons: Need to handle SSR routes, API routes need absolute URLs
- More work, do this in Phase 4

**Recommendation: Start with Option A, migrate to B later.**

---

## Phase 2: Native Plugins & iOS Polish ⏱️ ~1 day
**Goal:** App feels native, uses iOS-specific features.

### Tasks:
1. **Status bar & safe areas** — proper insets for notch/Dynamic Island
2. **Navigation** — native swipe-back gestures, disable bounce scroll where needed
3. **Biometric auth** — Face ID / Touch ID for app lock
   - Plugin: `@capacitor/biometric-auth` or `capacitor-native-biometric`
   - Flow: Optional app lock in Settings, prompt on app open
4. **Camera (receipt scanning)** — native camera instead of file picker
   - Plugin: `@capacitor/camera`
   - Modify `scan-receipt-dialog.tsx` to use native camera on iOS
5. **Push notifications**
   - Plugin: `@capacitor/push-notifications`
   - Register for APNs, store device token in Supabase
   - Bill reminders, budget alerts, score changes
6. **Haptic feedback** — subtle vibrations on key actions
   - Plugin: `@capacitor/haptics`
   - Add to: score reveals, achievement unlocks, payment logs
7. **Splash screen** — native launch screen matching Thallo branding
   - Plugin: `@capacitor/splash-screen`
8. **App badge** — show unread notification count
9. **Keyboard handling** — auto-scroll inputs above keyboard
10. **Dark mode** — respect system setting (already supported in web)

---

## Phase 3: Testing & TestFlight ⏱️ ~1 day
**Goal:** App on Ted's phone via TestFlight.

### Tasks:
1. Configure App Store Connect
   - Create app record (name, bundle ID, description, category: Finance)
   - Set up TestFlight
2. Build & archive in Xcode
3. Upload to App Store Connect
4. Add Ted as internal tester
5. Ted installs TestFlight → downloads Thallo
6. Test all flows on real device:
   - Sign up / login
   - Dashboard
   - Budget management
   - Debt tracking (edit, delete, log payment)
   - Savings goals
   - AI features (receipt scan with native camera)
   - Score page
   - Settings
7. Fix any mobile-specific issues found

### Testing on Ted's Phone:
1. Ted downloads **TestFlight** from App Store (free)
2. I send a TestFlight invite to his Apple ID email
3. He taps the link → installs Thallo
4. Updates push automatically as we build new versions

---

## Phase 4: App Store Submission ⏱️ ~2-3 days (mostly waiting)
**Goal:** Live on the App Store.

### Tasks:
1. **App Store listing:**
   - App name: Thallo
   - Subtitle: "Get Financially Fit"
   - Description (4000 chars max)
   - Keywords for ASO (budgeting, finance, health score, etc.)
   - Category: Finance
   - Privacy policy URL (required)
   - Support URL
2. **Screenshots** — required sizes:
   - 6.7" (iPhone 15 Pro Max): 1290 × 2796
   - 6.5" (iPhone 14 Plus): 1284 × 2778
   - 5.5" (iPhone 8 Plus): 1242 × 2208
   - iPad Pro 12.9": 2048 × 2732
3. **App Review preparation:**
   - Demo account credentials (Apple reviewer needs to test)
   - Notes explaining the app's purpose
   - Ensure no broken features
4. **Submit for review** (typically 24-48 hours)
5. **Address any rejection feedback** (common for finance apps)

### Common App Store Rejection Reasons (Finance):
- Missing privacy policy
- Requiring login without explaining why
- Broken features or placeholder content
- Not enough native functionality (pure WebView wrapper)
  → Our native plugins (camera, biometrics, push) prevent this
- In-app purchase required for premium features
  → Need to integrate StoreKit for Plus/Pro tiers if selling in-app

---

## Phase 5: Post-Launch Enhancements ⏱️ Ongoing
- **Offline mode** — cache dashboard data, allow offline transaction entry
- **Widgets** — iOS home screen widgets (safe-to-spend, score)
- **Apple Watch** — complication for score or daily spend
- **Shortcuts/Siri** — "Hey Siri, log a $50 expense"
- **In-App Purchases** — StoreKit integration for Plus/Pro subscriptions
- **Android** — Capacitor supports Android too, same codebase

---

## ⚠️ Important Notes

### Apple Developer Account
Ted needs to enroll at https://developer.apple.com/programs/
- Cost: $99/year
- Enrollment takes 24-48 hours to process
- Required for TestFlight AND App Store submission
- Can enroll as individual or organization

### In-App Purchases
If selling Plus/Pro subscriptions through the iOS app, Apple takes 30% (15% for small business program <$1M revenue). Options:
1. Use StoreKit for in-app subscriptions (Apple gets cut)
2. Direct users to web for payment (allowed for "reader" apps, gray area for others)
3. Link to website without mentioning price (Apple's current rules as of 2024+)

### Build Environment
Need macOS + Xcode to compile. Options:
1. Mac mini / MacBook (best for ongoing development)
2. GitHub Actions with macOS runner (free for public repos, $0.08/min private)
3. Codemagic CI/CD (600 min/month free)
4. Mac-in-cloud services (MacStadium, AWS EC2 Mac)

---

## Delegation Plan

### Can be done now (no Apple account needed):
- [x] Phase 1: Capacitor setup, config, project structure
- [x] Phase 2: Native plugin integration code
- [x] App icons & splash screen generation
- [x] Platform detection utilities (`isNative()` helpers)
- [x] Privacy policy page

### Needs Apple Developer Account:
- [ ] Phase 3: TestFlight build & upload
- [ ] Phase 4: App Store Connect setup & submission

### Needs Ted's input:
- [ ] Apple Developer enrollment
- [ ] Apple ID email for TestFlight invite
- [ ] App Store description review
- [ ] Screenshot approval
- [ ] In-app purchase pricing decision
