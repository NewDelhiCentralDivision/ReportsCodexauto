const DAILY_FILES = {
  "Booking_Productwise_Report.csv": ["office-id", "office-name", "product-name", "article-count", "total_amount"],
  "Booking_Paymentwise_Report.csv": ["Office ID", "Office Name", "Cash (Cnt)", "Cash (Amt)", "DQR Scan (Cnt)", "DQR Scan (Amt)"],
  "EMO.csv": ["Office Id", "Office Name", "MO Count", "MO Commision"],
};

let schemaPromise;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/admin/upload" && request.method === "GET") {
      return env.ASSETS.fetch(new URL("/admin.html", request.url));
    }
    if (url.pathname === "/api/report-meta" && request.method === "GET") return reportMeta(env);
    if (url.pathname === "/api/reports/upload" && request.method === "POST") return uploadReports(request, env);
    if (url.pathname.startsWith("/data/") && request.method === "GET") return serveReportFile(request, env, url);
    return env.ASSETS.fetch(request);
  },
};

async function prepareDatabase(env) {
  if (!env.REPORT_DB) throw new Error("REPORT_DB binding is not configured.");
  schemaPromise ??= env.REPORT_DB.batch([
    env.REPORT_DB.prepare(`CREATE TABLE IF NOT EXISTS report_files (
      file_name TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      report_date TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`),
  ]);
  await schemaPromise;
}

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function noStore(response) {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store, max-age=0");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function sameSecret(received, expected) {
  if (typeof received !== "string" || typeof expected !== "string") return false;
  let difference = received.length ^ expected.length;
  const length = Math.max(received.length, expected.length);
  for (let i = 0; i < length; i += 1) {
    difference |= (received.charCodeAt(i) || 0) ^ (expected.charCodeAt(i) || 0);
  }
  return difference === 0;
}

function csvHeaders(text) {
  const firstLine = text.replace(/^\uFEFF/, "").split(/\r?\n/, 1)[0] || "";
  return firstLine.split(",").map((value) => value.trim().replace(/^"|"$/g, ""));
}

function validateCsv(fileName, text) {
  if (!text || text.trim().length === 0) return "The file is empty.";
  const headers = new Set(csvHeaders(text));
  const missing = DAILY_FILES[fileName].filter((header) => !headers.has(header));
  return missing.length ? `This does not look like the expected ${fileName} report.` : null;
}

async function serveReportFile(request, env, url) {
  const fileName = decodeURIComponent(url.pathname.split("/").pop() || "");
  if (!Object.hasOwn(DAILY_FILES, fileName) || !env.REPORT_DB) return noStore(await env.ASSETS.fetch(request));
  try {
    await prepareDatabase(env);
    const row = await env.REPORT_DB.prepare("SELECT content FROM report_files WHERE file_name = ?").bind(fileName).first();
    if (!row?.content) return noStore(await env.ASSETS.fetch(request));
    return new Response(row.content, {
      headers: { "Content-Type": "text/csv; charset=utf-8", "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return noStore(await env.ASSETS.fetch(request));
  }
}

async function reportMeta(env) {
  if (!env.REPORT_DB) return json({ source: "bundled" });
  try {
    await prepareDatabase(env);
    const row = await env.REPORT_DB.prepare("SELECT report_date, updated_at FROM report_files ORDER BY updated_at DESC LIMIT 1").first();
    return json(row ? { source: "uploaded", ...row } : { source: "bundled" });
  } catch {
    return json({ source: "bundled" });
  }
}

async function uploadReports(request, env) {
  if (!env.REPORT_DB || !env.UPLOAD_PASSWORD) {
    return json({ ok: false, message: "The report uploader is not fully configured yet." }, 503);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, message: "Please submit the form again." }, 400);
  }
  if (!sameSecret(form.get("password"), env.UPLOAD_PASSWORD)) {
    return json({ ok: false, message: "The password was not accepted." }, 401);
  }

  const reportDate = String(form.get("reportDate") || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reportDate)) {
    return json({ ok: false, message: "Choose the report date before uploading." }, 400);
  }

  const files = [
    ["Booking_Productwise_Report.csv", form.get("product")],
    ["Booking_Paymentwise_Report.csv", form.get("payment")],
    ["EMO.csv", form.get("emo")],
  ];
  const contents = [];
  for (const [fileName, file] of files) {
    if (!(file instanceof File) || file.size === 0 || file.size > 2 * 1024 * 1024) {
      return json({ ok: false, message: `Please choose a valid ${fileName} file (up to 2 MB).` }, 400);
    }
    const content = await file.text();
    const error = validateCsv(fileName, content);
    if (error) return json({ ok: false, message: error }, 400);
    contents.push([fileName, content]);
  }

  try {
    await prepareDatabase(env);
    const updatedAt = new Date().toISOString();
    await env.REPORT_DB.batch(contents.map(([fileName, content]) => env.REPORT_DB.prepare(
      `INSERT INTO report_files (file_name, content, report_date, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(file_name) DO UPDATE SET content = excluded.content, report_date = excluded.report_date, updated_at = excluded.updated_at`
    ).bind(fileName, content, reportDate, updatedAt)));
    return json({ ok: true, reportDate, message: "All three reports are now live." });
  } catch {
    return json({ ok: false, message: "The reports could not be saved. Please try again." }, 500);
  }
}
