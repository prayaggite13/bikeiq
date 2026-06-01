# BikeIQ 🏍️ — India's Smartest 2-Wheeler Platform

> Search, compare, and get AI insights on every bike and scooter in India.

## Features
- 🔍 Search any bike — specs, variants, city prices
- ⚖️ Compare up to 3 bikes side by side with AI verdict
- ⚡ EV features — range check, subsidy calculator, charging cost
- 💰 Ownership cost calculator — true 3-5 year cost
- 🧭 Commute Finder — AI picks the best bike for your commute
- 📰 Live news feed — latest launches, reviews, EV news
- 🤖 AI Chat assistant — ask anything about bikes
- ❤️ Save bikes to watchlist

## Tech Stack
- React (frontend)
- Vercel (hosting)
- Google Gemini API (AI features)
- GNews API (news feed)
- Supabase (watchlist + price alerts)

---

## Setup Instructions

### 1. Clone and install
```bash
git clone https://github.com/yourusername/bikeiq.git
cd bikeiq
npm install
```

### 2. Set up environment variables
Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```

```
REACT_APP_GEMINI_API_KEY=your_key
REACT_APP_GNEWS_API_KEY=your_key
REACT_APP_SUPABASE_URL=your_url
REACT_APP_SUPABASE_ANON_KEY=your_key
```

### 3. Set up Supabase tables
- Go to your Supabase dashboard
- Click **SQL Editor** → **New Query**
- Paste contents of `supabase_setup.sql`
- Click **Run**

### 4. Run locally
```bash
npm start
```
Opens at http://localhost:3000

### 5. Deploy to Vercel

**Option A: Via GitHub (recommended)**
1. Push code to GitHub
2. Go to vercel.com → New Project → Import your repo
3. Add environment variables in Vercel dashboard (Settings → Environment Variables)
4. Deploy ✅

**Option B: Via Vercel CLI**
```bash
npm install -g vercel
vercel
# Follow prompts, add env vars when asked
```

---

## Adding Env Variables in Vercel
Go to: Project → Settings → Environment Variables
Add each key from your .env file

---

## Folder Structure
```
bikeiq/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── BottomNav.js
│   │   └── BikeCard.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── SearchPage.js
│   │   ├── BikeDetailPage.js
│   │   ├── ComparePage.js
│   │   ├── WatchlistPage.js
│   │   ├── NewsPage.js
│   │   ├── AIPage.js
│   │   ├── CommuteFinderPage.js
│   │   └── OwnershipPage.js
│   ├── utils/
│   │   ├── gemini.js
│   │   ├── news.js
│   │   ├── supabase.js
│   │   └── calculator.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── .env               ← your keys (never commit this)
├── .env.example       ← template (safe to commit)
├── .gitignore
├── vercel.json
├── supabase_setup.sql
└── package.json
```

---

## Important Notes
- `.env` is in `.gitignore` — your keys will NOT be pushed to GitHub ✅
- Add keys manually in Vercel dashboard for production
- GNews free tier: 100 requests/day — enough for personal use
- Gemini free tier: 1500 requests/day

---

Built with ❤️ using React + Gemini AI
