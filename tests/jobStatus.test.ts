import { describe, expect, it } from "vitest";
import type { JobRun } from "../shared/admin";
import { jobStatus } from "../src/features/admin/utils/jobStatus";

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
