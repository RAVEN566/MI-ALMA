# MoonPaw - Quality Assurance & Testing Plan

**Document Version:** 1.0.0  
**Testing Frameworks:** Vitest / Playwright / React Testing Library / fake-indexeddb  
**Target Hardware Validation:** iPhone 15 Mobile Safari & PWA Standalone  

---

## 1. Multi-Tiered Testing Strategy

To guarantee rock-solid reliability for an offline-first, mobile-first progressive web app, MoonPaw enforces a multi-tiered test pyramid:

```
                  ┌───────────────────────┐
                  │      E2E Tests        │  Playwright (WebKit / Mobile Chrome)
                  │   (User Journeys)     │  ~25 scenarios
                  ├───────────────────────┤
                  │   Integration Tests   │  React Testing Library + Dexie
                  │  (Component + State)  │  ~80 tests
                  ├───────────────────────┤
                  │      Unit Tests       │  Vitest + fake-indexeddb
                  │ (Crypto, Math, Rules) │  ~200+ tests
                  └───────────────────────┘
```

---

## 2. Unit Testing Specification (Vitest)

Unit tests run with ultra-fast feedback in Node/jsdom environments using Vitest:

### 2.1 Cryptographic & Security Verification (`services/crypto.test.ts`)
- **PBKDF2 Key Derivation:** Verify that identical passwords with identical salts produce matching 256-bit keys; verify that varying salts produce cryptographically distinct keys.
- **AES-256-GCM Encryption/Decryption Roundtrip:** Verify that plaintext JSON objects encrypt into base64 ciphertext and decrypt cleanly with the original password.
- **Tamper Detection (GCM Authentication Tag):** Mutate 1 bit in the ciphertext; assert that `crypto.subtle.decrypt()` rejects with `OperationError`.
- **Wrong Password Rejection:** Assert that decrypting with an incorrect passphrase fails immediately without data corruption.

### 2.2 Astronomical Calculations (`services/astronomy.test.ts`)
- **Phase Accuracy:** Compare calculated lunar phase names and illumination percentages against benchmark dates from the US Naval Observatory ephemeris.
- **Zodiac Sign Mapping:** Validate that the Moon's calculated ecliptic longitude correctly maps to the 12 tropical zodiac signs across 365 daily sample steps.
- **Void-of-Course Calculations:** Ensure accurate aspect calculations before the Moon enters the subsequent sign.

### 2.3 Task Recurrence Engine (`features/tasks/recurrence.test.ts`)
- **Daily Recurrence:** Calculating next due date from today adds exactly 1 day.
- **Weekly with Day Mask:** A task set to recur every Monday and Wednesday increments to the proper subsequent weekday.
- **Lunar Phase Recurrence:** A task recurring "Every Full Moon" accurately calculates the date of the subsequent astronomical Full Moon.

### 2.4 Cat Behavior State Machine (`canvas/CatStateMachine.test.ts`)
- **Transition Safety:** Verify valid transitions (`IDLE_SITTING` $\rightarrow$ `PETTED_STRETCH` $\rightarrow$ `HAPPY_PURRING`).
- **Forbidden Transitions:** Assert that `SLEEPING` cannot immediately transition to `CELEBRATING` without first transitioning through wakefulness.
- **Decay Calculus:** Simulate 24-hour time advances; verify that hunger and happiness deplete gracefully and never produce negative or `NaN` numbers.

---

## 3. Component & Integration Testing (React Testing Library)

Testing React components combined with real in-memory IndexedDB powered by `fake-indexeddb`:

### 3.1 Task Operations & Live Queries (`features/tasks/TaskList.test.tsx`)
- Render `TaskList` connected to `fake-indexeddb`.
- Trigger "Add Task" button; type "Harvest Moon Herbs"; submit form.
- Verify that task appears in the DOM immediately via Dexie's reactive `useLiveQuery`.
- Click checkbox to mark as complete; verify that task moves to completed archive and emits `task:completed` on `AppEventBus`.

### 3.2 Focus Timer Reconciliation (`features/focus/FocusTimer.test.tsx`)
- Mount `FocusTimer` and start a 25-minute Pomodoro.
- Advance system time by 10 minutes (`vi.setSystemTime()`).
- Dispatch `visibilitychange` event (simulating iOS screen wake).
- Assert UI renders exactly 15 minutes remaining and cat remains in `FOCUS_STUDYING` state.

---

## 4. End-to-End Testing Matrix (Playwright)

Playwright tests run against modern WebKit (simulating mobile Safari) and Chromium:

### 4.1 Critical User Journeys (CUJs)

| CUJ ID | Test Flow Description | Key Assertions |
| :--- | :--- | :--- |
| **CUJ-01** | First-time launch & onboarding | Database initializes; default cat "Luna" appears; initial tutorial cards display without errors. |
| **CUJ-02** | Create, complete, and verify task history | Task is created, completed, stardust increases by 10, cat celebrates, and completed task persists in history tab. |
| **CUJ-03** | Daily Tarot Draw | Deck shuffles, card flips with 3D animation, keywords display, and "Reflect in Journal" creates linked journal entry. |
| **CUJ-04** | Offline Mode Durability | Browser network is set to offline; app navigates between tasks, calendar, journal, and cat stage without network errors. |
| **CUJ-05** | Encrypted Export & Restore | Create tasks $\rightarrow$ Export with password "StarDust123!" $\rightarrow$ Wipe IndexedDB $\rightarrow$ Import `.moonpaw` file $\rightarrow$ Verify all tasks, journal entries, and cat level are 100% restored. |
| **CUJ-06** | Wall-clock timer background test | Start timer $\rightarrow$ simulate tab suspend $\rightarrow$ resume $\rightarrow$ verify wall-clock reconciliation finishes on schedule. |

---

## 5. Mobile WebKit & iPhone 15 Specific Test Matrix

| Validation Criteria | Target Specification | Automated / Manual Verification Method |
| :--- | :--- | :--- |
| **Viewport & Resolution** | 393 × 852 pt (iPhone 15) | Playwright Mobile WebKit emulation with `viewport: { width: 393, height: 852 }` and `deviceScaleFactor: 3`. |
| **Dynamic Island Inset** | Top safe-area clipping prevention | Assert that navigation headers have `padding-top: env(safe-area-inset-top)` and do not clip behind camera cutout. |
| **Home Indicator Bar** | Bottom gesture bar clearance | Assert that bottom navigation bar is padded with `padding-bottom: env(safe-area-inset-bottom)`. |
| **Touch Ergonomics** | Min 44 × 44 pt tap targets | Automated Playwright script scanning all button and link bounding boxes. |
| **Elastic Pull-to-Refresh** | Canvas gesture conflict | Verify `overscroll-behavior-y: none` is applied on the PixiJS canvas container to prevent unwanted Safari page reloads during petting. |
| **Web Audio Unlock** | Autoplay policy compliance | Verify `AudioContext` initializes on first user touch gesture without throwing browser console errors. |

---

## 6. Automated Verification Pipeline (CI/CD)

The GitHub Actions pipeline enforces quality gates before deploying to Cloudflare Pages:

```yaml
name: MoonPaw CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: TypeScript Strict Type Check
        run: npx tsc --noEmit

      - name: Lint & Code Style
        run: npm run lint

      - name: Vitest Unit & Integration Suite
        run: npm run test:coverage

      - name: Playwright End-to-End Tests
        run: npx playwright test

      - name: Build Production PWA Bundle
        run: npm run build

      - name: Deploy to Cloudflare Pages
        if: github.ref == 'refs/heads/main'
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: 'moonpaw-pwa'
          directory: 'dist'
```

---

## 7. Performance Benchmarks & Frame Budget

- **PixiJS Canvas Budget:** Maximum 16.6ms per frame (steady 60fps) during active animations; throttled to 15fps or zero when idle/sleeping.
- **Bundle Size Ceiling:**
  - Initial JS bundle: $< 180 \text{ KB}$ gzipped.
  - Initial CSS bundle: $< 25 \text{ KB}$ gzipped.
  - Ephemeris & Tarot metadata: $< 80 \text{ KB}$ gzipped.
- **Lighthouse Performance Score Targets:**
  - Performance: $\ge 95$
  - Accessibility: $100$
  - Best Practices: $100$
  - PWA Criteria: $100$ (Passes all installability checks)
