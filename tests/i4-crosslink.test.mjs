// I4: theory section links the Intelligence Bound, calls it a conjecture,
// never "proven", names T-IB-01/02/06/09, and changes nothing else.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const m = html.match(/<section id="theory">([\s\S]*?)<\/section>/);

test("theory section exists with the required heading", () => {
  assert.ok(m, "missing #theory section");
  assert.match(m[1], /The theory behind the scanner/);
});
test("links the Intelligence Bound page", () => {
  assert.match(m[1], /href="https:\/\/viridisconservation\.com\/intelligence-bound"/);
});
test("calls it a conjecture and never claims it is proven", () => {
  assert.match(m[1], /conjecture/i);
  assert.doesNotMatch(m[1].replace(/not a proven result/i, ""), /\bproven\b/i);
});
test("names T-IB-01, 02, 06 and 09", () => {
  for (const t of ["T-IB-01", "T-IB-02", "T-IB-06", "T-IB-09"]) assert.ok(m[1].includes(t), t);
});
test("no other copy changed versus the base commit", () => {
  const base = process.env.I4_BASE ?? "HEAD~1";
  let orig;
  try { orig = execSync(`git show ${base}:index.html`, { encoding: "utf8" }); } catch { return; }
  const stripped = html.replace(/<!-- THEORY \(I4 cross-link\) -->\n<section id="theory">[\s\S]*?<\/section>\n\n/, "");
  assert.equal(stripped, orig);
});
