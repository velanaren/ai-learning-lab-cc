import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #00D09C 0%, #00FFB3 100%)",
          borderRadius: 40,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Neural network nodes */}
          <circle cx="24" cy="34" r="4" fill="#0D0D0D" />
          <circle cx="14" cy="24" r="3.5" fill="#0D0D0D" />
          <circle cx="34" cy="24" r="3.5" fill="#0D0D0D" />
          <circle cx="24" cy="14" r="5" fill="#0D0D0D" />

          {/* Connecting lines */}
          <path d="M24 30 L24 19" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 32 L16.5 26" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <path d="M28 32 L31.5 26" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <path d="M17 22 L21 16" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <path d="M31 22 L27 16" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

          {/* Inner glow on top node */}
          <circle cx="24" cy="14" r="2" fill="#00D09C" opacity="0.5" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
