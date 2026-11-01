import { describe, expect, it } from "vitest";
import type { JobRun } from "../shared/admin";
import { jobStatus, searchReliability } from "../src/features/admin/utils/jobStatus";

const NOW = new Date("2026-10-30T12:00:00Z").getTime();
const run = (at: string, status: JobRun["status"] = "ok"): JobRun => ({
  at,
  status,
  error: status === "error" ? "boom" : null,
});

describe("stato dei job", () => {
  it("mai eseguito", () => {
    expect(jobStatus(null, "daily", NOW)).toBe("never");
  });

  it("riuscito di recente", () => {
    expect(jobStatus(run("2026-10-30T03:17:00Z"), "daily", NOW)).toBe("ok");
  });

  it("in ritardo dopo 36 ore (giornaliero) e 8 giorni (settimanale)", () => {
    expect(jobStatus(run("2026-10-28T23:00:00Z"), "daily", NOW)).toBe("late");
    expect(jobStatus(run("2026-10-22T11:00:00Z"), "weekly", NOW)).toBe("late");
    expect(jobStatus(run("2026-10-23T00:00:00Z"), "weekly", NOW)).toBe("ok");
  });

  it("l'errore vince sul ritardo", () => {
    expect(jobStatus(run("2026-09-01T00:00:00Z", "error"), "daily", NOW)).toBe("error");
  });
});

describe("affidabilità della ricerca dei candidati", () => {
  it("segue la priorità: token, mai eseguita, errore, ritardo, regolare", () => {
    const recent = run("2026-10-26T04:43:00Z");
    expect(searchReliability(false, recent, NOW)).toBe("noToken");
    expect(searchReliability(true, null, NOW)).toBe("never");
    expect(searchReliability(true, run("2026-10-29T04:43:00Z", "error"), NOW)).toBe("error");
    expect(searchReliability(true, run("2026-10-12T04:43:00Z"), NOW)).toBe("late");
    expect(searchReliability(true, recent, NOW)).toBe("ok");
  });
});
