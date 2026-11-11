export const PATHS = {
  home: "/",
  privacy: "/privacy",
  accessibility: "/accessibilita",
  admin: "/admin",
  shared: "/s/:code",
  title: "/film/:id",
  resetPassword: "/reset-password",
} as const;

export function sharedPath(code: string): string {
  return PATHS.shared.replace(":code", encodeURIComponent(code));
}

export function titlePath(id: string): string {
  return PATHS.title.replace(":id", encodeURIComponent(id));
}
