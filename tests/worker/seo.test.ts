import { describe, expect, it } from "vitest";
import { ROWS_PER_INSERT } from "../../worker/routes/progress";
import { escapeHtml } from "../../worker/routes/seo";
import { watchedTitle } from "../../worker/db/schema";
import { createTestDatabase } from "./support/testDatabase";

describe("testo messo nell'HTML delle pagine dei film", () => {
  it("rende innocui i caratteri che aprono un tag o chiudono un attributo", () => {
    expect(escapeHtml(`<img src=x onerror="a()"> & "ciao"`)).toBe(
      "&lt;img src=x onerror=&quot;a()&quot;&gt; &amp; &quot;ciao&quot;",
    );
  });
});

describe("inserimento dei titoli visti", () => {
  it("resta sotto il limite di 100 parametri per istruzione di D1", () => {
    const { db } = createTestDatabase();
    const rows = Array.from({ length: ROWS_PER_INSERT }, (_, index) => ({
      userId: "u1",
      titleId: `t${index}`,
    }));
    const { params } = db.insert(watchedTitle).values(rows).toSQL();
    expect(params.length).toBeLessThanOrEqual(100);
  });
});
