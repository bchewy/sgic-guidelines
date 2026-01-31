"use client";

export default function FaceGuide() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 400 514"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <mask id="guide-mask">
          <rect width="400" height="514" fill="white" />
          <ellipse cx="200" cy="220" rx="110" ry="145" fill="black" />
        </mask>
      </defs>
      <rect
        width="400"
        height="514"
        fill="rgba(0,0,0,0.4)"
        mask="url(#guide-mask)"
      />
      <ellipse
        cx="200"
        cy="220"
        rx="110"
        ry="145"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeDasharray="8 4"
      />
    </svg>
  );
}
