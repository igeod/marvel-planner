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

export type SearchReliability = "ok" | "noToken" | "error" | "late" | "never";

// Whether "no new titles" can be trusted: it depends on the weekly search having run.
export function searchReliability(
  tmdbConfigured: boolean,
  weekly: JobRun | null,
  now = Date.now(),
): SearchReliability {
  if (!tmdbConfigured) return "noToken";
  if (!weekly) return "never";
  if (weekly.status === "error") return "error";
  if (now - new Date(weekly.at).getTime() > JOB_LATE_AFTER_HOURS.weekly * HOUR_MS) return "late";
  return "ok";
}
