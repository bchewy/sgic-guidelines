"use client";

const LABELS = ["Capture", "Crop", "Review"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {LABELS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
              i <= current
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {i + 1}
          </div>
          <span
            className={`text-sm ${
              i === current ? "font-medium text-gray-900" : "text-gray-400"
            }`}
          >
            {label}
          </span>
          {i < LABELS.length - 1 && (
            <div className={`h-px w-6 ${i < current ? "bg-blue-600" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
