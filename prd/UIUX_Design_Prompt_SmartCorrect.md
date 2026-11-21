# High-Fidelity UI/UX Design Prompt for SmartCorrect EdTech Platform

Design a complete high-fidelity UI/UX for SmartCorrect.
SmartCorrect is a premium, modern EdTech SaaS web application built on Google Apps Script and Google Sheets that automates exam grading from handwritten student papers (A/B/C/D) and bubble sheets using AI vision. It empowers teachers with confidence-score verification queues, lightning-fast Excel/CSV answer key imports, comprehensive psychometric item analysis, multi-format reporting, and a server-side SaaS license activation system.

## Design Identity
- Style: Modern Clean EdTech SaaS Dashboard (inspired by Linear, Stripe Dashboard, and Vercel).
- Aesthetic: Card-based architecture, subtle elevated soft shadows, clean hairline borders, generous whitespace, rounded geometric shapes, thumb-friendly mobile design.
- Color Palette (Light Theme):
  - Primary Brand (Smart Blue): `#2563EB` (Hover: `#1D4ED8`, Pressed: `#1E40AF`)
  - Accent / Highlights (Energetic Orange): `#F97316` (Hover: `#EA580C`)
  - Background (App Canvas): `#F8FAFC` (Slate 50)
  - Surface (Cards, Modals, Panels): `#FFFFFF`
  - Text Primary (Headings & Bold Text): `#0F172A` (Slate 900)
  - Text Secondary (Labels, Subtitles, Meta): `#64748B` (Slate 500)
  - Border & Dividers: `#E2E8F0` (Slate 200)
  - Sidebar Dark Navy: `#0F172A` (Sidebar Active: `#1E293B` with `#2563EB` left border)
- Color Palette (Dark Mode Extension):
  - Canvas: `#0B0F19`, Surface: `#111827`, Card Border: `#1F2937`, Text Primary: `#F9FAFB`, Text Secondary: `#9CA3AF`.
- Status & Semantic Colors:
  - Success / Verified: Background `#DCFCE7`, Text `#166534`, Border `#86EFAC`
  - Warning / Needs Review: Background `#FEF3C7`, Text `#92400E`, Border `#FCD34D`
  - Danger / Error: Background `#FEE2E2`, Text `#991B1B`, Border `#FCA5A5`
  - Info / License Active: Background `#DBEAFE`, Text `#1E40AF`, Border `#93C5FD`
- Typography:
  - Font Family: "Plus Jakarta Sans", sans-serif (clean geometric sans-serif with high readability on digital screens).
  - Monospace (Tokens & Key Codes): "JetBrains Mono" or "Fira Code", monospace.
  - Scale: H1 (28px Bold), H2 (22px SemiBold), H3 (18px SemiBold), Body (14px Regular), Caption (12px Medium), Micro (11px Tracking-wide).
- Iconography: Lucide Icons or Heroicons (20px/24px outline stroke 1.75px).
- Corner Radius: 12px for Cards & Modals, 8px for Buttons & Form Inputs, 9999px (full-pill) for Status Badges.
- Shadow & Elevation:
  - Card Resting: `0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03)`
  - Card Hover Elevation: `0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)`
  - Modal / Popover: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
- Spacing: 8px modular grid (padding: 16px, 24px, 32px; gap: 16px, 24px).

## Application Overview
The application consists of 4 core modules across 13 distinct interactive screens:
1. Public & SaaS Authentication: Login with Google Workspace and server-side License Token activation.
2. Teacher Exam Operations: Dashboard overview, exam configuration wizard, Excel answer key import with inline anomaly fixer, camera scanner, and split-screen review queue.
3. Psychometrics & Reporting Hub: Student score table, difficulty index charts, distractor analysis, and export center (Excel, PDF, Drive).
4. Super Admin SaaS Center: Token generator engine, multi-account license manager, and white-label branding customizer.

---

## Detailed High-Fidelity Screen Specifications

### 1. Screen W-01: Authentication & SaaS License Token Activation Portal
- General Layout: Minimalist split or centered glassmorphism card on an off-white `#F8FAFC` background with a subtle ambient blue gradient mesh at the top corners.
- Brand Header: Prominent SmartCorrect icon (Dark navy hexagon badge enclosing a stylized blue checklist `#2563EB` with an orange spark `#F97316`), display title "SmartCorrect", subtitle "SaaS AI-Powered Grading Platform".
- Tab Navigation Pill: Elegant segmented control: [Login Account] (Active white card) vs [Activate License Token] (Muted gray text).
- Google OAuth Button: Full-width button with crisp white surface, border `#E2E8F0`, Google 'G' multicolored logo, bold text "Continue with Google Workspace".
- Activation Form Box (when Token tab selected):
  - Form Fields: Floating label inputs for Full Name, WhatsApp Number, and Token Input.
  - License Token Field: Styled in monospace font (`JetBrains Mono`), uppercase letters with a glowing blue border focus ring `#2563EB` and key icon `[key]`.
  - Action Button: Vibrant primary gradient button (from `#2563EB` to `#1D4ED8`) with white bold text "ACTIVATE MY LICENSE & ENTER", accompanied by a subtle orange arrow hover animation.
  - Micro-copy footer: "🔒 Secured with Google Apps Script Server-Side Validation. Need a token? Contact your Administrator."

### 2. Screen W-02: Teacher Dashboard (Mission Control)
- General Layout: Fixed 240px Dark Navy Sidebar (`#0F172A`), sleek 64px Top Header with breadcrumbs, and main canvas featuring a responsive 12-column card grid.
- Top Header:
  - Left: Breadcrumb "Workspace / Dashboard".
  - Right: License Status Pill (`#DBEAFE` background, `#1E40AF` text, pulsing emerald green dot, label "🟢 License: 45 Days Remaining"), Theme toggle (Sun/Moon), Teacher Avatar with dropdown.
- Left Sidebar Navigation:
  - Top: SmartCorrect white logo with orange accent.
  - Menu Items: Dashboard (Active: `#1E293B` background with `#2563EB` 3px accent line on left border), Exams, Answer Keys, Live Scanner, Review Queue (with orange circular badge "4"), Psychometrics, Export Reports.
  - Bottom Sidebar: Teacher Profile snippet & Logout link in gentle rose hover.
- Main Dashboard Content:
  - Hero Action Banner: Compact card with gradient border, greeting "Hello, Teacher Budi! Ready to evaluate today's exam?", and prominent orange button `[+ Create New Exam Session]` (`#F97316`).
  - 4 Key KPI Metrics Cards (4-column grid):
    - Card 1: "Total Graded Papers" -> "1,248" (Bold 28px navy text) with tiny green trend chip "+18% this month".
    - Card 2: "Class Average Score" -> "78.4 / 100" with a smooth mini radial gauge bar in Smart Blue.
    - Card 3: "Needs Verification" -> "4 Sheets" highlighted in warm amber `#FEF3C7` with a direct action link "[Verify Now →]".
    - Card 4: "Active Exam Packages" -> "6 Exams" with subject breakdown tags.
  - Recent Exams Data Table:
    - Clean white card with table headers in uppercase 11px slate gray.
    - Rows with subtle alternating hover background `#F8FAFC`.
    - Columns: Exam Title, Subject pill, Classes, Question Count (e.g. "40 Qs"), Status badge (Green "Completed" or Amber "Needs Review"), and quick Action button `[Grade More]`.

### 3. Screen W-03: Exam Creation & Configuration Wizard
- Layout: Centered 880px wide card with 3-step progress stepper at the top.
- Stepper Component:
  - Step 1: "Basic Details" (Completed: Solid Blue circle with white checkmark).
  - Step 2: "Question & Scoring Rules" (Active: Solid Blue circle with pulsing halo).
  - Step 3: "Answer Key Setup" (Pending: Muted gray circle with number 3).
- Form Controls & Layout:
  - Two-column input grid: "Exam Title" (full width), "Subject" (searchable select with "+ New Subject" quick modal), "Target Class" (multi-select tag pills).
  - Question Options Switcher: Segmented cards for "A – D (4 Options)" vs "A – E (5 Options)" with preview letters.
  - Total Questions Dynamic Counter: Large input with stepper buttons `[-]` `40` `[+]` allowing any dynamic number from 5 to 120 questions.
  - Scoring System Toggle Cards:
    - Card 1 (Equal Weight): "All questions carry identical weight (Calculated automatically to base 100)".
    - Card 2 (Custom Weight): "Specify unique point weights per question (for complex evaluations)".
- Sticky Bottom Action Bar:
  - White floating dock with "Save Draft" (outlined) and "Continue to Answer Key →" (solid primary blue).

### 4. Screen W-04: Answer Key Import & Live Anomaly Checker
- Layout: Two-panel workflow with top quick-action header.
- Top Action Bar:
  - Title: "Answer Key: Penilaian Akhir Semester - Matematika X".
  - Quick Download: Outlined button with Excel icon `[Download .xlsx Template]`.
  - Mode Switch: Toggle between "📁 Import from Excel/CSV" and "✏️ Manual Keyboard Entry".
- Panel 1: Drag & Drop Dropzone:
  - Dashed border card with accent hover state (`#2563EB`), green spreadsheet icon, bold text "Drag & drop your answer key Excel (.xlsx) or CSV here", subtext "Supports columns: No, Kunci, Bobot (optional)".
- Panel 2: Live Validation & Interactive Data Grid:
  - Real-time Warning Banner (Amber Alert): "[icon: alert-triangle] 1 Anomaly Found: Question #14 contains invalid character 'G'. Click to edit before locking."
  - High-Fidelity Data Grid:
    - Header: `# No`, `Answer Key (Kunci)`, `Point Weight`, `Validation Status`.
    - Row Items: Clean inputs where key letters are selectable pills (A, B, C, D). Question #14 is highlighted with soft red background `#FEE2E2` and red border.
    - Inline Fix: Clicking the cell opens a swift popover to select A/B/C/D.
  - Snapshot Security Badge: Blue info banner at bottom "🔒 Immutable Snapshot: Once confirmed, this key is locked for this specific exam session so future revisions won't alter past grading history."
  - Action Buttons: `[Discard]` vs `[Confirm & Lock Key Snapshot]` (Solid Smart Blue).

### 5. Screen W-05: Answer Sheet Scanner & Batch Upload Center
- Layout: Multi-tab upload workspace with real-time processing feedback.
- Tab Controls:
  - Tab 1: "📱 Live Phone Camera Stream" (Opens device camera view).
  - Tab 2: "📂 Batch Photo Upload" (Upload 10-50 sheets simultaneously).
- Batch Upload Zone:
  - Large drag-and-drop box with camera & gallery icons.
  - Dynamic Progress Bar: High-contrast blue progress indicator showing "Processing 18 of 32 papers (56%) — Processing in chunks to protect Google Apps Script execution quota".
- Real-time Thumbnail Grid:
  - Card 1: Crisp photo thumbnail, label "Siswa_01_Ahmad.jpg", green pill badge "✓ Graded: 85/100".
  - Card 2: Photo thumbnail, label "Siswa_02_Bella.jpg", amber pill badge "⚠️ Needs Review (Confidence 68%)".
  - Card 3: Photo thumbnail with pulsating skeleton shimmer, label "Siswa_03_Cici.jpg", blue pill "Processing OCR...".
- Bottom Floating Bar:
  - Summary: "32 Sheets Processed • 31 Verified • 1 Pending Review".
  - Button: `[Open Verification Queue (1 Sheet)]` (Solid Orange button `#F97316`).

### 6. Screen W-06: Verification Queue (Split-Screen Review Experience)
- Layout: 55% Left Inspection Viewport vs 45% Right Decision Panel.
- Left Panel (High-Resolution Visual Inspector):
  - Dark-tinted canvas `#0F172A` providing optimal contrast for student paper photo.
  - High-res cropped view of student's actual handwritten answer.
  - Glowing red bounding box framing Question #17 where student wrote a faint letter between B and D.
  - Floating toolbar on top: Zoom In (+), Zoom Out (-), Rotate 90°, Toggle Invert Contrast, Reset View.
- Right Panel (Human-in-the-Loop Decision Panel):
  - Card Header: Student Name "Ahmad Fauzi (NISN: 0081928312)", Class "X-MIPA-1".
  - Question Badge: "Question #17 • Key: C • Weight: 2.5 pts".
  - AI Detection Confidence Card:
    - Predicted: Letter "B" (Confidence Score: 62% - flagged below 80% threshold).
    - Note: "Pencil stroke ambiguous with potential erasure smudge."
  - Large Interactive Override Buttons:
    - 4 Big Square Selection Buttons: `[ A ]` `[ B ]` `[ C ]` `[ D ]` `[ Blank/Empty ]`.
    - Clicking updates the score preview in real-time.
  - Action Controls:
    - Outlined button: `[Mark Incorrect / Salah]`
    - Primary solid button: `[Confirm Verified Answer & Recalculate]` (`#2563EB`)
    - Subtext link: "Skip to next paper →"

### 7. Screen W-07: Exam Results & Master Score Table
- Layout: Full-width data table card with advanced filter toolbar.
- Quick Statistical Highlights (Top Ribbon):
  - 4 Mini Cards: Highest Score (97.5 - Gold icon), Lowest Score (45.0), Class Average (78.2 - Blue icon), Passing Rate (88.8% - Green icon).
- Filter & Search Bar:
  - Search Input: Pill input with search icon "Search student name or NISN...".
  - Dropdowns: Filter by Class, Filter by Status (Verified / Needs Review), Sort by (Score: High to Low).
  - Quick action: `[Select Columns]` and `[Direct Print]`.
- Master Data Table:
  - Clean headers: `Rank`, `NISN`, `Student Name`, `Class`, `Correct (B)`, `Incorrect (S)`, `Blank (K)`, `Final Score`, `Status`, `Actions`.
  - Final Score Column: Bold 16px text with colored indicator badge (Green for score $\ge 75$, Red for score $< 75$).
  - Status Pills: Green "Verified" or Amber "Needs Review".
  - Action Dropdown: `[View Paper]`, `[Edit Score]`, `[Re-Scan]`.

### 8. Screen W-08: Psychometric Item Analysis & Diagnostics Dashboard
- Layout: Analytic dashboard with 3 visual diagnostic sections.
- Section 1: Question Performance Highlights:
  - 3 Callout Cards:
    - Red Border Card: "🔥 Top 3 Hardest Questions" (Q#14 [32% correct], Q#28 [38%], Q#37 [41%]).
    - Green Border Card: "⭐ Top 3 Easiest Questions" (Q#1 [98% correct], Q#5 [95%], Q#12 [92%]).
    - Slate Border Card: "❓ Most Blank / Skipped" (Q#40 [22% unanswered]).
- Section 2: Difficulty Level Distribution Chart:
  - Clean horizontal segmented bar chart:
    - Easy ($P > 0.70$): 30% (Emerald Green `#10B981`)
    - Medium ($0.30 \le P \le 0.70$): 55% (Smart Blue `#2563EB`)
    - Hard ($P < 0.30$): 15% (Rose Red `#F43F5E`)
- Section 3: Distractor (Pengecoh) Efficiency Matrix Table:
  - Detailed table showing each question's option distribution:
    - Columns: `Q#`, `Correct Key`, `A%`, `B%`, `C%`, `D%`, `Blank%`, `Difficulty (P)`, `Distractor Quality`.
    - Correct key percentage highlighted in soft blue fill.
    - Non-functioning distractors ($< 5\%$ selection) flagged with a subtle amber badge "Pengecoh Kurang Efektif".

### 9. Screen W-09: Export & Official Reporting Hub
- Layout: 3 Prominent Card Exporters + Interactive Print Document Previewer.
- 3 Large Export Action Cards:
  - Card 1 (Excel .xlsx Multi-Sheet Package):
    - Excel emerald green branding, title "Comprehensive Excel (.xlsx)", description "Includes Sheet 1: Rekap Nilai, Sheet 2: Detail Jawaban, Sheet 3: Analisis Butir Soal, Sheet 4: Log Verifikasi".
    - Button: `[Download Excel Package (.xlsx)]` (Solid dark emerald `#059669`).
  - Card 2 (Official Printable PDF Report):
    - Red PDF branding, title "Official School PDF Report", description "Formatted for formal school administration with official letterhead, summary charts, and signature space."
    - Button: `[Preview & Print PDF]` (Solid Smart Blue `#2563EB`).
  - Card 3 (Direct Google Sheets Sync):
    - Google Sheets green/blue branding, title "Save to Google Drive", description "Creates a live spreadsheet copy directly inside your Google Drive folder."
    - Button: `[Save to Google Sheets]` (Outlined button).
- Bottom Live Print Preview Container:
  - Clean A4 canvas simulation with school header, date, organized student list, grade distribution chart, and QR Verification stamp.

### 10. Screen W-10: Super Admin SaaS License & Token Management
- Layout: Two-column configuration panel (Token Generator on Left, Active Tokens Table on Right).
- Left Panel: Token Generator Box:
  - Mode Switch: "Automatic Random Unique Token" vs "Manual Custom Token Input".
  - Code Prefix input: `[PROMO-GURU-2026]` or Auto-generate button `[🎲 Generate Code]`.
  - Duration Selector: Radio pills `[1 Month]` `[3 Months]` `[6 Months]` `[1 Year]` `[Custom Days]`.
  - Max Claims Input: Number input (default `1`, or `10+` for school-wide license).
  - Admin Notes: Customer / School Name input.
  - Action Button: Solid Dark Navy button `[+ Create & Activate Token]`.
- Right Panel: Master Token Registry Table:
  - Search bar & filter pills: [All] [Active] [Exhausted] [Expired] [Revoked].
  - Monospace Token Code column with one-click copy button `[Copy]`.
  - Columns: Token Code, License Duration, Usage (e.g. `1/1` or `4/10`), Claimed User Email, Expiry Date, Status pill, and Action buttons `[Extend]` `[Revoke]`.

### 11. Screen W-11: Super Admin System Settings & White-Labeling
- Layout: 2-column settings card with instant live preview.
- Section 1: White-Labeling & Branding:
  - Fields for Application Name (e.g. "SmartCorrect"), Logo Upload, Browser Favicon Upload.
  - Brand Primary Color Picker with live preview of primary buttons and badges.
- Section 2: AI Vision & Security Thresholds:
  - Slider: "OCR Confidence Score Threshold" (Default `80%` — items below this trigger the Review Queue).
  - Toggles: "Enable Bubble Sheet Mode as Backup", "Require License Token on Registration".
- Section 3: Google Apps Script Health & Quotas:
  - Visual gauge indicators: Apps Script Execution Average Time (Safe: 2.1s), Daily Email Quota remaining (85/100), Google Drive Storage Used.

### 12. Screen W-12: Mobile View — Smartphone Camera Scanner Interface
- Layout: 375px mobile viewport, full-screen dark camera viewfinder with thumb zone controls.
- Top Bar: Transparent header with Back arrow, Flash toggle icon (Auto/On/Off), and Camera flip icon.
- Central Viewfinder Overlay:
  - 4 Bright White Corner Alignment Brackets framing the student's paper sheet.
  - Guidance HUD Text: "Posisikan lembar jawaban di dalam bingkai. Pastikan pencahayaan terang."
  - Real-time subtle green box showing autofocus locked.
- Bottom Thumb Controls:
  - Left: Mini thumbnail of the last scanned paper.
  - Center: Large 72px Circular Shutter Button (White ring with solid Smart Blue center dot `[ ● ]`).
  - Right: Gallery icon to pick from camera roll.
- Slide-up Notification Card (appears immediately after capture):
  - Compact white card sliding from bottom: "✓ Ahmad Fauzi — Nilai: 85/100 (34 Benar)".
  - Two buttons: `[Scan Siswa Berikutnya]` (Solid Blue) and `[Lihat Detail]` (Outline).

### 13. Screen W-13: Mobile View — Teacher Mobile Dashboard
- Layout: 375px mobile viewport with sticky bottom navigation.
- Top Header: Clean white bar with SmartCorrect logo, teacher greeting "Halo, Pak Budi!", and license pill "🟢 45 hari".
- Horizontal KPI Carousel:
  - Swipeable cards: Card 1 (Terkoreksi Hari Ini: 28), Card 2 (Rata-rata Kelas: 78.4), Card 3 (Perlu Verifikasi: 4).
- Active Exam List:
  - Card: "PAS Ganjil Matematika X" with progress bar 36/36, button `[Lihat Hasil]`.
  - Card: "Kuis Harian Fisika" with progress bar 12/30, button `[Lanjut Pindai]`.
- Floating Action Button (FAB): Large 56px circular button with camera icon `#F97316` fixed at bottom-right.
- Bottom Nav Bar (4 tabs):
  - `[Home]` (Active blue) | `[Ujian]` | `[Verifikasi (4)]` | `[Profil/Lisensi]`.

---

## Global Design Requirements
- Fully responsive design: Desktop primary (1280px-1440px), adaptive to iPad/Tablet (768px-1024px), and mobile-first experience for scanner (375px-414px).
- Skeleton loading states for all data tables, cards, and image previewers.
- Toast notifications system: Success (emerald green), Error (rose red), Info (smart blue), Warning (amber orange).
- Empty states: Minimalist illustration with a friendly message and a prominent CTA button.
- Focus & Accessibility: High contrast ratios compliant with WCAG AA, visible focus rings on interactive elements.
- The overall feel: Sleek, trustworthy, lightning-fast EdTech software that feels like an indispensable everyday companion for educators.
