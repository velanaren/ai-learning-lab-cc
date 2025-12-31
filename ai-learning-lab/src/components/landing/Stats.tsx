"use client";

const stats = [
  {
    value: "10",
    label: "minutes per day",
    suffix: "min",
  },
  {
    value: "30",
    label: "curated topics",
    suffix: "+",
  },
  {
    value: "95",
    label: "completion rate",
    suffix: "%",
  },
];

export function Stats() {
  return (
    <section className="py-[var(--space-12)] border-y border-[rgba(255,255,255,0.06)]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="stat-card reveal"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <p className="stat-value">
                {stat.value}
                <span className="text-[0.6em] ml-1">{stat.suffix}</span>
              </p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
