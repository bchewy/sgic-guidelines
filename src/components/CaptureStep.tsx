"use client";

import { useState } from "react";
import CameraView from "./CameraView";
import UploadButton from "./UploadButton";

interface CaptureStepProps {
  onFile: (file: File) => void;
  onCapture: (dataUrl: string) => void;
}

export default function CaptureStep({ onFile, onCapture }: CaptureStepProps) {
  const [cameraFailed, setCameraFailed] = useState(false);

  return (
    <div className="flex flex-1 flex-col gap-4">
      {!cameraFailed ? (
        <>
          <CameraView onCapture={onCapture} onError={() => setCameraFailed(true)} />
          <div className="px-4 pb-6">
            <UploadButton onFile={onFile} label="Or upload a photo" />
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <p className="text-center text-gray-600">
            Camera not available. Please upload a photo instead.
          </p>
          <UploadButton onFile={onFile} />
        </div>
      )}
    </div>
  );
}
