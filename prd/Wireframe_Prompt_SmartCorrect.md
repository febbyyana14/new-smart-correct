# Wireframe Prompt for SmartCorrect AI Exam Grading & SaaS Platform

Create detailed wireframes for SmartCorrect.
Use grayscale/black-and-white wireframe style only — no colors, no images, just layout structure, placeholder boxes, labels, and navigation flow.

## Application Context
SmartCorrect is an AI-powered automated exam evaluation and psychometric item analysis web application built on Google Apps Script and Google Sheets. It allows educators to grade handwritten multiple-choice sheets (A/B/C/D on regular paper) and OMR bubble sheets via mobile camera or batch upload, features confidence-score verification queues, Excel/CSV answer key import, comprehensive reporting, and a server-side SaaS token activation system.
Has 4 main sections: Authentication & License Activation, Teacher Workspace & Exam Suite, Psychometrics & Reporting Hub, and Super Admin SaaS Panel.

## Wireframe Pages Required

--- PAGE W-01: AUTHENTICATION & LICENSE TOKEN ACTIVATION ---
Layout: Centered modal card layout on clean background.
- Top Header: [icon: school-grad-cap] SmartCorrect Brand Logo placeholder box with X, subtitle "AI Exam Grading Platform".
- Tab Switcher: [Login with Google Account] | [Activate License Token].
- Form Section (Login State):
  - Google OAuth One-Click button: [G] "Continue with Google Workspace".
  - Divider: "OR ENTER ACTIVATION CREDENTIALS".
- Form Section (License Token Activation State):
  - Field: "Full Name" [input: John Doe, M.Pd]
  - Field: "WhatsApp Number" [input: 0812xxxxxxxx]
  - Field: "License Activation Token" [input: SC-XXXX-XXXX-XXXX] (Monospace styled input box with [icon: key])
  - Help text: "Don't have a token? Contact your School Admin or Purchase License."
  - Action Button: [ACTIVATE & ENTER WORKSPACE] (Primary solid dark button).
  - Footer link: "Terms of Service • Privacy Policy • Help Center".

--- PAGE W-02: TEACHER DASHBOARD (MAIN OVERVIEW) ---
Layout: Left sticky sidebar (collapsible) + Top navigation bar + Main content grid.
- Top Navigation Bar: Breadcrumbs "Dashboard > Overview", Right: License Status Pill "[icon: check-circle] License Active: 45 Days Remaining", Dark/Light Mode toggle, User Avatar profile dropdown.
- Left Sidebar Navigation:
  - App Logo & School Name Placeholder
  - Nav Item: [icon: grid] Dashboard (Active)
  - Nav Item: [icon: book-open] My Exams & Classes
  - Nav Item: [icon: key] Answer Keys & Import
  - Nav Item: [icon: camera] Scan & Grade Sheets [Badge: New]
  - Nav Item: [icon: alert-circle] Verification Queue [Badge: 4 Pending]
  - Nav Item: [icon: bar-chart-2] Psychometrics & Analytics
  - Nav Item: [icon: download] Export Reports
  - Nav Item: [icon: settings] Profile & License
- Main Content Area:
  - Top Action Header: Greeting "Welcome back, Teacher Budi", Quick Action Button [+ CREATE NEW EXAM SESSION].
  - Row 1 (KPI Stat Cards):
    - Card 1: "Total Graded Sheets" -> Number "1,248" with sparkline indicator.
    - Card 2: "Average Class Score" -> Number "78.4 / 100".
    - Card 3: "Needs Verification" -> Number "4 Sheets" with [Review Now] button.
    - Card 4: "Active Exam Packages" -> Number "6 Exams".
  - Row 2 (Recent Exam Sessions Table):
    - Table columns: [Exam Title], [Subject & Class], [Question Count], [Date], [Status Pill: Completed / In Review], [Action: View Details / Grade More].
  - Row 3 (Quick Help & Mobile Scanner Promo Card):
    - Box with X placeholder: "Scan with Phone Camera: Open SmartCorrect on mobile browser for real-time live grading".

--- PAGE W-03: EXAM CREATION & CONFIGURATION WIZARD ---
Layout: Sidebar + Top bar + Stepper Form Layout.
- Stepper Indicator: [1. Basic Info] -> [2. Scoring & Question Rules] -> [3. Answer Key Setup].
- Form Section:
  - Input: "Exam Title" [input: Penilaian Akhir Semester Ganjil 2026]
  - Dropdown: "Subject" [Select: Matematika Wajib - Kelas X] with [+ Add New Subject] link.
  - Dropdown: "Target Class / Section" [Select: X-MIPA-1, X-MIPA-2] (Multi-select pills).
  - Radio Group: "Answer Options Format" -> ( ) A - D (4 Options)  ( ) A - E (5 Options).
  - Number Input: "Total Number of Questions" [input: 40] (Dynamic counter with [+] and [-] stepper).
  - Radio Group: "Scoring Weight System":
    - Option A: "Equal Weight" (All questions have the same score value, auto-calculated to 100).
    - Option B: "Custom Weight per Question" (Specify custom point weight for each question).
- Sticky Bottom Action Bar: [Save as Draft] (Outline) --- [Next: Configure Answer Key →] (Solid dark).

--- PAGE W-04: ANSWER KEY IMPORT & INTERACTIVE PREVIEW ---
Layout: Sidebar + Top bar + Two-panel data setup.
- Header: Title "Setup Answer Key: Matematika X-MIPA", Subtitle "Input manually or import from file to save time".
- Top Bar Actions:
  - Button: [icon: download] "Download Excel Template (.xlsx)"
  - Button: [icon: upload] "Upload Excel / CSV Key"
  - Button: [icon: edit-3] "Manual Key Entry Mode"
- Panel 1: Drag-and-Drop File Upload Dropzone:
  - Dashed outline box with [icon: file-spreadsheet], text "Drag & drop your .xlsx or .csv answer key here, or Browse Files".
  - Supported format note: "Excel (.xlsx), CSV, Word (.docx). Minimal columns: No, Kunci, Bobot (optional)".
- Panel 2: Interactive Validation & Live Preview Table:
  - Alert Banner (Validation Status): "[icon: alert-triangle] 1 Warning Detected: Question #14 has invalid option 'G'. Please correct below before saving."
  - Data Table (Editable Grid):
    - Col 1: [No Soal] (1, 2, 3...)
    - Col 2: [Kunci Jawaban] (Dropdown / inline text: A, B, C, D - highlighted red if error)
    - Col 3: [Bobot Poin] (Editable number input: 2.5)
    - Col 4: [Status Pill: Valid / Incomplete / Duplicate]
  - Snapshot Security Notice: "🔒 Note: Once grading begins, this answer key will be snapshot-locked to preserve historical grade integrity."
- Bottom Action Buttons: [Discard] (Outline) --- [Confirm & Lock Answer Key] (Solid dark).

--- PAGE W-05: ANSWER SHEET SCANNER & BATCH UPLOAD ---
Layout: Sidebar + Top bar + Mobile/Desktop dual upload interface.
- Header: Title "Grade Exam: PAS Ganjil Matematika", Info pills: [40 Questions] [Key Snapshot #1-Active].
- Section 1: Upload Method Selector Tabs:
  - Tab 1: [icon: camera] "Live Smartphone Camera Capture" (Direct camera stream access).
  - Tab 2: [icon: upload-cloud] "Batch File Upload" (Upload 10-50 photos from gallery or scanner).
- Section 2: Upload Zone & Preview Grid:
  - Upload Box: "Select student answer sheet images (JPG, PNG, HEIC up to 40 sheets per batch)".
  - Live Queue Progress Bar: "Processing 18 of 32 sheets (56%) — Estimated time: 25 seconds".
  - Thumbnail Grid of Uploaded Sheets:
    - Card: Image thumbnail with X, label "Siswa_01_Ahmad.jpg", Status: "[icon: check] 100% Graded (Score: 85)".
    - Card: Image thumbnail with X, label "Siswa_02_Bella.jpg", Status: "[icon: alert-circle] Needs Review (Confidence 68%)".
    - Card: Image thumbnail with X, label "Siswa_03_Cici.jpg", Status: "[icon: loader] Processing OCR...".
- Bottom Navigation: [View Graded Results] --- [Open Verification Queue (1 Sheet)] (Solid dark).

--- PAGE W-06: VERIFICATION QUEUE (SPLIT-SCREEN REVIEW) ---
Layout: 55% Left Inspection Panel / 45% Right Decision Panel.
- Top Header: Breadcrumbs "Exams > PAS Matematika > Verification Queue", Status "Reviewing Item 1 of 4".
- Left Panel (55% Width - High-Resolution Image Crop Inspector):
  - Interactive Zoom & Pan Viewport showing student's actual handwritten paper.
  - Red Bounding Box highlighting Question #17 where handwriting is faint or crossed out.
  - Zoom controls: [Zoom In (+)] [Zoom Out (-)] [Rotate 90°] [Original View].
- Right Panel (45% Width - Metadata & Verification Form):
  - Student Info Card: "Ahmad Fauzi (NISN: 0081928312) - Kelas X-MIPA-1".
  - Question Number: "Question #17".
  - Correct Answer Key: "Answer Key: C (Weight: 2.5)".
  - AI Detection Output:
    - Predicted Character: "B (Confidence: 62% - Low Confidence)"
    - Alternative Guess: "D (Confidence: 31%)"
    - Reason: "Slight smudge or overlapping pencil stroke detected."
  - Manual Override Radio Buttons:
    - ( ) A   ( ) B   ( ) C   ( ) D   ( ) Blank / Not Answered
  - Action Buttons:
    - [Mark as Incorrect (Wrong)] (Outline red/dark)
    - [Confirm Choice & Recalculate Score] (Solid dark primary)
    - Button link: "Skip to Next Item →"

--- PAGE W-07: EXAM RESULTS & COMPREHENSIVE SCORE TABLE ---
Layout: Sidebar + Top bar + Filter Bar + Data Table.
- Top Header: Title "Exam Results: PAS Ganjil Matematika", Subtitle "Total Participants: 36 Students".
- Summary Metrics Row:
  - Pill: "Highest Score: 97.5" | "Lowest Score: 45.0" | "Class Average: 78.2" | "Passing Rate: 88.8%".
- Filter & Search Bar:
  - Search Input: [icon: search] "Search by student name or NISN..."
  - Dropdown Filter: "Class: All Classes / X-MIPA-1 / X-MIPA-2"
  - Dropdown Filter: "Status: All / Verified / Needs Review"
  - Sort Dropdown: "Sort by: Highest Score / Student Name / Submission Time"
- Master Data Table:
  - Columns:
    - [Checkbox]
    - [Rank #]
    - [NISN]
    - [Student Name]
    - [Class]
    - [Correct (B)]
    - [Incorrect (S)]
    - [Blank (K)]
    - [Final Score (Nilai)] (Bold text)
    - [Status Badge: Verified / Needs Review]
    - [Actions: View Sheet / Edit / Re-grade]
- Table Footer: Pagination controls "Showing 1-25 of 36 students" [< Prev] [1] [2] [Next >].

--- PAGE W-08: PSYCHOMETRIC ITEM ANALYSIS & DIAGNOSTICS ---
Layout: Sidebar + Top bar + Multi-tab analytical dashboard.
- Sub-Navigation Tabs: [Overview & Difficulty Index] | [Distractor (Pengecoh) Analysis] | [Reliability & Discrimination].
- Section 1: Question Performance Summary:
  - Box 1: "Top 3 Hardest Questions" (Questions #14, #28, #37 - Lowest correct percentage).
  - Box 2: "Top 3 Easiest Questions" (Questions #1, #5, #12 - 95%+ correct).
  - Box 3: "Most Skipped / Blank Questions" (Question #40 - 22% blank).
- Section 2: Difficulty Level Distribution (Chart Frame):
  - Placeholder Chart Frame: Bar Chart [Easy: 12 Questions (30%) | Moderate: 22 Questions (55%) | Hard: 6 Questions (15%)].
- Section 3: Distractor Efficiency Table (Detailed Breakdown per Question):
  - Columns:
    - [Q#]
    - [Correct Key]
    - [Option A %]
    - [Option B %]
    - [Option C %]
    - [Option D %]
    - [Blank %]
    - [Difficulty Index (P)]
    - [Distractor Quality Note: "Effective" / "Ineffective / Needs Revision"]
  - Visual note: Correct key percentage highlighted with solid fill; misleading distractors flagged with warning icon.

--- PAGE W-09: EXPORT & REPORT GENERATION HUB ---
Layout: Sidebar + Top bar + 3-Card Export Center + Live Print Preview.
- Header: Title "Export Exam Reports & Archives", Subtitle "Download ready-to-use documents for school administration".
- Export Options Grid (3 Cards):
  - Card A: "Comprehensive Excel Package (.xlsx)"
    - Description: "Multi-sheet workbook: Summary, Student Details, Psychometric Analysis, and Verification Log."
    - Checkbox options: [x] Include student details  [x] Include item analysis sheet.
    - Button: [icon: file-spreadsheet] [DOWNLOAD EXCEL (.XLSX)] (Solid dark).
  - Card B: "Official Printable PDF Report"
    - Description: "Formatted document with school letterhead, grade recapitulation, statistical summary, and signature line."
    - Button: [icon: file-text] [PREVIEW & PRINT PDF] (Solid dark).
  - Card C: "Export to Google Sheets"
    - Description: "Instantly create a synchronized spreadsheet in your Google Drive."
    - Button: [icon: external-link] [SAVE TO GOOGLE DRIVE] (Outline).
- Bottom Section: Live Printable PDF Preview Window:
  - Scaled paper container with school header placeholder, tabular student grade list, statistical box, and teacher signature area with HMAC QR authenticity badge.

--- PAGE W-10: SUPER ADMIN LICENSE & TOKEN MANAGEMENT ---
Layout: Sidebar + Top bar + Two-panel SaaS management dashboard.
- Header: Title "SaaS License & Token Management (Super Admin)", Subtitle "Generate, activate, track, and revoke user access".
- Top Action Panel: "Token Generator":
  - Radio Group: "Token Generation Method":
    - ( ) Automatic Unique Code Generation (e.g. SC-XXXX-XXXX)
    - ( ) Manual Custom Code Entry
  - Input: "Custom Code / Prefix" [input: PROMO-GURU-2026]
  - Dropdown: "License Duration" [Select: 1 Month (30d) / 3 Months (90d) / 6 Months (180d) / 1 Year (365d) / Custom Days]
  - Number Input: "Maximum Account Usage Limit" [input: 1] (Set >1 for institutional school licenses).
  - Input: "Admin Notes / Customer Name" [input: SMAN 1 Jakarta - Pak Harto]
  - Action Button: [icon: plus-circle] [GENERATE & SAVE TOKEN] (Solid dark).
- Bottom Panel: Active License Tokens Master Table:
  - Search & Filter bar: [Search token code or user email...] [Filter: Active / Exhausted / Expired / Revoked].
  - Columns:
    - [Token Code] (Monospace, e.g. `SC-98F2-A104`)
    - [Type / Duration] (e.g. 1 Year)
    - [Usage (Used / Max)] (e.g. 1 / 1 or 5 / 10)
    - [Claimed By (User Email)]
    - [Expiry Date]
    - [Status Pill: Active (Solid) / Expired (Outline) / Revoked]
    - [Actions: Extend Manually / Revoke Token / Copy Code]

--- PAGE W-11: SUPER ADMIN SYSTEM SETTINGS & WHITE-LABELING ---
Layout: Sidebar + Top bar + Form settings grid.
- Section 1: White-Labeling & Branding:
  - Field: "Platform Display Name" [input: SmartCorrect EdTech]
  - Upload Box: "Application Logo" (Box with X placeholder)
  - Upload Box: "Browser Favicon" (Small box with X placeholder)
  - Color Picker input: "Brand Accent Hex Code" [input: #1E40AF]
- Section 2: Grading Engine & Security Configuration:
  - Slider / Number: "Default OCR Confidence Threshold" [input: 80%] (Readings below this trigger Review Queue).
  - Toggle: "Allow Bubble Sheet Mode as Alternative" [ON]
  - Toggle: "Enforce Strict License Token on User Registration" [ON]
- Section 3: Google Apps Script Health & Quota Monitoring:
  - Metric Card 1: "Execution Time Avg: 2.4s / 360s (Safe)"
  - Metric Card 2: "Daily Email Quota: 85 remaining"
  - Metric Card 3: "Google Drive Storage Usage: 420 MB"
- Bottom Actions: [Reset Defaults] --- [Save Configuration] (Solid dark).

--- PAGE W-12: MOBILE VIEW — SMARTPHONE SCANNER INTERFACE ---
Layout: 375px mobile viewport layout, thumb-friendly navigation.
- Top Mobile App Bar: [icon: arrow-left] "PAS Matematika - Scan" | [icon: flash-off] [icon: camera-switch].
- Camera Viewport Area (Full central height):
  - Live viewfinder overlay with 4 corner guide brackets aligning the answer sheet.
  - Transparent text banner: "Align student paper within guide frame. Ensure good lighting."
  - Real-time auto-focus box indicator in center.
- Bottom Controls Bar (Thumb Zone):
  - Left thumbnail: Last scanned sheet preview thumbnail.
  - Center: Large Circular Shutter Button [● Capture & Grade Sheet].
  - Right: [icon: image] Open phone photo gallery.
- Sliding Bottom Sheet (Appears after capture):
  - Mini card: "Sheet Graded: Ahmad Fauzi — Score: 85/100 (34/40 Correct)".
  - Two buttons: [Scan Next Student] (Solid dark) | [Review Details] (Outline).

--- PAGE W-13: MOBILE VIEW — TEACHER DASHBOARD & VERIFICATION ---
Layout: 375px mobile viewport with sticky bottom navigation bar.
- Top Header: Logo, Greeting "Hi, Budi", License Pill "[icon: check] 45d left".
- Quick Stats Scrollable Carousel:
  - Card 1: "Graded Today: 28" | Card 2: "Avg Score: 78.4" | Card 3: "Needs Review: 4".
- Main List: "Active Exams":
  - Card: "PAS Ganjil Matematika X" -> 36/36 Graded -> [View Results].
  - Card: "Kuis Harian 2 Fisika" -> 12/30 Graded -> [Resume Scanning].
- Floating Action Button (FAB): [icon: camera] Large floating circle at bottom right.
- Sticky Bottom Nav Bar:
  - [icon: home] Home | [icon: book] Exams | [icon: alert-circle] Review (4) | [icon: user] Profile.

## Wireframe Style Notes
- Use only grayscale: white, light gray (#EEEEEE), medium gray (#AAAAAA), dark gray (#333333), black.
- Text placeholders: Use actual representative labels, not "Lorem Ipsum".
- Buttons: Show shape and label clearly — primary buttons filled dark, secondary outlined.
- Images/covers: Show as plain box with X through it (standard wireframe placeholder).
- Charts: Show as empty chart frames with axis labels and chart type label inside.
- Icons: Show as simple labeled squares [icon: name].
- Number badges: Show on nav items where relevant (pending counts, notifications).
- Show mobile breakpoint for the scanner and mobile dashboard as detailed frames (W-12 & W-13).
- Navigation flow arrows between key pages:
  - Page W-01 (Login/Activate) → Page W-02 (Teacher Dashboard)
  - Page W-02 (Dashboard) → Page W-03 (Exam Creation) → Page W-04 (Answer Key Import & Preview)
  - Page W-04 (Key Locked) → Page W-05 (Scanner / Upload) → Page W-06 (Verification Queue)
  - Page W-06 (Reviewed) → Page W-07 (Score Table) → Page W-08 (Psychometrics) → Page W-09 (Export Hub)
  - Page W-10 (Admin Token Generator) → Page W-01 (User Token Redemption)
