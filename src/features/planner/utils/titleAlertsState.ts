export interface AlertTitle {
  id: string;
  name: string;
}

// The titles with an alert on. A new set each time, so React sees the change.
export function withAlert(
  ids: ReadonlySet<string>,
  id: string,
  isOn: boolean,
): ReadonlySet<string> {
  const next = new Set(ids);
  if (isOn) next.add(id);
  else next.delete(id);
  return next;
}
