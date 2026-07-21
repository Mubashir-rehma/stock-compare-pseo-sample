/**
 * QA audit over the BUILT HTML (run `npm run build` first, then `npx tsx
 * scripts/qa-audit.ts`). Covers Technical-SEO, FAQ/Schema, and content-integrity
 * lanes across every page. Reports findings by severity; exits 1 if any HIGH+.
 */
import { readFileSync, existsSync } from "node:fs";
import { PAIRS, getPair } from "../src/data/pairs";
import { requireTicker } from "../src/data/tickers";
import { shouldIndex } from "../src/lib/curation";
import { BASE_URL } from "../src/lib/site";

const APP = ".next/server/app";
type Sev = "HIGH" | "MEDIUM" | "LOW";
const findings: { sev: Sev; page: string; msg: string }[] = [];
const add = (sev: Sev, page: string, msg: string) => findings.push({ sev, page, msg });

function read(path: string): string | null {
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}
function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27|X27);/g, "'")
    .replace(/&#x2[fF];/g, "/")
    .replace(/&rsquo;|&#8217;/g, "’");
}
function stripTags(s: string): string {
  return decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}
const FORBIDDEN = ["lorem ipsum", "click here", "in today's fast-paced", "todo", "lorem"];

const titles = new Map<string, string[]>();
const descs = new Map<string, string[]>();

function auditPage(html: string, page: string, expect: {
  canonical: string;
  index?: boolean;
  isCompare?: boolean;
  pairSlug?: string;
}) {
  // one H1
  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1s !== 1) add("HIGH", page, `expected exactly 1 <h1>, found ${h1s}`);

  // heading order: first heading tag should be h1
  const firstHeading = /<h([1-6])[\s>]/.exec(html)?.[1];
  if (firstHeading && firstHeading !== "1") add("MEDIUM", page, `first heading is <h${firstHeading}>, not <h1>`);

  // title
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1];
  if (!title) add("HIGH", page, "missing <title>");
  else {
    const t = decode(title);
    if (t.length > 60) add("MEDIUM", page, `title ${t.length} chars > 60: "${t}"`);
    titles.set(t, [...(titles.get(t) ?? []), page]);
  }

  // description
  const desc = /<meta name="description" content="([^"]*)"/.exec(html)?.[1];
  if (!desc) add("HIGH", page, "missing meta description");
  else {
    const d = decode(desc);
    if (d.length > 155) add("MEDIUM", page, `description ${d.length} chars > 155`);
    descs.set(d, [...(descs.get(d) ?? []), page]);
  }

  // canonical
  const canon = /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1];
  if (!canon) add("HIGH", page, "missing canonical");
  else if (canon !== expect.canonical) add("HIGH", page, `canonical "${canon}" != expected "${expect.canonical}"`);

  // robots
  const robots = /<meta name="robots" content="([^"]*)"/.exec(html)?.[1] ?? "";
  if (expect.index === false) {
    if (!/noindex/.test(robots)) add("HIGH", page, `expected noindex, got "${robots}"`);
  } else if (expect.index === true) {
    if (/noindex/.test(robots)) add("HIGH", page, `expected index, got "${robots}"`);
  }

  // OG / twitter
  for (const tag of ['property="og:title"', 'property="og:description"', 'property="og:url"', 'name="twitter:card"']) {
    if (!html.includes(tag)) add("MEDIUM", page, `missing ${tag}`);
  }

  // breadcrumb (home has none by design)
  if (page !== "/" && !/aria-label="Breadcrumb"/.test(html)) add("MEDIUM", page, "missing breadcrumb nav");

  // JSON-LD parse
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (scripts.length === 0) add("HIGH", page, "no JSON-LD");
  if (scripts.length > 1) add("LOW", page, `${scripts.length} JSON-LD blocks (expected 1)`);
  let graph: unknown[] = [];
  for (const s of scripts) {
    try {
      const parsed = JSON.parse(decode(s[1]));
      graph = (parsed as { "@graph"?: unknown[] })["@graph"] ?? [];
    } catch (e) {
      add("HIGH", page, `JSON-LD does not parse: ${(e as Error).message}`);
    }
  }

  // BreadcrumbList positions sequential from 1, names present
  const bc = (graph as Array<Record<string, unknown>>).find((n) => n["@type"] === "BreadcrumbList");
  if (page !== "/" && !bc) add("MEDIUM", page, "no BreadcrumbList in JSON-LD");
  if (bc) {
    const items = (bc.itemListElement as Array<{ position: number; name: string }>) ?? [];
    items.forEach((it, i) => {
      if (it.position !== i + 1) add("MEDIUM", page, `breadcrumb position ${it.position} != ${i + 1}`);
      if (!it.name) add("MEDIUM", page, `breadcrumb item ${i + 1} has no name`);
    });
  }

  // forbidden phrases (in visible text)
  const body = stripTags(html).toLowerCase();
  for (const f of FORBIDDEN) if (body.includes(f)) add("HIGH", page, `forbidden phrase: "${f}"`);

  // compare-specific
  if (expect.isCompare && expect.pairSlug) {
    const pair = getPair(expect.pairSlug)!;
    // th scope in table
    if (!/<th scope="col"/.test(html) || !/<th scope="row"/.test(html)) {
      add("MEDIUM", page, "table missing <th scope=col/row>");
    }
    // FAQPage mirrors on-page FAQ
    const faqNode = (graph as Array<Record<string, unknown>>).find((n) => n["@type"] === "FAQPage");
    if (!faqNode) add("HIGH", page, "no FAQPage node");
    else {
      const qs = (faqNode.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>) ?? [];
      if (qs.length !== pair.faqs.length) add("HIGH", page, `FAQPage has ${qs.length} Qs, on-page has ${pair.faqs.length}`);
      for (const f of pair.faqs) {
        const qNorm = decode(f.q).replace(/\s+/g, " ").trim();
        if (!body.includes(qNorm.toLowerCase())) add("HIGH", page, `FAQ question not in body: "${f.q}"`);
        const inSchema = qs.some((q) => decode(q.name).replace(/\s+/g, " ").trim() === qNorm);
        if (!inSchema) add("HIGH", page, `on-page FAQ missing from FAQPage schema: "${f.q}"`);
      }
    }
    // verdict self-contained: both tickers + a year appear early (window
    // allows for header/nav/breadcrumb/H1/dek chrome before the verdict block)
    const early = body.slice(0, 2200);
    if (!early.includes(pair.a.toLowerCase()) || !early.includes(pair.b.toLowerCase())) {
      add("MEDIUM", page, "both tickers not present early (AEO)");
    }
    if (!/202\d/.test(early)) add("LOW", page, "no year in early content (AEO timeframe)");
    // disclaimer
    if (!body.includes("illustrative data")) add("MEDIUM", page, "missing illustrative-data disclaimer");
  }
}

// --- Home & hub ---
const home = read(`${APP}/index.html`);
// trailingSlash:false → homepage canonical is the bare origin (no trailing slash)
if (home) auditPage(home, "/", { canonical: BASE_URL, index: true });
else add("HIGH", "/", "home HTML missing");

const hub = read(`${APP}/compare.html`);
if (hub) auditPage(hub, "/compare", { canonical: `${BASE_URL}/compare`, index: true });
else add("HIGH", "/compare", "hub HTML missing");

// --- All pairs ---
for (const p of PAIRS) {
  const html = read(`${APP}/compare/${p.slug}.html`);
  const page = `/compare/${p.slug}`;
  if (!html) { add("HIGH", page, "HTML missing"); continue; }
  requireTicker(p.a); requireTicker(p.b);
  auditPage(html, page, {
    canonical: `${BASE_URL}${page}`,
    index: shouldIndex(p.a, p.b, p.slug),
    isCompare: true,
    pairSlug: p.slug,
  });
}

// --- Uniqueness across pages ---
for (const [t, pages] of titles) if (pages.length > 1) add("MEDIUM", pages.join(","), `duplicate <title>: "${t}"`);
for (const [d, pages] of descs) if (pages.length > 1) add("MEDIUM", pages.join(","), `duplicate description on ${pages.length} pages`);

// --- Report ---
const bySev = (s: Sev) => findings.filter((f) => f.sev === s);
for (const sev of ["HIGH", "MEDIUM", "LOW"] as Sev[]) {
  const list = bySev(sev);
  if (list.length) {
    console.log(`\n${sev} (${list.length}):`);
    for (const f of list) console.log(`  [${f.page}] ${f.msg}`);
  }
}
const high = bySev("HIGH").length;
console.log(
  `\n${high === 0 ? "✅" : "❌"} qa-audit: ${findings.length} finding(s) — ` +
    `${bySev("HIGH").length} HIGH, ${bySev("MEDIUM").length} MEDIUM, ${bySev("LOW").length} LOW.`,
);
process.exit(high > 0 ? 1 : 0);
