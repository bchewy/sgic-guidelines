"use client";

import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { IC_ASPECT } from "@/lib/constants";
import ActionButton from "./ActionButton";

interface CropStepProps {
  imageSrc: string;
  onCrop: (croppedArea: Area) => void;
  onBack: () => void;
}

export default function CropStep({ imageSrc, onCrop, onBack }: CropStepProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative flex-1 min-h-0">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={IC_ASPECT}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="px-6 py-4">
        <label className="mb-1 block text-sm text-gray-600">Zoom</label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
      </div>

      <div className="flex gap-3 px-4 pb-6">
        <div className="w-1/3">
          <ActionButton onClick={onBack} variant="secondary">
            Back
          </ActionButton>
        </div>
        <div className="flex-1">
          <ActionButton
            onClick={() => croppedAreaPixels && onCrop(croppedAreaPixels)}
            disabled={!croppedAreaPixels}
          >
            Crop
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
