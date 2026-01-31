"use client";

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export default function ActionButton({
  onClick,
  children,
  variant = "primary",
  disabled = false,
}: ActionButtonProps) {
  const base = "w-full rounded-xl py-4 text-lg font-semibold transition-colors min-h-[48px]";
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white active:bg-blue-700 disabled:bg-blue-300"
      : "bg-gray-200 text-gray-800 active:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400";

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}
