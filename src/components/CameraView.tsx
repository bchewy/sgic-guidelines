"use client";

import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import FaceGuide from "./FaceGuide";

interface CameraViewProps {
  onCapture: (dataUrl: string) => void;
  onError: () => void;
}

export default function CameraView({ onCapture, onError }: CameraViewProps) {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [ready, setReady] = useState(false);

  const capture = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) onCapture(screenshot);
  }, [onCapture]);

  const flip = () =>
    setFacingMode((m) => (m === "environment" ? "user" : "environment"));

  return (
    <div className="relative flex flex-1 flex-col items-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: "400/514" }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          mirrored={false}
          videoConstraints={{ facingMode, width: { ideal: 1280 }, height: { ideal: 1644 } }}
          className="h-full w-full object-cover"
          onUserMedia={() => setReady(true)}
          onUserMediaError={() => onError()}
        />
        {ready && <FaceGuide />}
      </div>

      <div className="mt-6 flex items-center gap-6">
        <button onClick={flip} className="rounded-full bg-gray-200 p-3 active:bg-gray-300" aria-label="Flip camera">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z" />
          </svg>
        </button>
        <button
          onClick={capture}
          disabled={!ready}
          className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white bg-white shadow-lg active:bg-gray-100 disabled:opacity-40"
          aria-label="Take photo"
        >
          <div className="h-14 w-14 rounded-full bg-blue-600" />
        </button>
        <div className="w-12" />
      </div>
    </div>
  );
}
