export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  selector: string;
  extractType?: 'text' | 'html' | 'attribute';
  attribute?: string;
  javascript?: boolean;
  icon: string;
}

export const recipes: Recipe[] = [
  // News & Media
  {
    id: 'hacker-news',
    name: 'Hacker News',
    description: 'Top stories from HN',
    category: 'News',
    url: 'https://news.ycombinator.com',
    selector: '.titleline > a',
    javascript: false,
    icon: '📰',
  },
  {
    id: 'hacker-news-links',
    name: 'Hacker News Links',
    description: 'Article URLs from HN',
    category: 'News',
    url: 'https://news.ycombinator.com',
    selector: '.titleline > a',
    extractType: 'attribute',
    attribute: 'href',
    javascript: false,
    icon: '🔗',
  },
  {
    id: 'reddit-titles',
    name: 'Reddit Post Titles',
    description: 'Titles from any subreddit',
    category: 'News',
    url: 'https://old.reddit.com/r/programming',
    selector: 'a.title',
    javascript: false,
    icon: '🤖',
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch Headlines',
    description: 'Latest tech news',
    category: 'News',
    url: 'https://techcrunch.com',
    selector: 'h2 a',
    javascript: false,
    icon: '💻',
  },
  {
    id: 'bbc-news',
    name: 'BBC News Headlines',
    description: 'Top BBC stories',
    category: 'News',
    url: 'https://www.bbc.com/news',
    selector: 'h3',
    javascript: true,
    icon: '🇬🇧',
  },
  
  // Developer
  {
    id: 'github-trending',
    name: 'GitHub Trending',
    description: 'Trending repositories',
    category: 'Developer',
    url: 'https://github.com/trending',
    selector: 'h2.h3 a',
    javascript: false,
    icon: '⭐',
  },
  {
    id: 'github-trending-desc',
    name: 'GitHub Trending Descriptions',
    description: 'Repository descriptions',
    category: 'Developer',
    url: 'https://github.com/trending',
    selector: 'p.col-9',
    javascript: false,
    icon: '📝',
  },
  {
    id: 'npm-search',
    name: 'NPM Package Search',
    description: 'Search NPM packages',
    category: 'Developer',
    url: 'https://www.npmjs.com/search?q=react',
    selector: 'h3',
    javascript: true,
    icon: '📦',
  },
  {
    id: 'stackoverflow-questions',
    name: 'Stack Overflow Questions',
    description: 'Recent questions',
    category: 'Developer',
    url: 'https://stackoverflow.com/questions',
    selector: '.s-post-summary--content-title a',
    javascript: false,
    icon: '❓',
  },
  {
    id: 'dev-to-articles',
    name: 'Dev.to Articles',
    description: 'Latest dev articles',
    category: 'Developer',
    url: 'https://dev.to',
    selector: 'h2.crayons-story__title a',
    javascript: false,
    icon: '👨‍💻',
  },

  // Products & Startups
  {
    id: 'product-hunt',
    name: 'Product Hunt',
    description: "Today's top products",
    category: 'Products',
    url: 'https://www.producthunt.com',
    selector: '[data-test="post-name"]',
    javascript: true,
    icon: '🚀',
  },
  {
    id: 'indie-hackers',
    name: 'Indie Hackers',
    description: 'Latest posts',
    category: 'Products',
    url: 'https://www.indiehackers.com',
    selector: '.feed-item__title a',
    javascript: true,
    icon: '💡',
  },
  {
    id: 'betalist',
    name: 'BetaList Startups',
    description: 'New startups',
    category: 'Products',
    url: 'https://betalist.com',
    selector: 'h2 a',
    javascript: false,
    icon: '🌱',
  },

  // E-commerce (Templates - users fill in URLs)
  {
    id: 'amazon-product-title',
    name: 'Amazon Product Title',
    description: 'Product name from Amazon',
    category: 'E-commerce',
    url: 'https://www.amazon.com/dp/B0EXAMPLE',
    selector: '#productTitle',
    javascript: true,
    icon: '📦',
  },
  {
    id: 'amazon-price',
    name: 'Amazon Price',
    description: 'Product price from Amazon',
    category: 'E-commerce',
    url: 'https://www.amazon.com/dp/B0EXAMPLE',
    selector: '.a-price-whole',
    javascript: true,
    icon: '💰',
  },
  {
    id: 'ebay-listings',
    name: 'eBay Listings',
    description: 'Product listings',
    category: 'E-commerce',
    url: 'https://www.ebay.com/sch/i.html?_nkw=laptop',
    selector: '.s-item__title',
    javascript: false,
    icon: '🛒',
  },
  {
    id: 'etsy-products',
    name: 'Etsy Products',
    description: 'Handmade items',
    category: 'E-commerce',
    url: 'https://www.etsy.com/search?q=jewelry',
    selector: 'h3.v2-listing-card__title',
    javascript: true,
    icon: '🎨',
  },

  // Jobs
  {
    id: 'linkedin-jobs',
    name: 'LinkedIn Jobs',
    description: 'Job listings',
    category: 'Jobs',
    url: 'https://www.linkedin.com/jobs/search/?keywords=developer',
    selector: '.base-search-card__title',
    javascript: true,
    icon: '💼',
  },
  {
    id: 'indeed-jobs',
    name: 'Indeed Jobs',
    description: 'Job postings',
    category: 'Jobs',
    url: 'https://www.indeed.com/jobs?q=software+engineer',
    selector: 'h2.jobTitle a span',
    javascript: true,
    icon: '🔍',
  },
  {
    id: 'weworkremotely',
    name: 'We Work Remotely',
    description: 'Remote job listings',
    category: 'Jobs',
    url: 'https://weworkremotely.com/remote-jobs',
    selector: '.title',
    javascript: false,
    icon: '🏠',
  },
  {
    id: 'remoteok',
    name: 'Remote OK Jobs',
    description: 'Remote positions',
    category: 'Jobs',
    url: 'https://remoteok.com',
    selector: 'h2[itemprop="title"]',
    javascript: false,
    icon: '🌍',
  },

  // Crypto & Finance
  {
    id: 'coinmarketcap-prices',
    name: 'CoinMarketCap Prices',
    description: 'Top crypto prices',
    category: 'Finance',
    url: 'https://coinmarketcap.com',
    selector: '.cmc-table tbody tr td:nth-child(3) p',
    javascript: true,
    icon: '₿',
  },
  {
    id: 'coingecko-trending',
    name: 'CoinGecko Trending',
    description: 'Trending coins',
    category: 'Finance',
    url: 'https://www.coingecko.com',
    selector: '[data-coin-symbol]',
    extractType: 'attribute',
    attribute: 'data-coin-symbol',
    javascript: true,
    icon: '🦎',
  },
  {
    id: 'yahoo-finance',
    name: 'Yahoo Finance',
    description: 'Stock prices',
    category: 'Finance',
    url: 'https://finance.yahoo.com/trending-tickers',
    selector: 'td[aria-label="Symbol"] a',
    javascript: true,
    icon: '📈',
  },

  // Social Media
  {
    id: 'twitter-trends',
    name: 'Twitter/X Trends',
    description: 'Trending topics (requires login)',
    category: 'Social',
    url: 'https://twitter.com/explore/tabs/trending',
    selector: '[data-testid="trend"] span',
    javascript: true,
    icon: '🐦',
  },
  {
    id: 'youtube-trending',
    name: 'YouTube Trending',
    description: 'Trending videos',
    category: 'Social',
    url: 'https://www.youtube.com/feed/trending',
    selector: '#video-title',
    javascript: true,
    icon: '📺',
  },
  {
    id: 'instagram-hashtag',
    name: 'Instagram Hashtag Posts',
    description: 'Posts from hashtag (requires login)',
    category: 'Social',
    url: 'https://www.instagram.com/explore/tags/photography/',
    selector: 'article img',
    extractType: 'attribute',
    attribute: 'src',
    javascript: true,
    icon: '📷',
  },

  // Real Estate
  {
    id: 'zillow-listings',
    name: 'Zillow Listings',
    description: 'Property listings',
    category: 'Real Estate',
    url: 'https://www.zillow.com/homes/for_sale/',
    selector: 'address',
    javascript: true,
    icon: '🏠',
  },
  {
    id: 'zillow-prices',
    name: 'Zillow Prices',
    description: 'Property prices',
    category: 'Real Estate',
    url: 'https://www.zillow.com/homes/for_sale/',
    selector: '[data-test="property-card-price"]',
    javascript: true,
    icon: '💵',
  },

  // Travel
  {
    id: 'tripadvisor-reviews',
    name: 'TripAdvisor Reviews',
    description: 'Hotel/restaurant reviews',
    category: 'Travel',
    url: 'https://www.tripadvisor.com',
    selector: '.review-container p',
    javascript: true,
    icon: '✈️',
  },
  {
    id: 'booking-hotels',
    name: 'Booking.com Hotels',
    description: 'Hotel names',
    category: 'Travel',
    url: 'https://www.booking.com',
    selector: '[data-testid="title"]',
    javascript: true,
    icon: '🏨',
  },

  // Food & Recipes
  {
    id: 'allrecipes',
    name: 'AllRecipes',
    description: 'Recipe titles',
    category: 'Food',
    url: 'https://www.allrecipes.com/recipes/',
    selector: 'h3.card__title',
    javascript: false,
    icon: '🍳',
  },
  {
    id: 'yelp-restaurants',
    name: 'Yelp Restaurants',
    description: 'Restaurant listings',
    category: 'Food',
    url: 'https://www.yelp.com/search?find_desc=restaurants',
    selector: 'h3 a',
    javascript: true,
    icon: '🍕',
  },

  // Sports
  {
    id: 'espn-scores',
    name: 'ESPN Scores',
    description: 'Live scores',
    category: 'Sports',
    url: 'https://www.espn.com/soccer/scoreboard',
    selector: '.ScoreCell__TeamName',
    javascript: true,
    icon: '⚽',
  },

  // Education
  {
    id: 'coursera-courses',
    name: 'Coursera Courses',
    description: 'Course listings',
    category: 'Education',
    url: 'https://www.coursera.org/courses',
    selector: 'h2.cds-ProductCard-title',
    javascript: true,
    icon: '🎓',
  },
  {
    id: 'udemy-courses',
    name: 'Udemy Courses',
    description: 'Course names',
    category: 'Education',
    url: 'https://www.udemy.com/courses/development/',
    selector: '[data-purpose="course-title-url"]',
    javascript: true,
    icon: '📚',
  },

  // Weather
  {
    id: 'weather-com',
    name: 'Weather.com',
    description: 'Current weather',
    category: 'Weather',
    url: 'https://weather.com',
    selector: '[data-testid="TemperatureValue"]',
    javascript: true,
    icon: '🌤️',
  },

  // Government & Data
  {
    id: 'data-gov',
    name: 'Data.gov Datasets',
    description: 'Government datasets',
    category: 'Data',
    url: 'https://catalog.data.gov/dataset',
    selector: 'h3.dataset-heading a',
    javascript: false,
    icon: '🏛️',
  },

  // Books & Media
  {
    id: 'goodreads-books',
    name: 'Goodreads Books',
    description: 'Book titles',
    category: 'Books',
    url: 'https://www.goodreads.com/list/show/1.Best_Books_Ever',
    selector: 'a.bookTitle',
    javascript: false,
    icon: '📖',
  },
  {
    id: 'imdb-top',
    name: 'IMDb Top Movies',
    description: 'Top rated movies',
    category: 'Movies',
    url: 'https://www.imdb.com/chart/top/',
    selector: '.titleColumn a',
    javascript: false,
    icon: '🎬',
  },

  // Science & Research
  {
    id: 'arxiv-papers',
    name: 'arXiv Papers',
    description: 'Latest research papers',
    category: 'Science',
    url: 'https://arxiv.org/list/cs.AI/recent',
    selector: '.list-title a',
    javascript: false,
    icon: '🔬',
  },
  {
    id: 'pubmed-articles',
    name: 'PubMed Articles',
    description: 'Medical research',
    category: 'Science',
    url: 'https://pubmed.ncbi.nlm.nih.gov/?term=covid',
    selector: '.docsum-title',
    javascript: false,
    icon: '🧬',
  },

  // AI & ML
  {
    id: 'huggingface-models',
    name: 'HuggingFace Models',
    description: 'ML models',
    category: 'AI',
    url: 'https://huggingface.co/models',
    selector: 'h4 a',
    javascript: true,
    icon: '🤗',
  },
  {
    id: 'papers-with-code',
    name: 'Papers With Code',
    description: 'ML papers',
    category: 'AI',
    url: 'https://paperswithcode.com',
    selector: '.paper-card h1 a',
    javascript: false,
    icon: '📄',
  },
];

export const categories = [...new Set(recipes.map(r => r.category))];

export function getRecipesByCategory(category: string): Recipe[] {
  return recipes.filter(r => r.category === category);
}

export function searchRecipes(query: string): Recipe[] {
  const q = query.toLowerCase();
  return recipes.filter(r => 
    r.name.toLowerCase().includes(q) || 
    r.description.toLowerCase().includes(q) ||
    r.category.toLowerCase().includes(q)
  );
}
