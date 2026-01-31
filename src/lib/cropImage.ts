import { IC_WIDTH, IC_HEIGHT, MAX_FILE_SIZE } from "./constants";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function getCroppedImage(
  imageSrc: string,
  cropArea: CropArea,
): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = IC_WIDTH;
  canvas.height = IC_HEIGHT;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    IC_WIDTH,
    IC_HEIGHT,
  );

  const pngBlob = await canvasToBlob(canvas, "image/png");
  if (pngBlob.size <= MAX_FILE_SIZE) return pngBlob;

  for (const quality of [0.92, 0.85, 0.75, 0.6]) {
    const jpegBlob = await canvasToBlob(canvas, "image/jpeg", quality);
    if (jpegBlob.size <= MAX_FILE_SIZE) return jpegBlob;
  }

  return canvasToBlob(canvas, "image/jpeg", 0.5);
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))),
      type,
      quality,
    );
  });
}
