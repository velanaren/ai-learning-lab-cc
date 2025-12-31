"use client";

const testimonials = [
  {
    quote:
      "finally, a learning app that respects my time. 15 minutes a day and i actually retain what i learn.",
    name: "sarah chen",
    role: "senior engineer at stripe",
    initials: "SC",
  },
  {
    quote:
      "the personalized path is incredible. it knew exactly where to start based on my experience level.",
    name: "marcus johnson",
    role: "tech lead at shopify",
    initials: "MJ",
  },
  {
    quote:
      "i've tried countless learning platforms. this is the only one that stuck. the daily habit changed everything.",
    name: "priya patel",
    role: "founding engineer at vercel",
    initials: "PP",
  },
];

export function Testimonials() {
  return (
    <section className="py-[var(--space-20)]">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-eyebrow mb-4 inline-block">
            what engineers say
          </span>
          <h2 className="text-section-title">
            trusted by engineers who ship
          </h2>
        </div>

        {/* Testimonial grid */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="testimonial-card reveal"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Quote */}
              <p className="testimonial-quote">"{testimonial.quote}"</p>

              {/* Author */}
              <div className="testimonial-author">
                <div className="testimonial-avatar">{testimonial.initials}</div>
                <div>
                  <p className="testimonial-name">{testimonial.name}</p>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
