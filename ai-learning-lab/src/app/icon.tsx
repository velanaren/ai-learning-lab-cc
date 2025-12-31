import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="iconGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D09C" />
              <stop offset="100%" stopColor="#00FFB3" />
            </linearGradient>
          </defs>

          <circle cx="24" cy="24" r="24" fill="url(#iconGradient)" />

          {/* Simplified neural pattern for favicon */}
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
      </div>
    ),
    {
      ...size,
    }
  );
}
