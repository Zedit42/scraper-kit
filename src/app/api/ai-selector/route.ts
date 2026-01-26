import { NextRequest, NextResponse } from 'next/server';

interface AIRequest {
  url: string;
  prompt: string;
  html?: string;
  apiKey?: string;
  provider?: 'groq' | 'openai' | 'anthropic';
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_GROQ_KEY = process.env.GROQ_API_KEY || '';

async function generateWithGroq(prompt: string, html: string, apiKey: string) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a web scraping expert. Given HTML content and a user request, generate the most accurate CSS selector to extract the requested data. 
          
Rules:
- Return ONLY the CSS selector, nothing else
- Use specific selectors that won't break easily
- Prefer class names over tag hierarchies when stable
- Test multiple approaches mentally and pick the most robust one
- If multiple elements match, that's okay if user wants a list`,
        },
        {
          role: 'user',
          content: `HTML (truncated to first 15000 chars):
\`\`\`html
${html.slice(0, 15000)}
\`\`\`

User request: "${prompt}"

Return ONLY the CSS selector:`,
        },
      ],
      temperature: 0.1,
      max_tokens: 100,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || '';
}

async function generateWithOpenAI(prompt: string, html: string, apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a web scraping expert. Given HTML content and a user request, generate the most accurate CSS selector. Return ONLY the selector.`,
        },
        {
          role: 'user',
          content: `HTML:\n${html.slice(0, 15000)}\n\nRequest: "${prompt}"\n\nCSS Selector:`,
        },
      ],
      temperature: 0.1,
      max_tokens: 100,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API error');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || '';
}

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json();
    const { url, prompt, html: providedHtml, apiKey, provider = 'groq' } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Get HTML if not provided
    let html = providedHtml;
    if (!html && url) {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      html = await response.text();
    }

    if (!html) {
      return NextResponse.json(
        { success: false, error: 'URL or HTML content is required' },
        { status: 400 }
      );
    }

    let selector = '';
    const key = apiKey || DEFAULT_GROQ_KEY;

    if (!key && provider === 'groq') {
      return NextResponse.json(
        { success: false, error: 'No API key configured. Add GROQ_API_KEY to environment or provide apiKey.' },
        { status: 400 }
      );
    }

    switch (provider) {
      case 'groq':
        selector = await generateWithGroq(prompt, html, key);
        break;
      case 'openai':
        selector = await generateWithOpenAI(prompt, html, apiKey!);
        break;
      default:
        selector = await generateWithGroq(prompt, html, key);
    }

    // Clean up selector (remove quotes, backticks, etc.)
    selector = selector.replace(/^[`'"]+|[`'"]+$/g, '').trim();

    return NextResponse.json({
      success: true,
      selector,
      provider,
      prompt,
    });

  } catch (error) {
    console.error('AI Selector error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate selector' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/ai-selector',
    description: 'Generate CSS selectors using AI',
    body: {
      url: 'string - Target URL to analyze',
      prompt: 'string - What to extract (e.g., "all article titles")',
      html: 'string (optional) - Provide HTML directly instead of URL',
      apiKey: 'string (optional) - Your API key (uses default Groq if not provided)',
      provider: 'string (optional) - groq | openai | anthropic (default: groq)',
    },
    example: {
      url: 'https://news.ycombinator.com',
      prompt: 'Extract all article titles',
    },
  });
}
