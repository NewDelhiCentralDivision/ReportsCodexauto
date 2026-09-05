---
version: alpha
name: "New Delhi Central Division — Daily Performance Report"
description: "A restrained, data-first daily report that prioritizes official figures, comparison, and auditability."
colors:
  navy: "#13243d"
  red: "#c83e3e"
  text: "#1e2938"
  muted: "#5d6875"
  page: "#f6f7f9"
  surface: "#ffffff"
  line: "#d9dee5"
typography:
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
  data:
    fontFamily: "'SFMono-Regular', Consolas, monospace"
rounded:
  DEFAULT: "0rem"
spacing:
  page: "4rem"
  section: "2.5rem"
  compact: "0.625rem"
components:
  page: { backgroundColor: "{colors.page}", textColor: "{colors.text}", padding: "{spacing.page}", rounded: "{rounded.DEFAULT}" }
  report-section: { backgroundColor: "{colors.surface}", textColor: "{colors.text}", padding: "{spacing.section}", rounded: "{rounded.DEFAULT}" }
  data-table: { backgroundColor: "{colors.surface}", textColor: "{colors.text}", padding: "{spacing.compact}", rounded: "{rounded.DEFAULT}" }
  sort-button: { backgroundColor: "{colors.navy}", textColor: "{colors.surface}", padding: "{spacing.compact}", rounded: "{rounded.DEFAULT}" }
  total-row: { backgroundColor: "{colors.navy}", textColor: "{colors.surface}", padding: "{spacing.compact}", rounded: "{rounded.DEFAULT}" }
---

# Daily Performance Report Design System

## Creative North Star

This is an official operational ledger, not a marketing dashboard. It presents the daily position in four clear sections: division totals, product reconciliation, Head Office comparison, and the full office directory. A thin postal-red section rule is the only expressive brand cue; typography, alignment, and whitespace do the rest of the hierarchy work.

## Product Context

- **Audience and job:** New Delhi Central Division staff reviewing booking and payment performance each day.
- **Register:** Formal, precise, and data-focused.
- **Locale:** English interface, INR, and Indian numeric formatting.
- **Data contract:** The report consumes the existing CSV and mapping paths. Uploaded D1-backed data has priority through the existing Worker; static CSVs remain the fallback.
- **Responsive strategy:** At narrower widths, KPI measures stack and data tables retain full columns through an intentional horizontal scroll container.

## Tokens and Runtime Mapping

`public/styles.css` owns the runtime tokens. Navy is used for table headers and total rows, postal red for section rules, neutral paper for the canvas, white for report surfaces, and a fine grey line for structure. Inter is used for labels and headings; a system monospace stack is used only for quantitative values. Corners and shadows are deliberately minimal to avoid a card-dashboard aesthetic.

## Component Behaviour

The four KPI measures are static reading surfaces, not navigation. Tables use semantic headings, scope attributes, right-aligned numbers, and the same INR formatter throughout. Office-column headers are native buttons with keyboard focus and `aria-sort`; they change only the client-side sort order. A concise live-status line exposes the active office ordering. Motion is disabled; the report should feel stable when figures are being checked.

## Guardrails

- Do not add hero art, welcome copy, decorative widgets, modal dialogs, or promotional calls to action.
- Do not alter the Worker, upload page, D1 bindings, CSV paths, or report calculations without an explicit data requirement.
- Treat blank payment cells as zero.
- Digital totals include only DQR Scan, SBIPOS Card, SBIPOS BharatQR, SBIEPAY BharatQR, SBIEPAY UPI, and SBIEPAY Debit Card.
