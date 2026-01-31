"use client";

import { useRef } from "react";
import { ACCEPTED_INPUT_TYPES } from "@/lib/constants";

interface UploadButtonProps {
  onFile: (file: File) => void;
  label?: string;
}

export default function UploadButton({
  onFile,
  label = "Upload a photo",
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-xl border-2 border-dashed border-gray-300 py-6 text-center text-gray-600 active:bg-gray-50 min-h-[48px]"
      >
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_INPUT_TYPES}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </>
  );
}
