import type { ReactNode } from 'react';

/**
 * Shared reading layout for the static legal pages (Privacy, Terms). These are
 * React-native routes, not ported from the static site, so they carry their own
 * self-contained styling rather than a lifted page stylesheet. The shared nav
 * (App renders <Navbar/> for non-chromeless routes) sits above this.
 */
export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main
      style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '48px 24px 96px',
        fontFamily: "'Nunito', system-ui, sans-serif",
        lineHeight: 1.7,
        color: '#1E293B',
      }}
    >
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(30px,5vw,44px)', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>
        {title}
      </h1>
      <p style={{ color: '#64748B', fontSize: 14, marginBottom: 8 }}>Last updated: {updated}</p>
      <p style={{ color: '#64748B', fontSize: 14, marginBottom: 32 }}>
        BestBrain Learning Pvt. Ltd. · Made for Bharat
      </p>
      <div className="legal-body">{children}</div>
    </main>
  );
}

/** A titled section — an h2 plus its paragraphs/lists. */
export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, margin: '0 0 10px' }}>{heading}</h2>
      {children}
    </section>
  );
}
