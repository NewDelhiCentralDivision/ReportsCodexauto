---
version: alpha
name: "New Delhi Central Division — Daily Performance Dashboard"
description: "A light, executive analytics dashboard for daily postal booking and payment performance."
colors:
  primary: "#2f6fed"
  ink: "#14213a"
  navy: "#173b75"
  blue: "#2f6fed"
  teal: "#18a887"
  amber: "#e89a24"
  red: "#cb3e48"
  canvas: "#f4f6f9"
  surface: "#ffffff"
  line: "#e6ebf3"
typography:
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
  data:
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace"
rounded:
  DEFAULT: "1.125rem"
  control: "0.6875rem"
spacing:
  page: "3.375rem"
  card: "1.375rem"
  compact: "0.625rem"
components:
  dashboard-surface: { backgroundColor: "{colors.canvas}", textColor: "{colors.ink}", padding: "{spacing.page}", rounded: "{rounded.DEFAULT}" }
  analytics-card: { backgroundColor: "{colors.surface}", textColor: "{colors.ink}", padding: "{spacing.card}", rounded: "{rounded.DEFAULT}" }
  table-header: { backgroundColor: "#f9fbfd", textColor: "#58677f", padding: "{spacing.compact}", rounded: "{rounded.DEFAULT}" }
  primary-data: { backgroundColor: "{colors.blue}", textColor: "{colors.surface}", padding: "{spacing.compact}", rounded: "{rounded.control}" }
  success-data: { backgroundColor: "{colors.teal}", textColor: "{colors.ink}", padding: "{spacing.compact}", rounded: "{rounded.control}" }
  navigation: { backgroundColor: "{colors.navy}", textColor: "{colors.surface}", padding: "{spacing.compact}", rounded: "{rounded.control}" }
  participation-data: { backgroundColor: "{colors.amber}", textColor: "{colors.ink}", padding: "{spacing.compact}", rounded: "{rounded.control}" }
  error-alert: { backgroundColor: "{colors.red}", textColor: "{colors.surface}", padding: "{spacing.compact}", rounded: "{rounded.control}" }
  table-divider: { backgroundColor: "{colors.line}", textColor: "{colors.ink}", padding: "{spacing.compact}", rounded: "{rounded.DEFAULT}" }
---

# Daily Performance Dashboard Design System

## Overview

The report is an executive analytics surface for New Delhi Central Division staff who need to read a day’s booking and payment position quickly, then inspect the full office directory. Its signature is a compact collection-analysis canvas: service-revenue bars, a real digital-payment radial, and Head Office contribution bars sit beneath the operational KPIs. It takes inspiration from a light, rounded dashboard language without imitating a specific product or inventing trends.

## Colors

The canvas uses cool grey and quiet white surfaces. Navy anchors identity and headings; blue is the primary analytical series; teal identifies digital payment performance; amber signals office participation; red is reserved for real errors. The runtime token owner is `public/styles.css`; this document mirrors those CSS custom properties rather than generating them.

## Typography

Inter/system sans provides compact operational labels and clear headings. The data stack is used for currency, counts, percentages, and ranking so numeric columns keep a stable rhythm. Indian INR formatting is a data contract, not decorative copy.

## Layout

The desktop grid begins with four KPIs, followed by a two-column analysis area. Product and office views use full-width table cards; Head Offices use three parallel comparison cards. At narrower widths, cards stack while tables retain their complete columns in visible horizontal scroll containers. The sticky header remains below the application header.

## Elevation & Depth

White cards have a fine border and low blue-grey shadow. Hover elevation is limited to interactive reading surfaces and does not move the layout. No gradients are used as page decoration; small chart fills use the analytical blue scale only.

## Shapes

Card corners are softly rounded at 18px, controls at 11px, and metric bars fully rounded. This is a dashboard-specific contrast to the prior ledger layout. Spacing is deliberately generous between sections but compact within data rows.

## Components

KPI cards expose a real count, a grounding label, and a miniature distribution line based on current product or Head Office data—not fabricated history. Charts have focusable data rows and tooltips with exact values. Product bars represent revenue share; the radial represents only the documented digital payment fields against cash; Head Office cards show the same revenue, article, and digital-share measures.

The office directory owns client-side search, Head Office filtering, sort, and pagination. State is represented in the URL so the current directory view is shareable. Sort headers are native buttons with `aria-sort`; search has a real clear action. Native selects are intentional: the product accepts platform-owned selection popups for simple local filtering.

Motion communicates load order and changing values only: count-up, chart fills, progressive card reveal, and short hover feedback. `prefers-reduced-motion` makes the report immediately static.

## Do's and Don'ts

- Do represent only values derived from the loaded booking, payment, EMO, and office-map files.
- Do preserve the Worker, upload form, D1 binding, report paths, and specified digital-transaction formula.
- Do use progress and distribution for composition, not to imply an unavailable prior-period change.
- Don't add generic hero art, fictitious “increase/decrease” labels, decorative gradients, or fake trend data.
- Don't hide table columns on small screens; retain them through horizontal access.
