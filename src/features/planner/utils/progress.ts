import type { Progress, Title } from "../types";

// A title not out yet cannot be watched: it counts neither in the total nor in the done, even if a
// mark was saved for it before its status was known. It counts again once it is out.
export function computeProgress(titles: Title[], watched: ReadonlySet<string>): Progress {
  const released = titles.filter((title) => title.status === "released");
  return {
    done: released.filter((title) => watched.has(title.id)).length,
    total: released.length,
  };
}
