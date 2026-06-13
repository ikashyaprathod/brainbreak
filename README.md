# BrainBreak 🧠

> A GenAI-powered mental wellness tracker designed specifically for Indian students preparing for intense competitive exams like NEET, JEE, CUET, CAT, GATE, and UPSC.

BrainBreak helps students balance their rigorous study routines with emotional reflection, daily mood tracking, and personalized mindfulness exercises, alongside an empathetic streaming AI companion that understands the unique pressures of Indian coaching culture.

---

## 🚀 Key Features

- **Mood Logging:** Interactive emoji selection combined with a 1-10 fine-tuning scale mapping to mental states.
- **Daily Journaling:** Open-ended reflections with 500ms debounced auto-save draft functionality.
- **GenAI Stress Analysis:** Powered by NVIDIA Nemotron 3 Ultra 550B, the app analyzes entries in real-time to pinpoint stress triggers (e.g. mock test scores, syllabus coverage, peer pressure) and emotional patterns.
- **AI Companion Chat:** An always-available streaming chatbot companion tailored to the student's exam type and current mood context.
- **Mindfulness Exercises:** Dynamic, AI-recommended coping exercises (breathing techniques, desk stretches, physical movement) designed to fit within tight study schedules.
- **Streak Tracking (🔥):** Celebrates consecutive days of reflection with flame animations and milestone indicators at 7, 14, 21, and 30+ days.
- **Strict Security:** In-memory rate limiting (max 10 reqs/minute), strict Content Security Policy, and fully sanitized inputs.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** Strict TypeScript (strict compiler flags, no implicit any)
- **Styling:** Tailwind CSS (configured with dark-mode default and calming custom violet-cyan palette)
- **UI Components:** Custom accessible layouts using Radix UI/shadcn patterns
- **AI Engine:** NVIDIA Nemotron 3 Ultra 550B (nemotron-3-ultra-550b-a55b) via `openai` SDK
- **Visuals/Charts:** Recharts (lazy loaded for bundle optimization)
- **State/Storage:** SSR-safe persistent Client-Side `localStorage`
- **Testing:** Jest + React Testing Library (40 strict unit and integration tests passing)

---

## 📝 Assumptions & Notes
- Uses NVIDIA NIM API with OpenAI-compatible endpoints via the `openai` npm package

---

## 🗂️ Architecture

```
Client (Browser / React Components)
  ├─ localStorage (Journals, Mood Logs, Streaks, Chats)
  └─ API Requests
       └─ Next.js Serverless API Routes
            ├─ Rate Limiting (In-memory token bucket)
            ├─ Input Sanitization & Request Validation
            └─ NVIDIA NIM SDK Integration (API Key secured server-side)
```

---

## 💻 Running Locally

### 1. Prerequisites
- Node.js v18.17+
- npm v9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
NVIDIA_API_KEY=your_nvidia_api_key_here
```
Get an API key from the NVIDIA API catalog.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build Production Bundle
To build the optimized client bundle:
```bash
npm run build
```

---

## 🧪 Testing

We have implemented a comprehensive test suite of 40 unit and integration tests covering utilities, prompt building, state hooks, and UI components.

Run all tests:
```bash
npm run test
```
This runs Jest across:
- Input sanitization & XSS prevention tests
- Timezone-resilient streak calculations
- Mood utility helpers
- Localization and date parsing
- UI Components (MoodSelector, StreakCounter, JournalCard)

---

## 🔒 Security Practices

- **Zero API Key Leakage:** The NVIDIA API is only invoked from Next.js server-side API routes. The `NVIDIA_API_KEY` is kept safe in `.env.local` and never exposed to client-side bundles.
- **Content Security Policy (CSP):** Configured strict headers in `next.config.mjs` to block XSS vector attacks.
- **Input Sanitization:** Strips HTML elements, script tags, event handler injections, and blocklists AI prompt injection sequences before forwarding payload to the NVIDIA API.
- **Session-Based Rate Limiting:** Enforces 10 requests per minute limit via server-side in-memory map.
