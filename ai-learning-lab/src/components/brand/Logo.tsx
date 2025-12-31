"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 32, text: 14, gap: 8 },
  md: { icon: 40, text: 18, gap: 10 },
  lg: { icon: 56, text: 24, gap: 12 },
  xl: { icon: 80, text: 32, gap: 16 },
};

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const { icon, text, gap } = sizes[size];

  return (
    <div
      className={`flex items-center ${className}`}
      style={{ gap }}
    >
      {/* Custom Logo Mark */}
      <div
        className="relative flex-shrink-0"
        style={{ width: icon, height: icon }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-primary)" />
              <stop offset="100%" stopColor="var(--accent-hover)" />
            </linearGradient>
            <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0D0D0D" />
              <stop offset="100%" stopColor="#1A1A1A" />
            </linearGradient>
          </defs>

          {/* Main circle background */}
          <circle cx="24" cy="24" r="24" fill="url(#logoGradient)" />

          {/* Neural network pattern - represents AI */}
          {/* Bottom node */}
          <circle cx="24" cy="34" r="4" fill="url(#nodeGradient)" />

          {/* Middle left node */}
          <circle cx="14" cy="24" r="3.5" fill="url(#nodeGradient)" />

          {/* Middle right node */}
          <circle cx="34" cy="24" r="3.5" fill="url(#nodeGradient)" />

          {/* Top center node - largest, represents growth/goal */}
          <circle cx="24" cy="14" r="5" fill="url(#nodeGradient)" />

          {/* Connecting lines - neural pathways */}
          <path
            d="M24 30 L24 19"
            stroke="var(--bg-dark)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M20 32 L16.5 26"
            stroke="var(--bg-dark)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M28 32 L31.5 26"
            stroke="var(--bg-dark)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M17 22 L21 16"
            stroke="var(--bg-dark)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M31 22 L27 16"
            stroke="var(--bg-dark)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Inner glow on top node - represents enlightenment/learning */}
          <circle cx="24" cy="14" r="2" fill="var(--accent-primary)" opacity="0.5" />
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className="font-bold lowercase tracking-tight"
            style={{
              fontSize: text,
              color: "var(--text-white)",
              letterSpacing: "-0.02em",
            }}
          >
            ai learning lab
          </span>
        </div>
      )}
    </div>
  );
}

// Animated version for hero section
export function LogoAnimated({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="logoGradientLg" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-primary)" />
            <stop offset="100%" stopColor="var(--accent-hover)" />
          </linearGradient>
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow ring */}
        <circle
          cx="60"
          cy="60"
          r="55"
          stroke="var(--accent-primary)"
          strokeWidth="1"
          strokeOpacity="0.2"
          fill="none"
        >
          <animate
            attributeName="r"
            values="52;58;52"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-opacity"
            values="0.2;0.4;0.2"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Main circle */}
        <circle cx="60" cy="60" r="48" fill="url(#logoGradientLg)" filter="url(#glow)" />

        {/* Neural network nodes */}
        <g>
          {/* Bottom node */}
          <circle cx="60" cy="82" r="8" fill="var(--bg-dark)">
            <animate
              attributeName="r"
              values="8;9;8"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Left node */}
          <circle cx="35" cy="60" r="7" fill="var(--bg-dark)" />

          {/* Right node */}
          <circle cx="85" cy="60" r="7" fill="var(--bg-dark)" />

          {/* Top node - main focus */}
          <circle cx="60" cy="38" r="10" fill="var(--bg-dark)" />

          {/* Inner glow on top node */}
          <circle cx="60" cy="38" r="4" fill="var(--accent-primary)" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.4;0.8;0.4"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Connecting lines with animation */}
        <g stroke="var(--bg-dark)" strokeLinecap="round">
          {/* Vertical main path */}
          <path d="M60 74 L60 48" strokeWidth="4" opacity="0.8" />

          {/* Diagonal paths */}
          <path d="M52 78 L40 65" strokeWidth="3" opacity="0.6" />
          <path d="M68 78 L80 65" strokeWidth="3" opacity="0.6" />
          <path d="M42 55 L52 43" strokeWidth="3" opacity="0.6" />
          <path d="M78 55 L68 43" strokeWidth="3" opacity="0.6" />
        </g>

        {/* Orbiting particle */}
        <circle cx="60" cy="60" r="3" fill="var(--accent-primary)">
          <animateMotion
            dur="8s"
            repeatCount="indefinite"
            path="M0,45 A45,45 0 1,1 0,-45 A45,45 0 1,1 0,45"
          />
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}

// Icon only version for favicon and small uses
export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradientIcon" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00D09C" />
          <stop offset="100%" stopColor="#00FFB3" />
        </linearGradient>
      </defs>

      <circle cx="24" cy="24" r="24" fill="url(#logoGradientIcon)" />

      {/* Simplified neural pattern for small sizes */}
      <circle cx="24" cy="34" r="4" fill="#0D0D0D" />
      <circle cx="14" cy="24" r="3.5" fill="#0D0D0D" />
      <circle cx="34" cy="24" r="3.5" fill="#0D0D0D" />
      <circle cx="24" cy="14" r="5" fill="#0D0D0D" />

      <path d="M24 30 L24 19" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 32 L16.5 26" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M28 32 L31.5 26" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M17 22 L21 16" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M31 22 L27 16" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

      <circle cx="24" cy="14" r="2" fill="#00D09C" opacity="0.5" />
    </svg>
  );
}
