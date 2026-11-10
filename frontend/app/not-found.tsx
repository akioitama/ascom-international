import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-5 py-24">
      <p className="text-xs uppercase tracking-[0.16em] text-blue">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">That page is not available</h1>
      <p className="mt-4 text-muted">The address does not match a published page.</p>
      <Link href="/" className="mt-6 inline-block text-sm font-semibold text-blue">
        Back to the homepage
      </Link>
    </section>
  );
}
