import { useEffect, useId, useState, type ReactNode, type Ref } from "react";
import { useLocation } from "react-router";
import { Chevron } from "../../../../components/ui/Chevron/Chevron";

interface AdminQueueProps {
  // The anchor: `#<id>` in the address opens the queue.
  id: string;
  title: string;
  // A line under the title, where there is a text for it.
  context?: string;
  count: number;
  ref?: Ref<HTMLDetailsElement>;
  headingRef?: Ref<HTMLHeadingElement>;
  headingDescribedBy?: string;
  children: ReactNode;
}

// A queue of the admin page: closed it is one row (title, number, chevron). Open or closed is not saved.
export function AdminQueue({
  id,
  title,
  context,
  count,
  ref,
  headingRef,
  headingDescribedBy,
  children,
}: AdminQueueProps) {
  const { hash } = useLocation();
  const [isOpen, setIsOpen] = useState(hash === `#${id}`);
  const contextId = useId();

  // The address changing to this queue opens it (adjusted while rendering, not in an effect).
  const [seenHash, setSeenHash] = useState(hash);
  if (seenHash !== hash) {
    setSeenHash(hash);
    if (hash === `#${id}`) setIsOpen(true);
  }

  // Once open, the queue comes into view (the browser scrolled to it while it was still closed).
  useEffect(() => {
    if (hash === `#${id}`) document.getElementById(id)?.scrollIntoView();
  }, [hash, id]);

  return (
    <details
      id={id}
      ref={ref}
      className="card admin-queue"
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary className="admin-queue__head">
        <span className="admin-queue__heading">
          <h2
            tabIndex={-1}
            ref={headingRef}
            aria-describedby={
              [headingDescribedBy, context ? contextId : undefined].filter(Boolean).join(" ") ||
              undefined
            }
          >
            {title}
          </h2>
          {context && (
            <span id={contextId} className="admin-queue__context muted">
              {context}
            </span>
          )}
        </span>
        <span className="admin-queue__count">{count}</span>
        <Chevron />
      </summary>
      <div className="admin-queue__body">{children}</div>
    </details>
  );
}
