# SG IC Photo

Web app to create Singapore IC/passport-compliant photos. Capture or upload a photo, crop to 400×514px, and optionally enhance it with Gemini AI to meet [ICA photo guidelines](https://www.ica.gov.sg/photo-guidelines).

## Flow

Capture → Crop → Review & Enhance → Download

## Features

- Camera capture or file upload (JPG, PNG, HEIC/HEIF up to 8 MB)
- Guided cropping at the correct 400×514 aspect ratio
- AI enhancement (optional) via Gemini 3 Pro Image:
  - Pure white background
  - Even lighting and correct exposure/white balance
  - Red-eye removal
  - Colour cast correction
  - Preserves facial features — no cosmetic alterations
- Side-by-side before/after comparison
- Download original or enhanced version

## Setup

```bash
npm install
```

Create `.env.local` with your [Gemini API key](https://aistudio.google.com/apikey):

```
GEMINI_API_KEY=your-api-key
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS
- Google Gemini 3 Pro Image (`@google/genai`)
