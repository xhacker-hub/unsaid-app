# Unsaid (Mobile App Prototype)

A high-fidelity, production-grade mobile prototype of **Unsaid**, built for couples in an arranged-marriage setting in India. Designed as a direct continuation of the Unsaid brand, visual identity, and emotional arc.

---

## 1. Context & Product Philosophy

- **Who it is for**: Indian men and women in their 20s and 30s in the early stage of an arranged marriage (introduced by families, met a few times over chai, have weeks or months to decide).
- **The problem**: Meetings remain polite and superficial. Questions that decide a marriage (finances & debt, intimacy & desires, mental health, trauma & the past, living arrangements) feel impossible to ask a near-stranger with families hovering.
- **The product**: A private, honest questionnaire each partner answers alone. Unsaid unlocks a side-by-side compatibility chart topic by topic, highlighting natural alignments and suggesting exact, non-judgmental questions to bring to the next chai meeting.
- **What it is NOT**:
  - No matching, swiping, or discovery.
  - No family accounts, roles, or reports.
  - No overall percentage score (no "83% compatible" or "incompatible" labels).
  - Skipping never counts against a score; it displays as "Not answered yet".

---

## 2. Quick Start & Running the App

The prototype is built with **Expo (React Native) + TypeScript**, supporting iOS, Android, and Web preview.

### Prerequisites
- Node.js 18+ (tested on Node 24)
- npm or yarn

### Installation
```bash
cd unsaid-app
npm install
```

### Running Locally
```bash
# Web browser preview (runs on localhost:8081 / 8082)
npm run web

# iOS Simulator / Expo Go
npm run ios

# Android Emulator / Expo Go
npm run android
```

### Running Compatibility Scoring Unit Tests
```bash
npm test
```
Runs the 11 unit test scenarios covering all Section 6 compatibility scoring rules.

---

## 3. Where Tokens Live (Section 7)

All design system tokens live in:
`file:///Users/pranavgoel/Documents/Project/unsaid-app/src/theme/tokens.ts`

- **Palette**:
  - `ground`: `#3A0C17` (Deep sindoor maroon - default screen background)
  - `ground2`: `#4D1322` (Raised sections, stall back wall)
  - `paper`: `#FBEEDC` (Cream paper cards, primary text, wordmark)
  - `cloud`: `#FFF8EE` (Thought clouds, inputs, card faces)
  - `ink`: `#24060D` (Outlines, dark text, black strip titles)
  - `mist`: `#E6BFAF` (Secondary text on maroon)
  - `line`: `#6B2437` (1.5px borders and chips)
  - `rose`: `#A8465E` (His kurta, accent cards)
  - `wine`: `#7E2C47` (Her kurta, accent cards)
  - `marigold`: `#FFB22E` (Special moment color: reveal flood, gate screens, strip text, counters)
  - `amberText`: `#6A3A12` / `#7A3E0E` (Labels on marigold)
  - `wood`: `['#A8663A', '#7A4424', '#5A3019', '#8A4E2E', '#6B3A26']` (Bench and stall)
  - `kulhad` / `chai`: `#B5653A` / `#D9A26C` (Clay cups)
- **Typography** (`src/theme/fonts.ts`):
  - **Familjen Grotesk** (400, 500, 600, 700): Used for all UI, questions, buttons, and system labels.
  - **Shantell Sans** (400, 500): Handwritten face used **only** for what is unsaid (thought clouds, trail-off fragments, private note placeholder).
- **Surfaces & Tilts**:
  - Paper cutouts with subtle alternating tilts (`-3°`, `+3°`, `-1.5°`).
  - Black torn strips with marigold text (`-2°` / `+1.5°`).
  - 999px pill buttons with `-2px` lift on press.

---

## 4. Architecture & Component Library (Section 8)

All 23 reusable components are located in `src/components/`:

| Component | Description |
|---|---|
| `Wordmark` | Grotesk 700 wordmark with torn paper rim at large sizes. Tapping triggers Quick Hide disguise. |
| `TornCard` | Cream cloud or black ink card with 2px ink border and subtle paper tilt. |
| `StripTitle` | Black torn strips with marigold text for moment titles. |
| `PillButton` | 999px radius button (primary on maroon, primary on light, secondary outline). |
| `Chip` | Topic chip with 1.5px line border and cream text on maroon. |
| `TopicToggle` | Topic consent card with "Sensitive" tag badge. |
| `OptionCard` | Single/multi choice card (selected = ink fill with cream text). |
| `ScaleSlider` | 5-step selector with labelled endpoints (e.g. Rarely to Very often). |
| `ImportanceSelector` | Low (1) / Medium (2) / High (3) importance weights. |
| `DealbreakerToggle` | Flag for non-negotiables. If alignment < 0.8, flags "Important to one of you". |
| `PrivateNoteField` | 2px dashed border turning solid on focus, self-typing Shantell Sans placeholder. |
| `ProgressBar` | Ink on cloud track with 2px ink border. |
| `ChartBar` | Animated 600ms fill bar with band chip. No percentages. |
| `BandChip` | Distinct chips: `Strong match`, `Some gaps`, `Talk about this`, `Not answered yet`, `Talk in person`. |
| `ThoughtCloud` | Paper cloud with 3-dot trail and trail-off em dash cycle in Shantell Sans. |
| `Figures` | Scalable SVG boy (rose kurta, open crown with thought scraps) and girl (wine kurta & dupatta). |
| `ChaiStallScene` | Awning, CHAI ₹10 board, kettle, wooden bench, and 2 kulhads with rising steam. |
| `BumblebeeReveal` | 6 concentric ink/marigold rings expanding from between heads, resolving to "Your chart is ready." |
| `CounterPill` | Marigold pill with en-IN formatted tabular numerals (`1,24,800`). |
| `QuickHideOverlay` | Disguises the screen as a functioning calculator if parents/relatives hover. |
| `AppLockModal` | 4-digit PIN lock security (Default PIN: `1234`). |
| `DemoControlBar` | Top drawer allowing instant switching between "Arjun (You)" and "Meera (Them)", screen jumping, and state resets. |
| `ShimmerLoading` | Paper shimmer loading indicator. |

---

## 5. Compatibility Scoring Logic (Section 6)

Implemented as pure, tested functions in `src/scoring/compatibility.ts`:

1. **Per-question alignment** (0 to 1):
   - Scale questions: $1 - \frac{|a - b|}{\text{range}}$
   - Single choice: $1.0$ if equal; else partial credit matrix if configured (e.g., "Near my parents" vs "With my parents" = $0.6$).
   - Multi-select: Jaccard similarity $\frac{|A \cap B|}{|A \cup B|}$.
   - "Prefer to discuss in person" or "Prefer not to say": Excluded from numeric score, tagged as "Talk in person".
2. **Weight**: $\max(\text{importance}_A, \text{importance}_B)$, where Low = 1, Medium = 2, High = 3.
3. **Topic score**: Weighted mean over questions both answered. If $< 50\%$ answered, band is `"Not answered yet"`.
4. **Bands**:
   - $\ge 0.80$: `"Strong match"`
   - $0.55 - 0.799$: `"Some gaps"`
   - $< 0.55$: `"Talk about this"`
   - **Dealbreaker rule**: Any dealbreaker with alignment $< 0.8$ forces band to `"Talk about this"` with the tag `"Important to one of you"` (never discloses who flagged it).
5. **Ask What Matters ordering**: Sorted by $(1 - \text{alignment}) \times \text{weight}$ with dealbreakers first. Top 3 suggestions feed directly into `"Next chai"`.

---

## 6. Data Model & What is Mocked (Section 10)

- **Users**: Two sample users:
  - **User A**: Arjun (`user_arjun`), phone `+91 98765 43210`
  - **User B**: Meera (`user_meera`), phone `+91 98123 45678`
- **Pair**: `pair_unsaid_1`, Invite code: `CHAI42`, Status: `active`.
- **Answers**: Both users come with realistic answers across all 8 topics:
  - Family & living: Strong match (both agree on boundaries with parents).
  - Money, loans & debt: Talk about this (Meera flagged dealbreaker on financial openness; Arjun has car EMI).
  - Children: Some gaps (Arjun wants 1, Meera wants 2).
  - Everyday life: Strong match (shared recharge routines).
  - Past relationships: Sensitive topic comparison.
  - Mental health & Trauma: Sensitive topics with privacy controls.
- **Future Backend**: Designed with clean schemas matching Supabase Row-Level Security (RLS) tables.

---

## 7. Interactive Prototype Walkthrough

1. **Top Demo Control Bar**:
   - Tap **"👤 Active: Arjun"** to toggle to Meera.
   - Tap **"▼ Demo Tools"** to jump directly to any of the 16 screens.
   - Tap **"🛡️ Hide"** or tap the **"Unsaid"** wordmark to trigger the discreet Calculator disguise.
2. **The End-to-End Journey**:
   - **Welcome**: Roadside chai stall scene with nervous figures and trail-off thought clouds typing in Shantell Sans.
   - **How it works**: Marigold screen with tilted cream cards.
   - **Privacy promises**: Four rules ensuring family-free privacy.
   - **Sign up**: Phone number OTP, nickname, and 18+ confirmation.
   - **Pairing**: 6-character invite code, WhatsApp share sheet, waiting state.
   - **Choose topics**: Symmetric consent (only topics both picked are compared).
   - **Questionnaire**: One question per screen, scale sliders, single/multi options, importance, dealbreaker flag, and self-typing private note placeholder.
   - **Heavy section gate**: Phone 3 spec ("This section is heavier").
   - **Waiting for partner**: One relaxed figure, one thinking figure, gentle reminder.
   - **Reveal**: 6 concentric bumblebee rings expand from between figures' heads and screen floods marigold, resolving into "Your chart is ready."
   - **Compatibility chart**: Ordered by discussion priority, visual bars, band chips, no percentages.
   - **Topic detail**: Question-level view, You: / Them: boxes, shared note visibility.
   - **Ask what matters**: Tailored conversation starters with "How to ask it" coaching tips.
   - **Next chai**: Short list of up to 3 questions, large readable discreet text for in-person meetings.
   - **Update answers**: Refreshes chart with "Updated after you talked".
   - **Settings**: App PIN lock (1234), discreet notifications, Tele-MANAS helpline (14416), unpairing.
