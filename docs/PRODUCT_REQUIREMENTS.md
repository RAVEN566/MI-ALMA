# MoonPaw - Product Requirements Document (PRD)

**Document Version:** 1.0.0  
**Status:** Approved for Implementation  
**Target Platform:** iPhone 15 (iOS Safari Standalone PWA) & Responsive Modern Web  
**Primary Engine:** React 19 / TypeScript / Dexie.js / PixiJS / Tailwind CSS  

---

## 1. Executive Summary & Product Vision

**MoonPaw** is a privacy-first, offline-capable, mobile-responsive Progressive Web App (PWA) tailored specifically for an individual user seeking a serene, celestial productivity sanctuary on an iPhone 15.

Modern productivity tools suffer from cloud lock-in, invasive telemetry, sterile corporate aesthetics, and fragmented user experiences across separate calendar, to-do, timer, and journaling apps. MoonPaw converges deep productivity with emotional resonance:
- **Productivity Suite:** Full-featured hierarchical to-dos, recurring schedules, interactive lunar calendar, and Pomodoro focus timers.
- **Cozy Emotional Anchor:** A reactive, virtual celestial cat companion rendered via WebGL (PixiJS) that thrives as the user accomplishes their real-world goals.
- **Celestial & Mindful Wellness:** Offline astronomical ephemeris calculations (lunar phases, astrological signs, void-of-course windows), daily archetype tarot draws, and a cryptographic private mood journal.
- **Absolute Data Sovereignty:** Zero user account required, zero remote tracking, 100% offline-first IndexedDB storage, and client-side AES-256-GCM encrypted backup/restore.

---

## 2. Target Device, Hardware Constraints & User Persona

### 2.1 Target Persona
- **Archetype:** Mindful creator, student, or knowledge worker seeking structure, emotional warmth, and privacy.
- **Environment:** Primary usage on mobile while on the move or in bed (dark/twilight environments), with desktop accessibility when seated at a desk.
- **Core Motivation:** Gentle reinforcement over punitive gamification; wants a soothing ritual rather than a stressful productivity grinder.

### 2.2 Primary Hardware Profile: iPhone 15 / 15 Pro
- **Screen Resolution:** 393 × 852 points (1179 × 2556 pixels at 3x scale factor).
- **Aspect Ratio:** ~19.5:9.
- **Hardware Features:** Dynamic Island cutout at the top, rounded screen corners, gesture home indicator bar at the bottom.
- **Rendering Context:** Mobile Safari / WebKit engine with standalone PWA container.
- **Input Modality:** Multi-touch gestures (tap, drag, swipe, long-press).
- **Storage Profile:** High internal flash memory, but constrained by WebKit storage eviction rules unless pinned to Home Screen.

---

## 3. Detailed Feature Specifications (The 12 Core Pillars)

### Pillar 1: Task and To-Do Manager
- **Hierarchy & Structure:**
  - Tasks support titles, markdown notes/descriptions, subtask checklists, and color-coded cosmic tags (e.g., `#Work`, `#Spiritual`, `#Health`, `#Creative`).
  - Priority levels: *Starlight (Low)*, *Moonlight (Medium)*, *Solar (High)*, *Supernova (Urgent)*.
  - Due dates with optional time stamps and estimated duration (minutes).
- **Recurrence Engine:**
  - Standard recurrence: Daily, Weekly (custom day-of-week masks), Bi-weekly, Monthly (by day of month or weekday), and Annual.
  - Lunar recurrence: Sync tasks with lunar events (e.g., "Review goals every New Moon", "Release habits every Full Moon").
- **State & History Management:**
  - Task states: `pending`, `in_progress`, `completed`, `archived`, `deleted`.
  - Completed tasks are never destroyed; they persist indefinitely in IndexedDB with completion timestamps and stats for retrospective velocity reports.
  - Bulk actions, search filters, and smart views ("Today", "Upcoming", "Lunar Alignments", "Completed Archive").

### Pillar 2: Customizable Event & Schedule Calendar
- **Views:**
  - **Month View:** Overview grid highlighting moon phase icons, event indicators, and completed task tallies.
  - **Week View:** 7-day hourly agenda with scrollable time blocks.
  - **Day View:** High-fidelity day planner integrating scheduled events side-by-side with scheduled focus blocks.
- **Calendar & Task Unification:**
  - Events can link directly to a Task or Focus Session.
  - Time-blocking mode: Drag tasks directly into calendar slots.
- **Celestial Overlays:**
  - Visual lunar phase ribbons displaying exact phase change hours, moon zodiac signs, and void-of-course intervals directly on the calendar timeline.

### Pillar 3: Focus Timers Linked to Task Completion
- **Timer Modes:**
  - **Pomodoro Mode:** Configurable work intervals (default 25m) with short breaks (5m) and long breaks (15m).
  - **Deep Focus (Stopwatch):** Open-ended count-up timer for flow state work.
  - **Short Sprint:** Quick 10m or 15m decluttering timers.
- **Task Association:**
  - A focus session is optionally bound to an active Task. Completion of the timer logs actual work time against the task's estimated time.
- **Companion Synchronization:**
  - When focus starts, the cat companion equips reading glasses or settles down into a focused posture next to a candle or book, purring softly.
  - Pausing the timer prompts a gentle questioning meow from the companion.
- **iOS Background Resiliency:**
  - Timer logic relies on strict wall-clock epoch timestamps (`Date.now()`) rather than interval ticks, ensuring seamless accuracy even if WebKit suspends the tab when the iPhone screen locks.

### Pillar 4: Virtual Interactive Cat Companion ("Luna")
- **Visual Engine:**
  - Rendered via PixiJS WebGL canvas overlaying the celestial theme, delivering crisp 60fps animations.
  - Distinct animation states: Idle Sitting, Grooming, Catnap Sleeping, Playful Pounce, Petted Stretch, Focused Studying, Eating, Mystical Glow.
- **Direct Touch Interactions:**
  - **Petting:** Finger swipe across the cat triggers purr animations, floating heart/stardust particles, and increases happiness.
  - **Tapping:** Triggers curious head tilts, tail flicks, or soft audio chirps.
  - **Feeding:** Dragging treats from the inventory into the celestial bowl triggers joyful eating animations and purring.
- **Emotional & Physical Metrics:**
  - **Hunger (0–100):** Depletes slowly over 24 hours. Replenished with treats/tuna.
  - **Happiness (0–100):** Boosted by petting, completing tasks, and focus sessions.
  - **Energy (0–100):** Depletes during daytime activity; restored during natural night hours or user-initiated sleep mode.
  - **Zero-Cruelty Philosophy:** Metrics never drop to lethal levels. The cat never dies or leaves; low metrics merely cause the cat to appear sleepy or aloof, gently nudging the user to return and care for them.

### Pillar 5: Cat Treats, Moods, Rewards & Achievements
- **Economy System:**
  - **Stardust ($\bigstar$):** Earned by completing tasks (+10 to +50 based on priority), finishing focus sessions (+1 per minute focused), and recording daily journal entries (+20).
  - **Tuna Cans & Celestial Fish:** Purchased in the Moon Shop using Stardust, used to feed the companion.
- **Mood System:**
  - Cat mood dynamics: *Ecstatic*, *Content*, *Playful*, *Sleepy*, *Mystical*, *Curious*.
  - Cat mood dynamically influences interactive dialogue bubbles (e.g., philosophical musings, encouraging reminders, playful puns).
- **Achievements & Badges:**
  - 30+ Celestial Milestones (e.g., "New Moon Novice", "Full Moon Master", "100 Hours of Deep Starlight Focus", "7-Day Gratitude Constellation").

### Pillar 6: Accurate Lunar Phases with Astrological Interpretations
- **Offline Ephemeris Calculation:**
  - Powered by `astronomy-engine` for mathematically exact calculations computed locally without network requests.
  - Calculates: Exact Phase Name (New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Third Quarter, Waning Crescent), Illumination Percentage (0.0% to 100.0%), Moon Age (days), Moon Distance, and Ecliptic Longitude.
- **Astrological Zodiac Moon Sign:**
  - Real-time calculation of which tropical astrological zodiac sign the Moon is currently transiting (Aries through Pisces).
  - Interpretive descriptions: Emotional tone, optimal activities (e.g., "Moon in Taurus: Grounding, ideal for financial planning and steady focus").
- **Void-of-Course Tracking:**
  - Alerts when the Moon makes its final major aspect before changing signs, suggesting reflective or routine work over initiating high-stakes contracts.

### Pillar 7: Daily Tarot Card and Reflective Fortune
- **Tarot Deck Architecture:**
  - Complete 78-card Rider-Waite-Smith inspired celestial deck (22 Major Arcana + 56 Minor Arcana).
  - High-resolution local celestial art assets (incorporating existing `Tarot 1.jpeg`, `Tarot 2.jpeg`, `Tarot 3.jpeg`).
- **Draw Mechanics:**
  - **Daily 1-Card Draw:** Mystical shuffle animation, card flip interaction, reveals upright or reversed meaning, celestial keywords, and a guided journaling prompt.
  - **3-Card Spread (Past / Present / Future or Mind / Body / Spirit):** Unlocked for weekend reviews or New/Full Moon reflections.
- **Reflection Tie-In:**
  - Single-tap action: "Reflect on this card in Journal" pre-populates today's journal entry with the card's metadata and reflection prompt.

### Pillar 8: Private Mood Journal
- **Entry Structure:**
  - Daily mood score (1–5 scale visualized as moon luminescence icons: Dark, Crescent, Half, Gibbous, Glowing Full).
  - Emotional tags (`#Peaceful`, `#Anxious`, `#Inspired`, `#Fatigued`, `#Grateful`, `#CosmicFlow`).
  - Rich text or markdown note body.
  - Linked Daily Tarot Card and Lunar Phase snapshot.
- **Analytics & Trends:**
  - Correlate mood trends with lunar phases using interactive Recharts line and radar graphs (e.g., "Do you feel more energetic during the Waxing Moon?").
- **Zero-Knowledge Architecture:**
  - Data stored exclusively in device IndexedDB. No cloud analytics, no server-side ingestion.

### Pillar 9: Personalization, Cat Accessories & Special-Day Celebrations
- **Cosmetics Closet:**
  - Cat accessories: Celestial collars, wizard hats, starlight bows, cozy rugs, miniature telescope, floating planetary orbs.
  - Items unlocked via Stardust or milestone achievements.
- **Celestial Themes:**
  - *Midnight Velvet* (Deep obsidian, indigo, and starlight gold).
  - *Twilight Amethyst* (Rich violet, lavender, and silver moonbeams).
  - *Starlight Rose* (Cosmic pink, mauve, and soft stardust).
  - *Aurora Borealis* (Deep teal, emerald, and glowing cyan).
- **Special Day Celebrations:**
  - User birthday celebration: Cat wears party crown, celestial confetti particles rain down, bonus treats gifted.
  - Solstices & Equinoxes: Custom seasonal interface accents and companion greetings.

### Pillar 10: Reminders, Optional Web Push & Quiet Hours
- **In-App Local Notifications:**
  - Ambient audio cues and visual banner toasts when timer concludes or task due time arrives while the app is foregrounded.
- **Web Push Notifications (iOS 16.4+ Standalone PWA):**
  - Optional integration with lightweight Cloudflare Worker push relay.
  - Triggers task reminders and lunar transition notifications.
  - Explicit user opt-in required; no prompts shown until user reaches settings or toggles reminders.
- **Strict Quiet Hours:**
  - Configurable schedule (default 10:00 PM – 8:00 AM).
  - All push, local sounds, and vibration-simulating cues are completely silenced during quiet hours.

### Pillar 11: Private Device Storage & Encrypted Data Backup
- **Primary Storage:**
  - Dexie.js wrapping HTML5 IndexedDB, providing transactional integrity and reactive queries.
- **Encrypted Backup Format:**
  - Client-side encryption using Web Crypto API (`crypto.subtle`).
  - Key derivation: PBKDF2 (SHA-256, 600,000 iterations) from user-entered master password.
  - Encryption: AES-256-GCM authenticated encryption.
  - Output: Portable `.moonpaw` backup file (base64/JSON containing salt, IV, auth tag, and ciphertext).
- **Restore & Verification:**
  - Validates cryptographic authentication tag before committing writes to IndexedDB to prevent corruption.

### Pillar 12: Installability as a Standalone iOS Home Screen App
- **PWA Manifest:**
  - `display: "standalone"`, `orientation: "portrait"`, custom splash screen assets, dark theme color matching iPhone dynamic island bezel.
- **iOS Safari Adaptations:**
  - Viewport cover configurations (`viewport-fit=cover`).
  - Safe-area inset paddings for Dynamic Island (`safe-area-inset-top`) and home indicator (`safe-area-inset-bottom`).
  - Touch event prevention for default Safari elastic pull-to-refresh where it interferes with cat interaction.

---

## 4. iPhone 15 & iOS WebKit Constraints & Technical Solutions

| iOS Limitation | Risk / Behavior | MoonPaw Architectural Solution |
| :--- | :--- | :--- |
| **7-Day Safari Storage Eviction** | Inactive Safari websites have IndexedDB evicted after 7 days without user interaction. | **Mitigated:** Installing PWA to Home Screen grants permanent persistent storage. The app invokes `navigator.storage.persist()` on launch and warns non-standalone users. |
| **Background Execution Suspension** | WebKit halts JS execution within 3–10 seconds of backgrounding or screen lock. `setInterval` stops ticking. | **Mitigated:** All timers store UTC start time (`startedAt`) and target epoch (`targetEndAt`). On foreground `visibilitychange`, the app calculates $\Delta t = Date.now() - startedAt$, reconciling timer state immediately. |
| **Web Push Permissions** | iOS WebKit strictly forbids Push Notifications in standard Safari browser tabs. | **Mitigated:** Web Push is only enabled when `window.matchMedia('(display-mode: standalone)').matches` is true. The app displays clear installation guidance before requesting permissions. |
| **Autoplay Audio Policy** | Web Audio cannot play sound without prior user touch gesture on the current session. | **Mitigated:** An `AudioContextManager` lazily initializes and unlocks the Web Audio API on the first user touch/tap anywhere on the canvas or screen. |
| **Haptic Feedback Support** | `navigator.vibrate` is completely disabled/unsupported on iOS WebKit. | **Mitigated:** Implemented simulated sensory feedback through high-frequency visual micro-springs (Motion) and crisp, synthesized audio clicks. |
| **Dynamic Island & Home Indicator** | Fixed header/footer content gets clipped by the camera island or swipe bar. | **Mitigated:** Tailwind CSS configured with `safe-top` (`env(safe-area-inset-top)`) and `safe-bottom` (`env(safe-area-inset-bottom)`) utilities across all fixed layouts. |

---

## 5. Security, Privacy & Administrative Boundary Principles

1. **Zero Telemetry:** No Google Analytics, no Meta Pixel, no Mixpanel, no Sentry uploading crash dumps to foreign servers.
2. **Zero Centralized User Database:** No user authentication server, no cloud database holding user to-dos, thoughts, or journal entries.
3. **Strict Separation of Technical Support:**
   - Technical diagnostics are generated locally on-demand via a "Export Diagnostic Bundle" button.
   - Diagnostic exports contain *strictly* engine logs, IndexedDB table counts, and error stack traces.
   - All task names, journal entries, and personal notes are scrubbed and replaced with cryptographic hashes or `[REDACTED]` tokens before export.
4. **No Hidden Administrative Access:** Because no remote database exists, developers and administrators possess zero technical means to access, view, or decrypt user data.

---

## 6. Accessibility & Inclusivity (A11y)
- **Reduced Motion Support:** Respects `prefers-reduced-motion: reduce`. PixiJS disables continuous idling/bouncing and substitutes static expressive poses; UI transitions switch from spring physics to instant fades.
- **Color Contrast & Readability:** All celestial colors adhere to WCAG 2.1 AA standards (minimum 4.5:1 contrast for regular text against dark cosmic backgrounds).
- **Screen Reader Support:** Semantic HTML markup with ARIA roles for the PixiJS canvas (`role="img" aria-label="Luna the celestial cat, currently sleeping peacefully"`).
- **Touch Target Sizing:** All interactive tap targets meet or exceed Apple HIG guidelines (minimum 44 × 44 points).
