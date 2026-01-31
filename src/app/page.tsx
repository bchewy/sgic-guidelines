"use client";

import { useState, useCallback } from "react";
import { Area } from "react-easy-crop";
import StepIndicator from "@/components/StepIndicator";
import CaptureStep from "@/components/CaptureStep";
import CropStep from "@/components/CropStep";
import ReviewStep from "@/components/ReviewStep";
import { getCroppedImage } from "@/lib/cropImage";
import { validateFile } from "@/lib/validateImage";

type Step = "CAPTURE" | "CROP" | "REVIEW";

const STEP_INDEX: Record<Step, number> = { CAPTURE: 0, CROP: 1, REVIEW: 2 };

export default function Home() {
  const [step, setStep] = useState<Step>("CAPTURE");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleImage = useCallback((src: string) => {
    setError(null);
    setImageSrc(src);
    setStep("CROP");
  }, []);

  const handleFileImage = useCallback(
    (file: File) => {
      const fileCheck = validateFile(file);
      if (!fileCheck.ok) {
        setError(fileCheck.reason);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => handleImage(reader.result as string);
      reader.readAsDataURL(file);
    },
    [handleImage],
  );

  const handleCrop = useCallback(
    async (croppedAreaPixels: Area) => {
      if (!imageSrc) return;
      setProcessing(true);
      try {
        const blob = await getCroppedImage(imageSrc, croppedAreaPixels);
        setResultBlob(blob);
        setStep("REVIEW");
      } catch {
        setError("Failed to process image. Please try again.");
      } finally {
        setProcessing(false);
      }
    },
    [imageSrc],
  );

  const startOver = () => {
    setStep("CAPTURE");
    setImageSrc(null);
    setResultBlob(null);
    setError(null);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-gray-100 px-4">
        <h1 className="text-center text-lg font-semibold py-3">SG IC Photo</h1>
        <StepIndicator current={STEP_INDEX[step]} />
      </header>

      {error && (
        <div className="mx-4 mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-medium underline">
            Dismiss
          </button>
        </div>
      )}

      <main className="flex flex-1 flex-col">
        {step === "CAPTURE" && (
          <CaptureStep onFile={handleFileImage} onCapture={handleImage} />
        )}
        {step === "CROP" && imageSrc && (
          <CropStep
            imageSrc={imageSrc}
            onCrop={handleCrop}
            onBack={() => setStep("CAPTURE")}
          />
        )}
        {step === "REVIEW" && resultBlob && (
          <ReviewStep
            blob={resultBlob}
            onBack={() => setStep("CROP")}
            onStartOver={startOver}
          />
        )}
      </main>

      {processing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="rounded-xl bg-white px-8 py-6 shadow-lg">
            <p className="text-gray-700">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}
