# SG IC Photo

A web app to create Singapore IC/passport-compliant photos. Capture or upload a photo, crop to the correct aspect ratio, and enhance it using AI to meet ICA (Immigration & Checkpoints Authority) photo guidelines.

## Features

- Camera capture or file upload
- Guided cropping with correct aspect ratio
- AI enhancement via Gemini to:
  - Set pure white background
  - Fix lighting and exposure
  - Remove red-eye
  - Ensure proper contrast

## Setup

```bash
npm install
cp .env.example .env.local
```

Add your Gemini API key to `.env.local`:

```
GEMINI_API_KEY=your-actual-api-key
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
- Google Gemini API (image generation)
