import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { Browser } from 'puppeteer';
import * as cheerio from 'cheerio';

// Browser instance for reuse
let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });
  }
  return browser;
}

interface ScrapeRequest {
  url: string;
  selector?: string;
  waitFor?: string;
  javascript?: boolean;
  timeout?: number;
  extractType?: 'text' | 'html' | 'attribute';
  attribute?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ScrapeRequest = await request.json();
    const { 
      url, 
      selector, 
      waitFor = 'domcontentloaded', 
      javascript = true,
      timeout = 30000,
      extractType = 'text',
      attribute,
    } = body;

    // Validate URL
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    if (javascript) {
      // Use Puppeteer for JavaScript-rendered pages
      const browser = await getBrowser();
      const page = await browser.newPage();

      try {
        // Set reasonable viewport
        await page.setViewport({ width: 1280, height: 800 });

        // Set user agent
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        // Navigate to URL
        await page.goto(url, {
          waitUntil: waitFor as 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2',
          timeout,
        });

        let data: any;

        if (selector) {
          // Extract specific elements
          data = await page.evaluate((sel, type, attr) => {
            const elements = document.querySelectorAll(sel);
            return Array.from(elements).map((el) => {
              if (type === 'html') return el.outerHTML;
              if (type === 'attribute' && attr) return el.getAttribute(attr);
              return el.textContent?.trim() || '';
            });
          }, selector, extractType, attribute);
        } else {
          // Extract page metadata and content
          data = await page.evaluate(() => {
            return {
              title: document.title,
              description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
              h1: Array.from(document.querySelectorAll('h1')).map(el => el.textContent?.trim()),
              links: Array.from(document.querySelectorAll('a[href]')).slice(0, 50).map(el => ({
                text: el.textContent?.trim(),
                href: el.getAttribute('href'),
              })),
              images: Array.from(document.querySelectorAll('img[src]')).slice(0, 20).map(el => ({
                alt: el.getAttribute('alt'),
                src: el.getAttribute('src'),
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
            method: 'puppeteer',
            timestamp: new Date().toISOString(),
          },
        });

      } catch (error) {
        await page.close();
        throw error;
      }

    } else {
      // Use Cheerio for static HTML (faster)
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      const html = await response.text();
      const $ = cheerio.load(html);

      let data: any;

      if (selector) {
        data = $(selector).map((_, el) => {
          if (extractType === 'html') return $.html(el);
          if (extractType === 'attribute' && attribute) return $(el).attr(attribute);
          return $(el).text().trim();
        }).get();
      } else {
        data = {
          title: $('title').text(),
          description: $('meta[name="description"]').attr('content') || '',
          h1: $('h1').map((_, el) => $(el).text().trim()).get(),
          links: $('a[href]').slice(0, 50).map((_, el) => ({
            text: $(el).text().trim(),
            href: $(el).attr('href'),
          })).get(),
          images: $('img[src]').slice(0, 20).map((_, el) => ({
            alt: $(el).attr('alt'),
            src: $(el).attr('src'),
          })).get(),
        };
      }

      return NextResponse.json({
        success: true,
        data,
        meta: {
          url,
          selector: selector || null,
          method: 'cheerio',
          timestamp: new Date().toISOString(),
        },
      });
    }

  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to scrape URL' 
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoints: {
      'POST /api/scrape': {
        description: 'Scrape a web page',
        body: {
          url: 'string (required) - Target URL',
          selector: 'string (optional) - CSS selector',
          waitFor: 'string (optional) - Wait condition: load, domcontentloaded, networkidle0, networkidle2',
          javascript: 'boolean (optional, default: true) - Enable JavaScript rendering',
          timeout: 'number (optional, default: 30000) - Timeout in ms',
          extractType: 'string (optional) - text, html, or attribute',
          attribute: 'string (optional) - Attribute name when extractType is attribute',
        },
      },
    },
  });
}
