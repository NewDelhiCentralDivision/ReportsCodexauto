---
version: alpha
name: "India Post Pulse — New Delhi Central"
description: "A data-led India Post divisional booking dashboard with a postal-route command-deck identity."
colors:
  primary: "#d8343f"
  navy: "#18243a"
  text: "#283044"
  muted: "#686f7c"
  page: "#fbf8f2"
  surface: "#ffffff"
  line: "#ded9cf"
  soft: "#f3eee4"
  success: "#589f89"
  warning: "#ee7653"
  danger: "#a9192d"
typography:
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
  mono:
    fontFamily: "'SFMono-Regular', Consolas, monospace"
rounded:
  DEFAULT: "0rem"
  control: "0.5rem"
spacing:
  page: "3rem"
  panel: "1.45rem"
  compact: "0.625rem"
components:
  navigation: { backgroundColor: "{colors.navy}", textColor: "{colors.surface}", padding: "{spacing.panel}", rounded: "{rounded.control}" }
  button: { backgroundColor: "{colors.primary}", textColor: "{colors.surface}", padding: "{spacing.compact}", rounded: "{rounded.control}" }
  panel: { backgroundColor: "{colors.surface}", textColor: "{colors.text}", padding: "{spacing.panel}", rounded: "{rounded.DEFAULT}" }
  page: { backgroundColor: "{colors.page}", textColor: "{colors.muted}", padding: "{spacing.page}" }
  divider: { backgroundColor: "{colors.line}", textColor: "{colors.text}", rounded: "{rounded.control}" }
  soft-chip: { backgroundColor: "{colors.soft}", textColor: "{colors.text}", padding: "{spacing.compact}", rounded: "{rounded.control}" }
  status-success: { backgroundColor: "{colors.success}", textColor: "{colors.navy}", rounded: "{rounded.control}" }
  status-warning: { backgroundColor: "{colors.warning}", textColor: "{colors.navy}", rounded: "{rounded.control}" }
  status-danger: { backgroundColor: "{colors.danger}", textColor: "{colors.surface}", rounded: "{rounded.control}" }
---

# India Post Pulse Design System

## Overview

### Creative North Star

India Post Pulse is a command deck rather than a generic MIS report. Its memorable signature is the postal-route hero: a dark dispatch field where data orbits show collection mix before the report opens into precise office comparisons. The compact left rail and dense controls take interaction cues from modern admin dashboards such as NextAdmin without copying a product identity.

### Product context and register

- **Audience and primary job:** New Delhi Central operations staff need to assess booking performance, collection posture, and individual office contribution quickly.
- **Target market and language:** India, English interface, INR and Indian number formatting. Report facts come only from the supplied CSVs.
- **Usage scene:** Daily operational review on desktop with responsive mobile lookup.
- **Register:** Product/admin. The hero carries the report thesis; the directory is optimized for precise repeated work.
- **Memorable signature:** The postal-route hero combines a revenue headline with a large cash/digital radar, then opens into a 55-office working directory.
- **Restraint:** Postal red and warm orange concentrate in the hero, hierarchy, and payment split. The supplied screenshots influenced layered hierarchy and compact controls but are retained only as source material, not copied.
- **Token ownership/runtime mapping:** styles.css owns the tokens as CSS variables. These map directly to the semantic color, type, radius, and spacing values above.

## Colors

Postal red is reserved for the active route and high-emphasis actions. Navy is the dispatch field and heading color. Paper, cream, white, and warm rules preserve data density without a card-grid feeling. Digital is blue and cash is warm orange; each is also named in copy.

## Typography

The system sans stack stays low-friction for operational work. A mono stack is limited to measures, money, IDs, and percentages to create a stable data rhythm. Headings use weight and compression instead of decorative type.

## Layout

Desktop uses a dark 248px dispatch rail and a broad report canvas. The hero is the thesis, the signal strip supports rapid triage, and the directory gives every office a precise working row. At mid-width the rail becomes an icon rail; on phone widths it becomes a labelled bottom task bar, sections stack, and the directory keeps its horizontal data access.

## Elevation & Depth

The hero uses layered postal routes, an intentional grid texture, and two restrained moving parcels. Operational panels are quiet paper surfaces with fine warm rules and shallow elevation. Dialogs use native focus handling with a dark backdrop.

## Components

Every action uses a native button or link with hover, active, visible focus, and disabled geometry. Search has an immediate clear affordance. Sorting, page size, pagination, office detail, export, comparison mode, and reference viewing work by keyboard. Counters count up; rings fill; bars draw; hero parcels drift; and all motion stops under reduced motion.

The dispatch rail is the navigation owner. The complete semantic directory supports search, direct sorting by articles/revenue/digital/cash share, page-size control, pagination, a no-results state, sticky table headers, and office detail dialogs.

The native page-size select is intentional for this self-contained report. Native dialogs provide Escape and focus restoration. No destructive actions, remote writes, or server synchronization claims exist.

Cash and digital shares include only their matching payment channels; other collection methods are excluded from that two-way split. Export reflects the active search and sort. The reference board explicitly separates supplied visual sources from report evidence.

## Do's and Don'ts

- **Do:** Keep data labels, number formats, and cash/digital colour meanings consistent.
- **Do:** Use the hero for the daily story and the directory for exact comparison.
- **Don't:** Invent trends, dates, or official authority not found in the supplied material.
- **Don't:** Use generic gradients, glossy panels, or ambiguous unlabeled charts.
