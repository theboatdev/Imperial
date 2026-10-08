import Link from 'next/link';

/**
 * Root-level not-found (outside [locale]).
 * Locale-specific not-found lives in app/[locale]/not-found.tsx.
 */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="error-page">
          <h1>404</h1>
          <p>The page you are looking for does not exist or has been moved.</p>
          <Link href="/en">Return Home</Link>
        </div>
      </body>
    </html>
  );
}
