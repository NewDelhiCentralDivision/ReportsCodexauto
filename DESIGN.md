---
version: beta
name: "India Post Pulse — New Delhi Central"
description: "Mobile-first booking, product revenue, digital adoption, and Head Office performance dashboard."
colors:
  primary: "#d8343f"
  navy: "#18243a"
  text: "#283044"
  muted: "#5f6876"
  page: "#fbf8f2"
  surface: "#ffffff"
  line: "#ded9cf"
  soft: "#f3eee4"
  success: "#29795f"
  warning: "#ef8a62"
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
  page: "1.25rem"
  panel: "1.25rem"
  compact: "0.625rem"
components:
  navigation: { backgroundColor: "{colors.navy}", textColor: "{colors.surface}", padding: "{spacing.compact}", rounded: "{rounded.control}" }
  button: { backgroundColor: "{colors.primary}", textColor: "{colors.surface}", padding: "{spacing.compact}", rounded: "{rounded.control}" }
  panel: { backgroundColor: "{colors.surface}", textColor: "{colors.text}", padding: "{spacing.panel}", rounded: "{rounded.DEFAULT}" }
  page: { backgroundColor: "{colors.page}", textColor: "{colors.muted}", padding: "{spacing.page}" }
  divider: { backgroundColor: "{colors.line}", textColor: "{colors.text}", rounded: "{rounded.control}" }
  soft-chip: { backgroundColor: "{colors.soft}", textColor: "{colors.text}", padding: "{spacing.compact}", rounded: "{rounded.control}" }
  status-success: { backgroundColor: "{colors.success}", textColor: "{colors.surface}", rounded: "{rounded.control}" }
  status-warning: { backgroundColor: "{colors.warning}", textColor: "{colors.navy}", rounded: "{rounded.control}" }
  status-danger: { backgroundColor: "{colors.danger}", textColor: "{colors.surface}", rounded: "{rounded.control}" }
---

# India Post Pulse Design System

## Creative North Star

India Post Pulse is a phone-first operational command deck, not a compressed government report. The dark postal-route hero frames the division story. It gives way to readable product earning, digital adoption, Head Office summaries, and exact office records in a deliberate vertical narrative.

## Product context

- **Audience:** New Delhi Central officers reviewing daily operational performance, mostly on portrait mobile phones.
- **Primary job:** See where revenue is earned, encourage strong digital transaction performance, and inspect office contribution under the correct Head Post Office.
- **Language and numbers:** English, INR, Indian number formatting.
- **Data rules:** Productwise rows provide booking product revenue. EMO is one product and only its commission field is revenue. The paymentwise report supplies cash/digital measures. The supplied map owns Head Office assignment.

## Layout and mobile behaviour

Mobile is the baseline: each analytic story is a single vertical section with 44px-or-greater controls, readable labels, and no wide office table. A compact fixed five-link mobile nav reaches Overview, Products, Digital, HPO, and Offices. Head Office sections are native expandable disclosures; their individual office cards keep articles, revenue, digital share, and transaction context visible without horizontal scroll.

Desktop adds a persistent rail and multi-column layouts only where the same content remains easier to compare.

## Visual language

Navy is the dispatch field; postal red carries priority and movement. Cream paper and fine warm rules make dense operational data calm. Digital uses blue and cash warm orange, always accompanied by explicit labels. High digital performers receive a blue accent and are described as Digital Champions; lower values are factual and neutral.

## Motion and interaction

Counters, rings, and bars animate once on arrival. Product reveal, Head Office disclosure, office dialog, sorting, and export are native or lightweight DOM interactions. Reduced-motion users receive the same information without transitions or ambient parcel movement.

## Accuracy and hierarchy

The dashboard hierarchy is: Division Overview, Digital vs Cash, Product Revenue, Digital Champions, Head Office Performance, then grouped Office Performance. The export preserves the current office search and includes the Head Office key. No visual-source area, related controls, or decorative source assets remain in the product.
