import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const PROMPT = `You are enhancing a passport photo to meet Singapore ICA (Immigration & Checkpoints Authority) photo guidelines. The photo must comply with ISO/ICAO specifications.

Apply ONLY these adjustments:
1. BACKGROUND: Make the background pure white. Remove any shadows, gradients, or colour from the background.
2. LIGHTING: Ensure even brightness across the entire face with no harsh shadows, hotspots, or uneven illumination.
3. EXPOSURE & WHITE BALANCE: Correct exposure so the face is well-lit but not overexposed. Neutralise any colour cast so skin tones look natural.
4. RED EYE: Remove any red-eye artefacts if present.
5. SHARPNESS: Ensure the photo is clear and in sharp focus — do not over-sharpen.
6. CONTRAST: Ensure head gear or attire remains visibly dark in colour against the white background.

STRICT RULES — do NOT:
- Alter facial features, face shape, bone structure, or skin texture in any way
- Change facial expression
- Modify, add, or remove spectacles, headwear, or any accessories
- Flip, mirror, distort, or rotate the image
- Crop or change the framing — keep shoulders and hair fully visible as-is
- Add any borders, watermarks, or overlays
- Beautify, smooth skin, reshape face, or apply any cosmetic filters

The person must be completely recognisable and identical to the original. Return the enhanced photo only.`;

export async function POST(request: Request): Promise<NextResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your-api-key-here") {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  let body: { image?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { image } = body;
  if (!image || typeof image !== "string") {
    return NextResponse.json(
      { error: "Missing image in request body" },
      { status: 400 },
    );
  }

  const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json(
      { error: "Image must be a base64 data URL" },
      { status: 400 },
    );
  }

  const mimeType = match[1];
  const base64Data = match[2];

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: PROMPT },
          ],
        },
      ],
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      return NextResponse.json(
        { error: "No response from Gemini" },
        { status: 502 },
      );
    }

    for (const part of parts) {
      if (part.inlineData) {
        const outMime = part.inlineData.mimeType ?? "image/png";
        const outData = part.inlineData.data;
        return NextResponse.json({
          image: `data:${outMime};base64,${outData}`,
        });
      }
    }

    return NextResponse.json(
      { error: "Gemini did not return an image" },
      { status: 502 },
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error calling Gemini";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
