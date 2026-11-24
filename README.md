# Somewhere Between Then & Now

A cinematic, interactive friendship apology website dedicated to **MONIKA**.

Built with React, Vite, Framer Motion, Lucide React, and an Express backend for WhatsApp Business Cloud API integration (with a transparent `wa.me` fallback).

---

## Project Structure

```text
moni/
├── public/
│   └── assets/
│       ├── elder-wand.png
│       ├── september-canteen.jpg
│       ├── midnight-calls.jpg
│       ├── distance-platform.jpg
│       ├── memory-book.jpg
│       ├── cinematic-road.jpg
│       └── final-sunset.jpg
├── src/
│   ├── components/
│   │   ├── IntroAnimation.jsx
│   │   ├── StorySection.jsx
│   │   ├── MemorySection.jsx
│   │   ├── ApologySection.jsx
│   │   ├── AdventureSection.jsx
│   │   ├── FinalQuestion.jsx
│   │   ├── AudioPlayer.jsx
│   │   ├── SceneProgress.jsx
│   │   └── ParticleField.jsx
│   ├── services/
│   │   └── whatsappService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   └── whatsapp.js
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Installation & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in your credentials if you want automatic WhatsApp Cloud API delivery:
   ```bash
   cp .env.example .env
   ```

3. **Run the frontend (Vite):**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`.

4. **Run the backend server (in a second terminal):**
   ```bash
   npm run server
   ```
   Runs at `http://localhost:3001`. Vite proxies `/api/*` requests to `http://localhost:3001`.

---

## WhatsApp Business Cloud API Setup

1. Go to [Meta for Developers](https://developers.facebook.com/) and create an app with the **WhatsApp** product.
2. In **WhatsApp → API Setup**, copy:
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN` (use a permanent System User token for production)
3. Set `WHATSAPP_RECIPIENT_NUMBER=918072935820` in `.env`.
4. **24-Hour Window & Templates:**
   - If the recipient has messaged your WhatsApp Business number within the last 24 hours, leave `WHATSAPP_TEMPLATE_NAME` empty to send a standard text message.
   - Outside a 24-hour window, configure an approved WhatsApp message template with a single `{{1}}` body variable and set `WHATSAPP_TEMPLATE_NAME` and `WHATSAPP_TEMPLATE_LANG` in `.env`.
5. **Fallback Behavior:**
   - If Cloud API credentials are not configured or the backend is unreachable, the app **never** claims an automatic message was sent. Instead, it presents a clear `wa.me` link pre-filled with the selected response and instructs the visitor to press **Send** in WhatsApp.

---

## Production Build & Deployment

1. **Build the frontend:**
   ```bash
   npm run build
   ```
   Outputs static assets to `dist/`.

2. **Deploy:**
   - **Frontend (`dist/`)**: Deploy to Vercel, Netlify, or Cloudflare Pages.
   - **Backend (`server/whatsapp.js`)**: Deploy to Render, Railway, or Fly.io with the `.env` variables configured. If deploying frontend and backend on different origins, set `CLIENT_ORIGIN` on the backend and configure `/api` rewrites/proxying accordingly.

