# New Delhi Central daily report dashboard

The public dashboard is served from `public/`. Its three daily CSV requests are routed through the Worker: before the first upload it uses the bundled reports; after an upload it reads the latest reports from D1.

## One-time Cloudflare check

The Worker already has these two dashboard settings from the Cloudflare setup:

- D1 binding: `REPORT_DB` → `ndc-report-data`
- Encrypted Worker secret: `UPLOAD_PASSWORD`

Keep both settings in place when the GitHub deployment updates. The password never belongs in this repository or any source file.

## Daily publishing

Open `https://codexautoreport.caanewdelhicentral.workers.dev/admin/upload`, select the three downloaded reports, choose the report date, enter the publishing password, and select **Publish all three reports**. The dashboard uses the new data immediately; no GitHub edit, commit, or Cloudflare deployment is needed for the daily process.

The upload screen validates the expected columns and only accepts CSV files up to 2 MB. The office-to-HO map is a reference file stored in `public/data/office_head_office_map.json`; update it in GitHub only if office mapping changes.
