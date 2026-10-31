interface StatusProps {
  children?: string | null;
  className?: string;
}

// Live region that stays in the DOM: screen readers only announce changes to a region that already exists.
export function Status({ children, className }: StatusProps) {
  const classes = [className, children ? null : "visually-hidden"].filter(Boolean).join(" ");
  return (
    <p role="status" className={classes || undefined}>
      {children}
    </p>
  );
}
