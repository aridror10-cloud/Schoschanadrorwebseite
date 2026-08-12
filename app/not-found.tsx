import Link from "next/link";

/** 404-Seite, zweisprachig wie die restliche Seite. */
export default function NotFound() {
  return (
    <div className="notfound">
      <div>
        <h1>העמוד לא נמצא · Page not found</h1>
        <p lang="en" dir="ltr">
          The page you are looking for does not exist.
        </p>
        <Link href="/" className="btn-wide">
          לעמוד הראשי · Back home
        </Link>
      </div>
    </div>
  );
}
