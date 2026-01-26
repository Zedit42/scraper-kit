# 🕷️ Scraper Kit

> Next.js web scraping boilerplate with stealth mode, AI-powered selectors, and 40+ ready-to-use recipes.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zedit42/scraper-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Scraper Kit](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Puppeteer](https://img.shields.io/badge/Puppeteer-Stealth-green?style=flat-square)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🥷 **Stealth Mode** | Bypass Cloudflare & bot detection with puppeteer-extra-plugin-stealth |
| 🤖 **AI Selectors** | Generate CSS selectors using natural language (Groq/OpenAI) |
| 📦 **40+ Recipes** | Pre-built selectors for HN, Reddit, GitHub, Amazon, LinkedIn... |
| ⚡ **Dual Engine** | Fast Cheerio for static sites, Puppeteer for JS-rendered pages |
| 🎭 **Human Simulation** | Random user agents, viewports, delays, scroll behavior |
| 🚀 **API-First** | Clean REST endpoints ready for any integration |
| 🍪 **Cookie Support** | Session persistence for authenticated scraping |
| 🛡️ **Resource Blocking** | Block images/CSS/fonts to speed up scraping |

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/zedit42/scraper-kit.git
cd scraper-kit

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📡 API Endpoints

### 1. Basic Scrape - `POST /api/scrape`

Standard scraping with Puppeteer or Cheerio.

```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://news.ycombinator.com",
    "selector": ".titleline > a",
    "javascript": false
  }'
```

**Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `url` | string | required | Target URL |
| `selector` | string | optional | CSS selector (returns full page metadata if empty) |
| `javascript` | boolean | `true` | Enable JS rendering (Puppeteer vs Cheerio) |
| `waitFor` | string | `domcontentloaded` | Wait condition |
| `timeout` | number | `30000` | Timeout in ms |
| `extractType` | string | `text` | `text`, `html`, or `attribute` |
| `attribute` | string | optional | Attribute name when extractType is `attribute` |

---

### 2. Stealth Scrape - `POST /api/scrape-stealth`

Anti-bot bypass with fingerprint randomization.

```bash
curl -X POST http://localhost:3000/api/scrape-stealth \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/protected-page",
    "selector": ".content",
    "humanScroll": true,
    "randomDelay": true
  }'
```

**Extra Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `randomDelay` | boolean | `true` | Add random delays between actions |
| `humanScroll` | boolean | `true` | Simulate human-like scrolling |
| `blockResources` | array | `[]` | Block: `image`, `stylesheet`, `font`, `media` |
| `cookies` | array | optional | `[{ name, value, domain }]` |

**What makes it stealthy:**
- ✅ puppeteer-extra-plugin-stealth (passes all bot tests)
- ✅ Random user agents per request
- ✅ Random viewport sizes
- ✅ Human-like scroll patterns
- ✅ Random delays (500-2000ms)
- ✅ Proper HTTP headers

---

### 3. AI Selector - `POST /api/ai-selector`

Generate CSS selectors with natural language.

```bash
curl -X POST http://localhost:3000/api/ai-selector \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://news.ycombinator.com",
    "prompt": "Extract all article titles"
  }'
```

**Response:**
```json
{
  "success": true,
  "selector": ".titleline > a",
  "provider": "groq",
  "prompt": "Extract all article titles"
}
```

**Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `url` | string | optional | URL to analyze |
| `prompt` | string | required | What to extract |
| `html` | string | optional | Provide HTML directly |
| `provider` | string | `groq` | `groq`, `openai`, or `anthropic` |
| `apiKey` | string | optional | Your API key |

**Environment Variables:**
```env
GROQ_API_KEY=your_groq_key  # Free tier available!
```

---

## 📚 Recipe System

40+ pre-built selectors for popular sites. Use them as starting points!

### Categories

| Category | Sites |
|----------|-------|
| 📰 **News** | Hacker News, Reddit, TechCrunch, BBC |
| 👨‍💻 **Developer** | GitHub Trending, NPM, Stack Overflow, Dev.to |
| 🚀 **Products** | Product Hunt, Indie Hackers, BetaList |
| 🛒 **E-commerce** | Amazon, eBay, Etsy |
| 💼 **Jobs** | LinkedIn, Indeed, Remote OK, We Work Remotely |
| 💰 **Finance** | CoinMarketCap, CoinGecko, Yahoo Finance |
| 🐦 **Social** | Twitter/X Trends, YouTube Trending |
| 🏠 **Real Estate** | Zillow |
| ✈️ **Travel** | TripAdvisor, Booking.com |
| 🍳 **Food** | AllRecipes, Yelp |
| 🎓 **Education** | Coursera, Udemy |
| 🤗 **AI/ML** | HuggingFace, Papers With Code, arXiv |

### Using Recipes

```javascript
// In your code
import { recipes, searchRecipes, getRecipesByCategory } from '@/lib/recipes';

// Get all developer recipes
const devRecipes = getRecipesByCategory('Developer');

// Search recipes
const results = searchRecipes('github');

// Use a recipe
const recipe = recipes.find(r => r.id === 'hacker-news');
// { url, selector, javascript, ... }
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Scraping:** Puppeteer + Cheerio
- **Stealth:** puppeteer-extra-plugin-stealth
- **AI:** Groq (Llama 3.1), OpenAI (GPT-4o-mini)
- **Styling:** Tailwind CSS

---

## 📁 Project Structure

```
scraper-kit/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── scrape/          # Basic scraping endpoint
│   │   │   ├── scrape-stealth/  # Stealth mode endpoint
│   │   │   └── ai-selector/     # AI selector generation
│   │   ├── page.tsx             # Demo UI
│   │   └── layout.tsx
│   └── lib/
│       └── recipes.ts           # 40+ pre-built recipes
├── public/
├── package.json
└── README.md
```

---

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zedit42/scraper-kit)

> ⚠️ Note: Puppeteer works on Vercel with some limitations. For heavy scraping, consider a VPS.

### Docker

```dockerfile
FROM node:20-slim

RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Self-hosted

```bash
npm run build
npm start
```

---

## 💡 Use Cases

- **Price Monitoring** - Track competitor prices
- **Lead Generation** - Scrape business directories
- **Content Aggregation** - Build news readers
- **Job Boards** - Aggregate remote jobs
- **Research** - Collect academic papers
- **SEO Analysis** - Extract competitor metadata
- **Social Listening** - Monitor trends

---

## ⚖️ Legal Notice

Web scraping legality varies by jurisdiction. Always:
- ✅ Check the site's `robots.txt`
- ✅ Respect rate limits
- ✅ Don't scrape personal data without consent
- ✅ Review Terms of Service

This tool is for **educational purposes**. Use responsibly.

---

## 🤝 Support

- 📧 Email: yigit@example.com
- 🐦 Twitter: [@zedit42](https://twitter.com/zedit42)
- 💬 Discord: [Join Server](#)

---

## 📄 License

MIT License - Use it, modify it, sell it. Just don't blame me if something breaks! 😄

---

**Made with ⚡ by [@zedit42](https://github.com/zedit42)**
