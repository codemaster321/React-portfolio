import { Link, useRouteError } from "react-router-dom";

export function Error() {
  const error = useRouteError();
  const status = error?.status ?? 404;

  return (
    <div className="error-page">
      <p className="error-code">{status}</p>
      <h1 className="error-title">
        {status === 404 ? "Page not found" : "Something went wrong"}
      </h1>
      <p className="error-description">
        {status === 404
          ? "The page you're looking for doesn't exist or has moved."
          : error?.statusText || error?.message || "An unexpected error occurred."}
      </p>
      <Link to="/" className="hero-btn hero-btn--primary error-link">
        <span className="btn-text">Back to home</span>
        <span className="btn-icon">→</span>
      </Link>
    </div>
  );
}
