// Same blocks as the loaded title page (hero card, story and cast, spoiler zone): nothing shifts.
export function TitleDetailsSkeleton() {
  return (
    <div className="film__main film-skeleton" aria-hidden="true">
      <div className="film-skeleton__hero skeleton" />
      <div className="film-skeleton__body">
        <div className="film-skeleton__lines">
          <span className="skeleton" />
          <span className="skeleton" />
          <span className="skeleton film-skeleton__short" />
        </div>
        <div className="film-skeleton__lines">
          <span className="skeleton" />
          <span className="skeleton" />
          <span className="skeleton" />
        </div>
      </div>
      <div className="film-skeleton__spoiler skeleton" />
    </div>
  );
}
