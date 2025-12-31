"use client";

// Simple company logo SVGs (abstract representations)
const companies = [
  {
    name: "TechCorp",
    logo: (
      <svg viewBox="0 0 120 30" fill="currentColor">
        <rect x="0" y="8" width="14" height="14" rx="2" />
        <rect x="18" y="8" width="14" height="14" rx="2" opacity="0.6" />
        <text x="40" y="22" fontSize="16" fontWeight="600">techcorp</text>
      </svg>
    ),
  },
  {
    name: "DataFlow",
    logo: (
      <svg viewBox="0 0 100 30" fill="currentColor">
        <circle cx="12" cy="15" r="8" />
        <circle cx="28" cy="15" r="4" opacity="0.6" />
        <text x="40" y="21" fontSize="14" fontWeight="500">dataflow</text>
      </svg>
    ),
  },
  {
    name: "CloudScale",
    logo: (
      <svg viewBox="0 0 110 30" fill="currentColor">
        <path d="M8 20c-4 0-6-3-6-6s2-6 6-6c1-3 4-5 7-5 4 0 7 3 7 7h1c3 0 5 2 5 5s-2 5-5 5H8z" opacity="0.8" />
        <text x="32" y="21" fontSize="14" fontWeight="500">cloudscale</text>
      </svg>
    ),
  },
  {
    name: "DevStack",
    logo: (
      <svg viewBox="0 0 100 30" fill="currentColor">
        <rect x="2" y="6" width="18" height="4" rx="1" />
        <rect x="2" y="13" width="14" height="4" rx="1" opacity="0.7" />
        <rect x="2" y="20" width="10" height="4" rx="1" opacity="0.4" />
        <text x="28" y="21" fontSize="14" fontWeight="500">devstack</text>
      </svg>
    ),
  },
  {
    name: "CodeLabs",
    logo: (
      <svg viewBox="0 0 100 30" fill="currentColor">
        <path d="M6 8l6 7-6 7M14 22h8" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" />
        <text x="28" y="21" fontSize="14" fontWeight="500">codelabs</text>
      </svg>
    ),
  },
];

export function SocialProof() {
  return (
    <section className="py-[var(--space-10)]">
      <div className="container mx-auto px-6">
        <p className="text-center text-muted-sm mb-8">
          engineers from these companies learn with us
        </p>
        <div className="logo-strip">
          {companies.map((company) => (
            <div
              key={company.name}
              className="h-8 w-auto"
              title={company.name}
            >
              {company.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
