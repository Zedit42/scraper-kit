'use client';

import { useState, useEffect } from 'react';
import { Play, Loader2, Download, Wand2, BookOpen, Search, Settings, ChevronRight, Sparkles, Key, Zap, Shield } from 'lucide-react';
import { recipes, categories, Recipe, searchRecipes } from '@/lib/recipes';

interface ScrapeResult {
  success: boolean;
  data?: any;
  error?: string;
  timing?: number;
}

type TabType = 'scrape' | 'ai' | 'recipes' | 'settings';

export default function Home() {
  const [url, setUrl] = useState('');
  const [selector, setSelector] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('scrape');
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedSelector, setGeneratedSelector] = useState('');
  
  const [recipeSearch, setRecipeSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'groq' | 'openai'>('groq');
  const [stealthMode, setStealthMode] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('scraper-kit-api-key');
    const savedProvider = localStorage.getItem('scraper-kit-provider') as 'groq' | 'openai';
    if (savedKey) setApiKey(savedKey);
    if (savedProvider) setProvider(savedProvider);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('scraper-kit-api-key', apiKey);
    localStorage.setItem('scraper-kit-provider', provider);
    alert('Saved!');
  };

  const handleScrape = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    
    try {
      const startTime = Date.now();
      const endpoint = stealthMode ? '/api/scrape-stealth' : '/api/scrape';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, selector, ...(stealthMode && { randomDelay: true, humanScroll: true }) }),
      });
      const data = await res.json();
      setResult({ ...data, timing: Date.now() - startTime });
    } catch {
      setResult({ success: false, error: 'Something went wrong. Check the URL.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!url || !aiPrompt) return;
    setAiLoading(true);
    setGeneratedSelector('');
    
    try {
      const res = await fetch('/api/ai-selector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, prompt: aiPrompt, apiKey: apiKey || undefined, provider }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedSelector(data.selector);
        setSelector(data.selector);
      } else {
        alert(data.error || 'Failed');
      }
    } catch {
      alert('Failed to generate selector');
    } finally {
      setAiLoading(false);
    }
  };

  const useRecipe = (recipe: Recipe) => {
    setUrl(recipe.url);
    setSelector(recipe.selector);
    setActiveTab('scrape');
  };

  const filteredRecipes = recipeSearch 
    ? searchRecipes(recipeSearch)
    : selectedCategory 
      ? recipes.filter(r => r.category === selectedCategory)
      : recipes;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header - more minimal */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-lg">scraper kit</span>
          </div>
          <div className="text-sm text-white/50">
            {recipes.length} scrapers included
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero - more personality */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Stop writing <span className="text-yellow-400">scrapers</span><br />
            from scratch.
          </h1>
          <p className="text-xl text-white/60 max-w-xl">
            50+ ready-to-use recipes. AI selector generation. 
            Anti-bot bypass. Ship faster.
          </p>
        </div>

        {/* Tabs - pill style */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit mb-8">
          {[
            { id: 'scrape', label: 'Scrape' },
            { id: 'ai', label: 'AI Magic ✨' },
            { id: 'recipes', label: 'Recipes' },
            { id: 'settings', label: '⚙️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-black' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Scrape Tab */}
          {activeTab === 'scrape' && (
            <>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm text-white/40 mb-2">URL to scrape</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/40 mb-2">CSS Selector (optional)</label>
                  <input
                    type="text"
                    value={selector}
                    onChange={(e) => setSelector(e.target.value)}
                    placeholder="h1, .title, article > p"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors font-mono text-sm"
                  />
                </div>
              </div>

              {/* Quick picks */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-white/40">Try:</span>
                {[
                  { name: 'Hacker News', url: 'https://news.ycombinator.com', selector: '.titleline > a' },
                  { name: 'GitHub Trending', url: 'https://github.com/trending', selector: 'h2.h3 a' },
                  { name: 'Reddit', url: 'https://old.reddit.com/r/programming', selector: 'a.title' },
                ].map((ex) => (
                  <button
                    key={ex.name}
                    onClick={() => { setUrl(ex.url); setSelector(ex.selector); }}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-white/70 hover:text-white transition-all"
                  >
                    {ex.name}
                  </button>
                ))}
              </div>

              {/* Stealth toggle */}
              <div 
                onClick={() => setStealthMode(!stealthMode)}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                  stealthMode 
                    ? 'bg-orange-500/10 border border-orange-500/30' 
                    : 'bg-white/5 border border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shield className={`w-5 h-5 ${stealthMode ? 'text-orange-400' : 'text-white/40'}`} />
                  <div>
                    <div className={`font-medium ${stealthMode ? 'text-orange-400' : 'text-white/70'}`}>
                      Stealth Mode {stealthMode && '· ON'}
                    </div>
                    <div className="text-sm text-white/40">Bypass Cloudflare & bot detection</div>
                  </div>
                </div>
                <div className={`w-10 h-6 rounded-full transition-colors ${stealthMode ? 'bg-orange-500' : 'bg-white/20'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${stealthMode ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </div>

              {/* Scrape button */}
              <button
                onClick={handleScrape}
                disabled={loading || !url}
                className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 disabled:bg-white/10 disabled:text-white/30 text-black font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Scraping...</>
                ) : (
                  <><Play className="w-5 h-5" /> Scrape it</>
                )}
              </button>

              {/* Results */}
              {result && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${result.success ? 'bg-green-400' : 'bg-red-400'}`} />
                      <span className="text-sm text-white/60">
                        {result.success ? `Done in ${result.timing}ms` : 'Failed'}
                      </span>
                    </div>
                    {result.success && (
                      <button 
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'data.json';
                          a.click();
                        }}
                        className="flex items-center gap-1 text-sm text-white/40 hover:text-white"
                      >
                        <Download className="w-4 h-4" /> Export
                      </button>
                    )}
                  </div>
                  <pre className={`p-4 rounded-xl overflow-auto max-h-80 text-sm font-mono ${
                    result.success ? 'bg-white/5 text-white/80' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {result.success ? JSON.stringify(result.data, null, 2) : result.error}
                  </pre>
                </div>
              )}
            </>
          )}

          {/* AI Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-purple-400 font-medium mb-1">
                  <Sparkles className="w-4 h-4" />
                  Don't know CSS selectors?
                </div>
                <p className="text-sm text-white/50">
                  Just describe what you want to extract. AI figures out the selector.
                </p>
              </div>

              <div>
                <label className="block text-sm text-white/40 mb-2">URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-400/50 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-white/40 mb-2">What do you want?</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., all article titles, product prices, user comments..."
                  rows={2}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-400/50 resize-none"
                />
              </div>

              <button
                onClick={handleAIGenerate}
                disabled={aiLoading || !url || !aiPrompt}
                className="w-full py-4 bg-purple-500 hover:bg-purple-400 disabled:bg-white/10 disabled:text-white/30 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                {aiLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Thinking...</>
                ) : (
                  <><Wand2 className="w-5 h-5" /> Generate Selector</>
                )}
              </button>

              {generatedSelector && (
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="text-sm text-white/40 mb-2">Generated:</div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-black/30 rounded-lg text-green-400 font-mono text-sm">
                      {generatedSelector}
                    </code>
                    <button
                      onClick={() => setActiveTab('scrape')}
                      className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg text-sm flex items-center gap-1"
                    >
                      Use it <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recipes Tab */}
          {activeTab === 'recipes' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={recipeSearch}
                  onChange={(e) => { setRecipeSearch(e.target.value); setSelectedCategory(null); }}
                  placeholder="Search scrapers..."
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setSelectedCategory(null); setRecipeSearch(''); }}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    !selectedCategory && !recipeSearch
                      ? 'bg-yellow-400 text-black font-medium'
                      : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setRecipeSearch(''); }}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      selectedCategory === cat
                        ? 'bg-yellow-400 text-black font-medium'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
                {filteredRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => useRecipe(recipe)}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-400/30 rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{recipe.icon}</span>
                      <span className="font-medium text-white/90 group-hover:text-yellow-400 text-sm truncate">
                        {recipe.name}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 truncate">{recipe.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-white/70">
                  <Key className="w-4 h-4" />
                  <span className="font-medium">AI Provider</span>
                </div>
                
                <div>
                  <label className="block text-sm text-white/40 mb-2">Provider</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as 'groq' | 'openai')}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none"
                  >
                    <option value="groq">Groq (free, fast)</option>
                    <option value="openai">OpenAI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/40 mb-2">API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={provider === 'groq' ? 'gsk_...' : 'sk-...'}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none font-mono text-sm"
                  />
                </div>

                <button
                  onClick={saveSettings}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
                >
                  Save
                </button>
              </div>

              <div className="text-sm text-white/30">
                <p>Get free API keys:</p>
                <p>• <a href="https://console.groq.com" target="_blank" className="text-white/50 hover:text-white underline">console.groq.com</a> (recommended, free)</p>
                <p>• <a href="https://platform.openai.com" target="_blank" className="text-white/50 hover:text-white underline">platform.openai.com</a></p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-white/30">
          <p>Built with Next.js, Puppeteer & ☕</p>
        </footer>
      </div>
    </main>
  );
}
