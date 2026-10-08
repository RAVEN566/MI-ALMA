# MoonPaw - Permanent Developer & Agent Instructions (`AGENTS.md`)

This document contains permanent, binding instructions and operational protocols for all AI agents and human engineers working on the **MoonPaw** repository. Every contribution must adhere strictly to these principles.

---

## 1. Project Mission & Architectural North Star

**MoonPaw** is a privacy-first, offline-capable, mobile-responsive Progressive Web App (PWA) designed for an individual user seeking a serene celestial productivity sanctuary on an **iPhone 15**.

The application combines:
1. Complete hierarchical task and to-do manager with recurrence.
2. Customizable event and schedule calendar with lunar timeline ribbons.
3. Deep focus timers (Pomodoro / Stopwatch) bound to task completion.
4. Virtual interactive 2D celestial cat companion ("Luna") rendered in PixiJS.
5. Cat treats, moods, stardust rewards, and achievement milestones.
6. Offline astronomical ephemeris calculations (lunar phases, zodiac signs, void-of-course).
7. Daily celestial tarot draws and reflective fortune prompts.
8. Private encrypted mood and gratitude journal.
9. Personalization, cat accessories wardrobe, and celebratory events.
10. Reminders, optional Web Push relay, and strict quiet hours.
11. Local IndexedDB storage and client-side password-encrypted backup/restore.
12. Installability as a standalone iOS Home Screen PWA.

---

## 2. The 20 Mandatory Engineering Rules

1. **Follow the Approved MoonPaw Architecture:**  
   Adhere strictly to the design and contracts established in the documentation:
   - [docs/PRODUCT_REQUIREMENTS.md](file:///c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/docs/PRODUCT_REQUIREMENTS.md)
   - [docs/ARCHITECTURE.md](file:///c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/docs/ARCHITECTURE.md)
   - [docs/FEATURE_ROADMAP.md](file:///c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/docs/FEATURE_ROADMAP.md)
   - [docs/DATABASE_DESIGN.md](file:///c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/docs/DATABASE_DESIGN.md)
   - [docs/CAT_BEHAVIOR.md](file:///c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/docs/CAT_BEHAVIOR.md)
   - [docs/SECURITY_PRIVACY.md](file:///c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/docs/SECURITY_PRIVACY.md)
   - [docs/TESTING_PLAN.md](file:///c:/Users/TestAdmin/Desktop/Work/projects/moonpaw-pwa/docs/TESTING_PLAN.md)

2. **Mobile-First; Prioritize Actual iPhone 15 Usability:**  
   Design exclusively for touch-first ergonomics. Viewport baseline is **393 × 852 points** at 3x scale. All fixed top containers must clear the Dynamic Island using `env(safe-area-inset-top)`. All bottom navigation/actions must clear the iOS gesture indicator using `env(safe-area-inset-bottom)`.

3. **Use Strict TypeScript and Modular React Components:**  
   No `any` types. Strict null checks enabled. Separate visual presentation from business logic using custom hooks and feature-based directory structures.

4. **Use IndexedDB as the Primary User Database:**  
   Dexie.js v4 is the single source of truth for all persistent user data. Use `useLiveQuery` for reactive UI updates. Do not maintain redundant global state copies of database tables in memory.

5. **Never Transmit Private User Content to a Server Without Explicit Approval:**  
   Zero remote storage. No cloud database sync. No external API transmission of task titles, calendar entries, journal entries, or user thoughts under any circumstances.

6. **Never Add Analytics, Tracking, or Advertising SDKs:**  
   Zero Google Analytics, Meta Pixel, Mixpanel, Amplitude, Sentry telemetry, or ad networks. Zero external tracking pixels or scripts.

7. **Never Create a Hidden Administrator Data-Access Backdoor:**  
   There are no master keys, admin panels, or backdoor endpoints. The software creator has zero technical ability to inspect or decrypt a user's data.

8. **Use Versioned Dexie Database Migrations:**  
   All schema modifications must advance monotonically (`db.version(2)...`). Write explicit `.upgrade()` handlers for table transformations.

9. **Never Clear User Data During Application Upgrades:**  
   Service worker updates and schema upgrades must preserve existing IndexedDB records. Destructive `db.delete()` or table wipes during migrations are strictly forbidden.

10. **Include Error Handling and Recovery Mechanisms:**  
    Wrap critical paths (cryptography, storage queries, audio, astronomy math) in structured try/catch blocks. Provide graceful fallback states and informative, non-technical recovery messages in the UI.

11. **Keep Animations Performant and Respect Reduced Motion:**  
    PixiJS canvas must run at 60fps during interaction and throttle down to 15fps or pause when idle or sleeping. Always honor `prefers-reduced-motion` by replacing physics animations with instant fades and pausing continuous sprite oscillations.

12. **Do Not Obstruct System Gestures or Important Buttons:**  
    Never trap touches in non-interactive canvas areas. Apply `overscroll-behavior-y: none` only to the interactive cat stage to prevent pull-to-refresh conflicts without breaking scrolling in content lists. Minimum tap target size is **44 × 44 points**.

13. **Maintain Full Keyboard and Touch Accessibility:**  
    Interactive elements must possess accessible ARIA roles, semantic HTML elements (`<button>`, `<main>`, `<nav>`), screen-reader labels for canvas graphics, and WCAG 2.1 AA color contrast against cosmic dark backgrounds.

14. **Use Legally Permitted Artwork and Sound Assets:**  
    Only bundle original assets, public domain materials, or assets provided in the repository (`images/` directory). Sound synthesis should prefer the Web Audio API to avoid licensing risks and asset loading latency.

15. **Never Hardcode Credentials, Passwords, or Private Tokens:**  
    No secrets, API keys, or private salts in code. All cryptographic keys are derived dynamically from the user's master passphrase in volatile memory via PBKDF2.

16. **Request Review Before Destructive Commands, Deployment, or External Services:**  
    Never execute destructive filesystem or git commands (e.g. `rm -rf`, `git reset --hard`, database drops) or initiate external network deployments without explicit user confirmation.

17. **Implement Only the Feature Requested in the Current Phase:**  
    Follow the roadmap iteratively. Do not jump ahead or introduce half-finished features from future phases. Keep change sets focused, reviewable, and modular.

18. **Do Not Replace Functioning Modules Without Justification:**  
    Refactor surgically. Preserve working code, interfaces, and unit tests unless a documented architectural defect requires replacement.

19. **Do Not Claim Untested Functionality is Working:**  
    Be rigorously honest about testing status. Distinguish between simulated/unit-tested behavior and behavior that requires physical iPhone 15 hardware validation.

20. **Keep the Project Documentation Up to Date:**  
    If an architectural detail, database entity, or feature contract evolves, immediately update the corresponding document in `docs/`.

---

## 3. iOS 15–18 WebKit PWA Invariants & Defense Strategy

When building features for the iPhone 15 PWA environment, all agents must honor these platform-specific realities:

- **Storage Eviction Defense:** Mobile Safari applies a 7-day eviction timer to uninstalled websites. Prompt the user to install to Home Screen (`display: standalone`) and call `navigator.storage.persist()` on startup.
- **Wall-Clock Reconciliation:** Background timers freeze when iOS suspends JavaScript execution. Compute elapsed durations from real UTC timestamps (`Date.now() - startedAt`) upon `visibilitychange`.
- **Autoplay Audio Policy:** iOS WebKit blocks audio context startup without user interaction. The `AudioContext` must initialize lazily upon the user's first touch gesture (`touchstart` or `pointerdown`).
- **Simulated Micro-Haptics:** `navigator.vibrate` is unsupported on iOS WebKit. Pair visual spring micro-animations with crisp audio synthesis to provide sensory feedback.
- **Push Notification Requirement:** iOS WebKit only supports Web Push when the app is installed to the Home Screen as a standalone PWA. Never prompt for push permissions inside standard Safari tabs.

---

## 4. Post-Phase Workflow & Verification Protocol

After completing any development milestone or phase:
1. **Run Type Checks & Linters:** Execute `npm run typecheck` (or `npx tsc --noEmit`) and verify zero errors.
2. **Run Test Suites:** Execute `npm test` (Vitest unit and integration suites) to verify zero regressions.
3. **Run Production Build:** Execute `npm run build` (`vite build`) to verify bundle compilation, chunk limits, and asset generation.
4. **Identify Failed Checks:** Explicitly document any failures, lint errors, or type mismatches.
5. **Explain Changes:** Summarize modified files and architectural rationale.
6. **Identify Hardware Validation Needs:** Specify what requires physical iPhone 15 or Safari WebKit validation.
7. **Local Git Commit:** Propose a local Git commit **only** when checks pass and changes have been presented to the user.

---

## 5. Standard Phase Completion Report Format

Every completed development phase must conclude with this standardized report format:

```markdown
### Phase Completion Report: [Phase Name / Number]

#### IMPLEMENTED
- [Specific feature, component, or service added or updated]
- [Entity models or migrations added]

#### TESTED
- [Unit tests executed and passing with command]
- [Integration or component tests passing]
- [Production build verification: Vite build success, bundle sizes]

#### FAILED
- [Any failed checks, type errors, or lint warnings — or "None"]

#### NOT TESTED
- [Features or edge cases not covered by automated tests]
- [Hardware-specific capabilities awaiting real iPhone 15 testing]

#### KNOWN LIMITATIONS
- [Temporary constraints, platform limitations, or deferred work]
```
