"use client";

import { useEffect, useRef } from "react";

export function HeroVisual() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Simple parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPercent = (clientX / innerWidth - 0.5) * 20;
      const yPercent = (clientY / innerHeight - 0.5) * 20;

      svgRef.current.style.transform = `translate(${xPercent}px, ${yPercent}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto" data-decorative="true">
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto transition-transform duration-300 ease-out"
        aria-hidden="true"
      >
        {/* Outer ring */}
        <circle
          cx="200"
          cy="200"
          r="180"
          stroke="var(--accent-primary)"
          strokeWidth="1"
          strokeOpacity="0.2"
          fill="none"
        />

        {/* Middle ring */}
        <circle
          cx="200"
          cy="200"
          r="140"
          stroke="var(--accent-primary)"
          strokeWidth="1"
          strokeOpacity="0.3"
          fill="none"
          strokeDasharray="8 4"
        />

        {/* Inner ring with glow */}
        <circle
          cx="200"
          cy="200"
          r="100"
          stroke="var(--accent-primary)"
          strokeWidth="2"
          strokeOpacity="0.5"
          fill="none"
        />

        {/* Center glow */}
        <circle
          cx="200"
          cy="200"
          r="60"
          fill="url(#centerGlow)"
        />

        {/* Orbital dots - representing learning nodes */}
        <g className="animate-[spin_20s_linear_infinite]" style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="20" r="6" fill="var(--accent-primary)" />
          <circle cx="380" cy="200" r="4" fill="var(--accent-primary)" fillOpacity="0.6" />
          <circle cx="200" cy="380" r="5" fill="var(--accent-primary)" fillOpacity="0.8" />
          <circle cx="20" cy="200" r="4" fill="var(--accent-primary)" fillOpacity="0.5" />
        </g>

        {/* Connecting lines */}
        <g stroke="var(--accent-primary)" strokeWidth="1" strokeOpacity="0.15">
          <line x1="200" y1="20" x2="200" y2="140" />
          <line x1="380" y1="200" x2="260" y2="200" />
          <line x1="200" y1="380" x2="200" y2="260" />
          <line x1="20" y1="200" x2="140" y2="200" />
        </g>

        {/* Progress arc - represents learning progress */}
        <path
          d="M 200 60 A 140 140 0 0 1 340 200"
          stroke="var(--accent-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          className="animate-[dash_3s_ease-in-out_infinite]"
          strokeDasharray="220"
          strokeDashoffset="0"
        />

        {/* Inner geometric shape */}
        <polygon
          points="200,120 260,180 240,260 160,260 140,180"
          fill="var(--accent-primary)"
          fillOpacity="0.1"
          stroke="var(--accent-primary)"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Center icon - brain/learning symbol */}
        <g transform="translate(175, 175)">
          <path
            d="M25 10c-8.284 0-15 6.716-15 15 0 5.523 3.006 10.347 7.5 12.93V45h15v-7.07c4.494-2.583 7.5-7.407 7.5-12.93 0-8.284-6.716-15-15-15z"
            fill="var(--accent-primary)"
            fillOpacity="0.3"
          />
          <circle cx="25" cy="25" r="8" fill="var(--accent-primary)" />
        </g>

        {/* Floating particles */}
        <g fillOpacity="0.4">
          <circle cx="80" cy="80" r="2" fill="var(--accent-primary)">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="320" cy="100" r="2" fill="var(--accent-primary)">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="300" r="2" fill="var(--accent-primary)">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="300" cy="320" r="2" fill="var(--accent-primary)">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Gradient definitions */}
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Ambient glow behind SVG */}
      <div
        className="absolute inset-0 -z-10 blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }}
      />
    </div>
  );
}
