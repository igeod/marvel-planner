import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import { securityHeaders } from "../../worker/middleware/securityHeaders";
import type { AppEnv } from "../../worker/types";

const HEADERS_FILE = join(import.meta.dirname, "../../public/_headers");

const app = new Hono<AppEnv>();
app.use(securityHeaders);
app.get("*", (c) => c.text("ok"));

const headersOf = async (url: string) => (await app.request(url)).headers;

describe("intestazioni di sicurezza su HTTPS", () => {
  it("limitano ogni tipo di risorsa al nostro sito, con la sola eccezione del player", async () => {
    const csp = (await headersOf("https://site.test/")).get("content-security-policy") ?? "";
    for (const directive of [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "frame-src https://www.youtube-nocookie.com",
    ]) {
      expect(csp).toContain(directive);
    }
    expect(csp).not.toContain("unsafe-inline");
    expect(csp).not.toContain("unsafe-eval");
  });

  it("impediscono sniffing, incorniciamento e invio del percorso ad altri siti", async () => {
    const headers = await headersOf("https://site.test/");
    expect(headers.get("x-content-type-options")).toBe("nosniff");
    expect(headers.get("x-frame-options")).toMatch(/SAMEORIGIN|DENY/);
    expect(headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(headers.get("strict-transport-security")).toContain("max-age=");
  });

  it("disattivano fotocamera, microfono, posizione e pagamenti", async () => {
    const policy = (await headersOf("https://site.test/")).get("permissions-policy") ?? "";
    for (const feature of ["camera", "microphone", "geolocation", "payment"]) {
      expect(policy).toContain(`${feature}=()`);
    }
  });
});

// Pages and files come straight from the assets, with the headers of public/_headers: they must
// say the same as the Worker, or a page would have different protection depending on its path.
describe("public/_headers", () => {
  const block = readFileSync(HEADERS_FILE, "utf8")
    .split(/\r?\n\r?\n/)
    .find((part) => part.includes("\n/*\n") || part.startsWith("/*"));
  const fileHeaders = new Map(
    (block ?? "")
      .split(/\r?\n/)
      .filter((line) => /^\s+[\w-]+:/.test(line))
      .map((line) => {
        const [name, ...value] = line.trim().split(":");
        return [name.toLowerCase(), value.join(":").trim()] as const;
      }),
  );

  it("ha gli stessi valori che il Worker manda su HTTPS", async () => {
    const worker = await headersOf("https://site.test/");
    const names = [...worker.keys()].filter((name) => name !== "content-type");
    expect(names.length).toBeGreaterThan(8);
    for (const name of names) expect(fileHeaders.get(name), name).toBe(worker.get(name));
  });

  it("nasconde ai motori di ricerca le pagine dei planner condivisi", () => {
    expect(readFileSync(HEADERS_FILE, "utf8")).toMatch(/\/s\/\*\s+X-Robots-Tag: noindex/);
  });
});
