import { NextRequest, NextResponse } from 'next/server';
import type { Browser } from 'puppeteer';

// User agents list (static to avoid import issues)
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
];

const getRandomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

let browser: Browser | null = null;

async function getStealthBrowser(): Promise<Browser> {
  if (!browser) {
    // Dynamic import to avoid build issues
    const puppeteer = (await import('puppeteer-extra')).default;
    const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
    puppeteer.use(StealthPlugin());
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    });
  }
  return browser;
}

interface StealthScrapeRequest {
  url: string;
  selector?: string;
  waitFor?: string;
  timeout?: number;
  extractType?: 'text' | 'html' | 'attribute';
  attribute?: string;
  // Anti-bot options
  randomDelay?: boolean;
  humanScroll?: boolean;
  blockResources?: ('image' | 'stylesheet' | 'font' | 'media')[];
  proxy?: string;
  cookies?: { name: string; value: string; domain: string }[];
}

// Random delay between min and max ms
const randomDelay = (min: number, max: number) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

export async function POST(request: NextRequest) {
  try {
    const body: StealthScrapeRequest = await request.json();
    const { 
      url, 
      selector, 
      waitFor = 'networkidle2', 
      timeout = 30000,
      extractType = 'text',
      attribute,
      randomDelay: useRandomDelay = true,
      humanScroll = true,
      blockResources = [],
      cookies,
    } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    const browser = await getStealthBrowser();
    const page = await browser.newPage();

    try {
      // Generate random user agent
      const userAgent = getRandomUserAgent();
      await page.setUserAgent(userAgent);

      // Set random viewport
      const viewports = [
        { width: 1920, height: 1080 },
        { width: 1366, height: 768 },
        { width: 1440, height: 900 },
        { width: 1536, height: 864 },
      ];
      const viewport = viewports[Math.floor(Math.random() * viewports.length)];
      await page.setViewport(viewport);

      // Set extra headers
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      });

      // Block resources if specified
      if (blockResources.length > 0) {
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          const resourceType = req.resourceType();
          if (blockResources.includes(resourceType as any)) {
            req.abort();
          } else {
            req.continue();
          }
        });
      }

      // Set cookies if provided
      if (cookies && cookies.length > 0) {
        await page.setCookie(...cookies);
      }

      // Random delay before navigation
      if (useRandomDelay) {
        await randomDelay(500, 2000);
      }

      // Navigate
      await page.goto(url, {
        waitUntil: waitFor as 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2',
        timeout,
      });

      // Human-like scrolling
      if (humanScroll) {
        await page.evaluate(async () => {
          await new Promise<void>((resolve) => {
            let totalHeight = 0;
            const distance = 100 + Math.random() * 100;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= scrollHeight / 2) {
                clearInterval(timer);
                resolve();
              }
            }, 100 + Math.random() * 100);
          });
        });
        await randomDelay(500, 1500);
      }

      // Extract data
      let data: any;

      if (selector) {
        data = await page.evaluate((sel, type, attr) => {
          const elements = document.querySelectorAll(sel);
          return Array.from(elements).map((el) => {
            if (type === 'html') return el.outerHTML;
            if (type === 'attribute' && attr) return el.getAttribute(attr);
            return el.textContent?.trim() || '';
          });
        }, selector, extractType, attribute);
      } else {
        data = await page.evaluate(() => {
          return {
            title: document.title,
            description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
            h1: Array.from(document.querySelectorAll('h1')).map(el => el.textContent?.trim()),
            links: Array.from(document.querySelectorAll('a[href]')).slice(0, 50).map(el => ({
              text: el.textContent?.trim(),
              href: el.getAttribute('href'),
            })),
          };
        });
      }

      await page.close();

      return NextResponse.json({
        success: true,
        data,
        meta: {
          url,
          selector: selector || null,
          method: 'stealth-puppeteer',
          userAgent: userAgent,
          viewport,
          timestamp: new Date().toISOString(),
        },
      });

    } catch (error) {
      await page.close();
      throw error;
    }

  } catch (error) {
    console.error('Stealth scrape error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to scrape URL' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/scrape-stealth',
    description: 'Scrape with anti-bot bypass (stealth mode)',
    features: [
      'Puppeteer stealth plugin (bypasses bot detection)',
      'Random user agents',
      'Random viewports',
      'Human-like scrolling',
      'Random delays',
      'Resource blocking',
      'Cookie support',
    ],
    body: {
      url: 'string (required) - Target URL',
      selector: 'string (optional) - CSS selector',
      waitFor: 'string (optional) - networkidle0, networkidle2, load, domcontentloaded',
      timeout: 'number (optional, default: 30000)',
      randomDelay: 'boolean (optional, default: true) - Add random delays',
      humanScroll: 'boolean (optional, default: true) - Simulate human scrolling',
      blockResources: 'array (optional) - Block: image, stylesheet, font, media',
      cookies: 'array (optional) - [{ name, value, domain }]',
    },
  });
}
