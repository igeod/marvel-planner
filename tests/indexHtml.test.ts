import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

// The CSP has no unsafe-inline: an inline script or style is blocked in production, where a local
// check over plain HTTP never sends the CSP and so never notices.
describe("index.html e CSP", () => {
  it("non ha script inline", () => {
    expect(html.match(/<script(?![^>]*\ssrc=)[^>]*>/g) ?? []).toEqual([]);
  });

  it("non ha stili inline", () => {
    expect(html).not.toMatch(/<style[\s>]/);
    expect(html).not.toMatch(/\sstyle=/);
  });
});
