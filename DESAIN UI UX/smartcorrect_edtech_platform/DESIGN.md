---
name: SmartCorrect EdTech Platform
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#9d4300'
  on-secondary: '#ffffff'
  secondary-container: '#fd761a'
  on-secondary-container: '#5c2400'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783200'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system establishes a high-performance, focused EdTech SaaS environment designed for educators, evaluators, and academic administrators. Combining the rapid density of developer tools with the precision of modern fintech platforms, the aesthetic prioritizes cognitive clarity, scan-speed, and low visual fatigue during prolonged grading and data review sessions.

### Visual Identity & Movements
- **Style Archetype:** Modern Corporate SaaS with technical utility influences (Linear clarity meets Stripe operational precision).
- **Core Mood:** Competent, analytical, accessible, and structured.
- **Compositional Rhythm:** Dense data presentation balanced by light canvas backgrounds, crisp borders, and controlled elevation. High contrast ensures grading metrics, OCR outputs, and status pills surface immediately without overwhelming users.

## Colors

The palette is engineered around functional contrast, distinguishing high-utility work zones from analytical metadata and structural shell framing.

### Palette Architecture
- **Primary (Smart Blue):** `#2563EB` anchors active workflows, primary buttons, and focused navigation markers. Interactive shifts:
  - Hover: `#1D4ED8`
  - Active/Pressed: `#1E40AF`
- **Secondary / Accent (Energetic Orange):** `#F97316` serves as an attention driver for high-value highlights, primary review triggers, or priority alerts.
  - Accent Hover: `#EA580C`
- **Surfaces & Layout Tones:**
  - App Canvas Ground: `#F8FAFC` (Slate 50) provides neutral contrast behind interactive layers.
  - Surface Containers / Cards: `#FFFFFF` ensures crisp document legibility.
  - Structural Borders & Hairlines: `#E2E8F0` (Slate 200).
- **High-Contrast Shell:**
  - Dark Navy Sidebar: `#0F172A` creates a persistent functional frame, utilizing `#1E293B` for active selection backgrounds alongside a distinct `3px` `#2563EB` left-border accent.
- **Text Hierarchy:**
  - Primary Text: `#0F172A` (Slate 900) for headers, primary data cells, and critical labels.
  - Secondary Text: `#64748B` (Slate 500) for secondary metadata, column labels, and instructional prompts.

### Semantic Tones
Semantic signals use structured three-tier token bundles (Background, Border, Text):
- **Success / Verified:** Background `#DCFCE7`, Border `#86EFAC`, Text `#166534`.
- **Warning / Needs Review:** Background `#FEF3C7`, Border `#FCD34D`, Text `#92400E`.
- **Danger / Error:** Background `#FEE2E2`, Border `#FCA5A5`, Text `#991B1B`.
- **Info / License:** Background `#DBEAFE`, Border `#93C5FD`, Text `#1E40AF`.

## Typography

The typography scale utilizes **Plus Jakarta Sans** for interface hierarchy and administrative text, delivering a contemporary geometric feel with generous apertures that preserve readability at dense data scales. 

**JetBrains Mono** provides specialized tabular alignment and technical formatting for license keys, token payloads, confidence matrices, and OCR engine diff outputs.

### Implementation Guidelines
- Restrict uppercase transformations solely to `label-sm` when used as table column headers or category metadata kickers.
- Use negative tracking (`letterSpacing: -0.01em` through `-0.025em`) on all headline styles (`headline-sm` and above) to maintain optical tension across dashboard metrics.
- Code styles (`code-md`, `code-sm`) must use proportional tabular figures (`tnum`) for raw confidence scores and numeric delta displays.

## Layout & Spacing

The system enforces a 12-column responsive grid anchored to an 8pt architectural rhythm, with a supplementary 4pt sub-grid for internal component alignment.

### Grid & Breakpoints
- **Desktop (1280px and above):** 12-column grid, `margin: 2rem`, `gutter: 1.5rem`. Max canvas container width caps at `1600px` for ultra-wide displays to maintain metric readability.
- **Tablet (768px - 1279px):** 8-column grid, `margin: 1.5rem`, `gutter: 1.25rem`. Complex grading sidebars transition into off-canvas drawers or split panes.
- **Mobile (320px - 767px):** 4-column fluid layout, `margin-mobile: 1rem`, `gutter-mobile: 1rem`. Data grids reflow into vertical card stacks.

### Shell Architecture
- **Sidebar:** Fixed width of `260px` on desktop, fully collapsing into a slim `64px` icon dock or overlay drawer at smaller breakpoints.
- **Workspace Canvas:** Uses `space-lg` (24px) gaps between analytic metric widgets and `space-xl` (32px) margins between distinct module sections.

## Elevation & Depth

Visual depth is achieved through an interplay of hairline borders (`#E2E8F0`) and diffused, neutral-slate ambient shadows. This approach maintains a flat, engineered feel while cleanly separating interactive panels from the background canvas.

### Elevation Hierarchy
- **Level 0 (Flat / Canvas):** Surface color `#F8FAFC`. Zero elevation. Used for default app shell backgrounds and structural track rails.
- **Level 1 (Base Cards & Surfaces):** Surface `#FFFFFF`, border `1px solid #E2E8F0`. Shadow: `0px 1px 3px 0px rgba(15, 23, 42, 0.05), 0px 1px 2px -1px rgba(15, 23, 42, 0.05)`. Used for content cards, data tables, and metrics tiles.
- **Level 2 (Hovered Cards & Interactive Controls):** Surface `#FFFFFF`, border `1px solid #CBD5E1`. Shadow: `0px 4px 6px -1px rgba(15, 23, 42, 0.07), 0px 2px 4px -2px rgba(15, 23, 42, 0.05)`. Applied on card hover transitions and active dropdown menus.
- **Level 3 (Modals & Overlays):** Surface `#FFFFFF`, border `1px solid #E2E8F0`. Shadow: `0px 20px 25px -5px rgba(15, 23, 42, 0.1), 0px 8px 10px -6px rgba(15, 23, 42, 0.05)`. Used for student submission inspection modals, batch-grading drawers, and command palettes.

## Shapes

The design system applies a disciplined geometric curvature scale that corresponds strictly to element scope and hierarchy:

- **Cards & Data Modules:** Enforce a strict `12px` border-radius (`0.75rem`), establishing a soft, modern container edge without appearing overly toy-like.
- **Inputs & Buttons:** Enforce an `8px` border-radius (`0.5rem` / base token scale `2`), ensuring tight mechanical alignment with standard form inputs and table action toolbars.
- **Badges, Status Pills & Tags:** Enforce a full pill radius (`9999px`), distinguishing informational status indicators immediately from rectangular interactive elements.
- **Inner Nested Elements:** When an element sits within a `12px` card with `space-sm` or `space-md` padding, its radius must scale down to `6px` or `8px` to preserve concentric curve harmony.

## Components

### Buttons
- **Primary:** Background `#2563EB`, text `#FFFFFF`, radius `8px`, height `36px` (compact) or `40px` (default). Border: `none`. Hover: `#1D4ED8`. Active: `#1E40AF`. Focus: `0 0 0 2px #FFFFFF, 0 0 0 4px #2563EB`.
- **Secondary / Outline:** Background `#FFFFFF`, text `#0F172A`, border `1px solid #E2E8F0`, radius `8px`. Hover: background `#F8FAFC`, border `#CBD5E1`.
- **Accent:** Background `#F97316`, text `#FFFFFF`, radius `8px`. Hover: `#EA580C`. Reserved for primary actions requiring immediate contrast against standard workflows.
- **Ghost / Tertiary:** Background transparent, text `#64748B`, radius `8px`. Hover: background `#F1F5F9`, text `#0F172A`.

### Status Badges & Chips
- Compact, full-pill shape (`9999px` radius).
- Padding: `2px 10px`, font: `label-sm` (`11px`, 600 weight).
- Applied strictly with triple-token borders and surfaces:
  - **Verified/Success:** Bg `#DCFCE7`, border `1px solid #86EFAC`, text `#166534`.
  - **Needs Review:** Bg `#FEF3C7`, border `1px solid #FCD34D`, text `#92400E`.
  - **Error/Rejected:** Bg `#FEE2E2`, border `1px solid #FCA5A5`, text `#991B1B`.
  - **License/Info:** Bg `#DBEAFE`, border `1px solid #93C5FD`, text `#1E40AF`.

### Input Fields & Controls
- **Text Inputs:** Height `38px`, background `#FFFFFF`, border `1px solid #E2E8F0`, radius `8px`, typography `body-md`. Focus: border `#2563EB`, shadow ring `0 0 0 1px #2563EB`. Placeholder: `#94A3B8`.
- **Checkboxes & Radios:** Size `16px`, radius `4px` (checkbox) or `9999px` (radio). Border `1px solid #CBD5E1`. Checked state: background `#2563EB`, icon `#FFFFFF`. Focus ring: `2px solid #DBEAFE`.

### Cards & Data Containers
- Base construction: Background `#FFFFFF`, border `1px solid #E2E8F0`, border-radius `12px`, padding `space-lg` (`24px`).
- Header pattern: Card header features `title-md` (`16px`, semi-bold) with optional trailing pill badges or action menus, separated from the content area by an optional hairline border (`#E2E8F0`).

### OCR Confidence & Data Cells (Specialized Component)
- Raw OCR accuracy readings display using `code-sm` (`JetBrains Mono`, `11px`).
- High-confidence text rendered with `#0F172A`; low-confidence text flag triggers an inline background highlight of `#FEF3C7` with a dotted `#F59E0B` bottom underline for rapid inspection.