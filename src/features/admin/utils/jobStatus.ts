import { JOB_LATE_AFTER_HOURS, type JobRun } from "../../../../shared/admin";

export type JobState = "ok" | "error" | "late" | "never";

const HOUR_MS = 60 * 60 * 1000;

// The most serious state wins: error, then late.
export function jobStatus(
  run: JobRun | null,
  job: keyof typeof JOB_LATE_AFTER_HOURS,
  now = Date.now(),
): JobState {
  if (!run) return "never";
  if (run.status === "error") return "error";
  if (now - new Date(run.at).getTime() > JOB_LATE_AFTER_HOURS[job] * HOUR_MS) return "late";
  return "ok";
}
