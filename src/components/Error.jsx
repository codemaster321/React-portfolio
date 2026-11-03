import { Link, useRouteError } from "react-router-dom";

export function Error() {
  const error = useRouteError();
  const status = error?.status ?? 404;

  return (
    <main className="error-page">
      <p className="error-page__code">{status}</p>
      <h1 className="error-page__title">
        {status === 404 ? "This page wandered off." : "Something went wrong."}
      </h1>
      <p className="error-page__text">
        {status === 404
          ? "The page you're looking for doesn't exist or has moved."
          : error?.statusText || error?.message || "An unexpected error occurred."}
      </p>
      <Link to="/" className="btn btn--solid">
        Back to home <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
