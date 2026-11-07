import { useEffect, useId, useRef, type ReactNode } from "react";

interface StatusPageProps {
  art: string;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  extra?: ReactNode;
  autoFocusTitle?: boolean;
}

export function StatusPage({
  art,
  title,
  children,
  actions,
  extra,
  autoFocusTitle,
}: StatusPageProps) {
  const titleId = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (autoFocusTitle) titleRef.current?.focus();
  }, [autoFocusTitle]);

  return (
    <section className="status-page" aria-labelledby={titleId}>
      <img className="status-art" src={art} alt="" aria-hidden width={640} height={640} />
      <div className="status-page__body">
        <h1 id={titleId} ref={titleRef} tabIndex={-1}>
          {title}
        </h1>
        <p>{children}</p>
        {actions && <div className="status-page__actions">{actions}</div>}
        {extra}
      </div>
    </section>
  );
}
