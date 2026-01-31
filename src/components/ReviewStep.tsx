"use client";

import { useState, useMemo, useCallback } from "react";
import { IC_WIDTH, IC_HEIGHT } from "@/lib/constants";
import ActionButton from "./ActionButton";

interface ReviewStepProps {
  blob: Blob;
  onBack: () => void;
  onStartOver: () => void;
}

type EnhanceState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; enhancedUrl: string; enhancedBlob: Blob }
  | { status: "error"; message: string };

const IMG_STYLE = { width: 200, height: 200 * (IC_HEIGHT / IC_WIDTH) };

export default function ReviewStep({ blob, onBack, onStartOver }: ReviewStepProps) {
  const originalUrl = useMemo(() => URL.createObjectURL(blob), [blob]);
  const [enhance, setEnhance] = useState<EnhanceState>({ status: "idle" });
  const [selected, setSelected] = useState<"original" | "enhanced">("original");

  const activeBlob = enhance.status === "done" && selected === "enhanced"
    ? enhance.enhancedBlob
    : blob;
  const activeUrl = enhance.status === "done" && selected === "enhanced"
    ? enhance.enhancedUrl
    : originalUrl;

  const ext = activeBlob.type === "image/png" ? "png" : "jpg";
  const sizeKB = (activeBlob.size / 1024).toFixed(0);

  const download = () => {
    const a = document.createElement("a");
    a.href = activeUrl;
    a.download = `ic-photo.${ext}`;
    a.click();
  };

  const handleEnhance = useCallback(async () => {
    setEnhance({ status: "loading" });

    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setEnhance({ status: "error", message: data.error ?? "Enhancement failed" });
        return;
      }

      const enhancedDataUrl: string = data.image;
      const binaryStr = atob(enhancedDataUrl.split(",")[1]);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const mime = enhancedDataUrl.match(/^data:([^;]+)/)?.[1] ?? "image/png";
      const enhancedBlob = new Blob([bytes], { type: mime });
      const enhancedUrl = URL.createObjectURL(enhancedBlob);

      setEnhance({ status: "done", enhancedUrl, enhancedBlob });
      setSelected("enhanced");
    } catch {
      setEnhance({ status: "error", message: "Network error — could not reach enhancement service" });
    }
  }, [blob]);

  return (
    <div className="flex flex-1 flex-col items-center px-4">
      {enhance.status === "done" ? (
        <div className="mt-4 flex gap-3">
          <ImageCard
            url={originalUrl}
            label="Original"
            active={selected === "original"}
            onClick={() => setSelected("original")}
          />
          <ImageCard
            url={enhance.enhancedUrl}
            label="Enhanced"
            active={selected === "enhanced"}
            onClick={() => setSelected("enhanced")}
          />
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="Final IC photo"
            width={IC_WIDTH}
            height={IC_HEIGHT}
            className="block"
            style={IMG_STYLE}
          />
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-500">
        {IC_WIDTH}×{IC_HEIGHT}px &middot; {ext.toUpperCase()} &middot; {sizeKB} KB
        {enhance.status === "done" && (
          <span className="ml-1">
            &middot; {selected === "enhanced" ? "Enhanced" : "Original"}
          </span>
        )}
      </div>

      {enhance.status === "error" && (
        <div className="mt-3 w-full rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {enhance.message}
        </div>
      )}

      {enhance.status !== "done" && (
        <div className="mt-4 w-full">
          <ActionButton
            onClick={handleEnhance}
            variant="secondary"
            disabled={enhance.status === "loading"}
          >
            {enhance.status === "loading" ? "Enhancing…" : "Enhance with AI"}
          </ActionButton>
        </div>
      )}

      <div className="mt-auto flex w-full gap-3 pb-6 pt-4">
        <div className="w-1/3">
          <ActionButton onClick={onBack} variant="secondary">
            Re-crop
          </ActionButton>
        </div>
        <div className="flex-1">
          <ActionButton onClick={download}>Download</ActionButton>
        </div>
      </div>
      <button
        onClick={onStartOver}
        className="mb-6 text-sm text-gray-500 underline min-h-[48px]"
      >
        Start over
      </button>
    </div>
  );
}

function ImageCard({
  url,
  label,
  active,
  onClick,
}: {
  url: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`overflow-hidden rounded-xl border-2 transition-colors ${
        active ? "border-blue-600" : "border-gray-200"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={label}
        width={IC_WIDTH}
        height={IC_HEIGHT}
        className="block"
        style={{ width: 150, height: 150 * (IC_HEIGHT / IC_WIDTH) }}
      />
      <span
        className={`block py-1.5 text-center text-xs font-medium ${
          active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
