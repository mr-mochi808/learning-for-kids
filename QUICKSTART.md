# 🚀 Quick Start Guide

## Installation

```bash
# Navigate to the project directory
cd c:\Users\iwano\OneDrive\Desktop\proxyy

# Install dependencies
npm install
```

## Running Tests

Verify everything is working:

```bash
node test.js
```

You should see all tests pass with green checkmarks ✓

## Usage Methods

### 1️⃣ Using the CLI

The easiest way to crawl websites:

```bash
# Interactive mode (guided)
node cli.js crawl

# Direct command
node cli.js crawl https://example.com 20 2

# Search
node cli.js search "javascript"

# Export
node cli.js export csv results.csv

# Analyze SEO
node cli.js analyze
```

### 2️⃣ Using the JavaScript API

```javascript
const WebCrawler = require('./crawler');

// Create crawler
const crawler = new WebCrawler({
  startUrls: ['https://example.com'],
  maxPages: 50,
  maxDepth: 2
});

// Run crawl
const results = await crawler.crawl();

// Search
const searchResults = crawler.search('your query');

// Save
crawler.saveIndex('my-index.json');
```

### 3️⃣ Using Advanced Features

```javascript
const AdvancedCrawler = require('./advanced-crawler');

const crawler = new AdvancedCrawler({
  startUrls: ['https://example.com'],
  maxPages: 50,
  maxDepth: 2
});

// Add URL filters
crawler.addFilter('/blog/');
crawler.addFilter(/\.pdf$/);

// Run crawl
await crawler.crawl();

// Get metrics
console.log(crawler.getMetrics());

// Export in multiple formats
const json = crawler.exportAs('json');
const csv = crawler.exportAs('csv');
const xml = crawler.exportAs('xml');
```

### 4️⃣ Using the Web Dashboard

Open `index.html` in your browser to use the visual interface with:
- Configuration controls
- Real-time statistics
- Search functionality
- Results display

## Common Tasks

### Task 1: Crawl a Simple Website

```bash
node cli.js crawl https://example.com 30 2
```

Then search and export:
```bash
node cli.js search "your keyword"
node cli.js export json results.json
```

### Task 2: Crawl Multiple Sites

```javascript
const WebCrawler = require('./crawler');

const crawler = new WebCrawler({
  startUrls: [
    'https://example1.com',
    'https://example2.com',
    'https://example3.com'
  ],
  maxPages: 100,
  maxDepth: 1
});

await crawler.crawl();
```

### Task 3: Search Indexed Content

```javascript
const crawler = require('./crawler');
const fs = require('fs');

// Load existing index
const data = JSON.parse(fs.readFileSync('index.json', 'utf-8'));
const crawler = new (require('./crawler'))();
crawler.index = data.pages;

// Search
const results = crawler.search('javascript');
console.log(results);
```

### Task 4: Analyze SEO

```javascript
const AdvancedCrawler = require('./advanced-crawler');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('index.json', 'utf-8'));
const crawler = new AdvancedCrawler();
crawler.index = data.pages;

// Analyze each page
crawler.index.forEach(page => {
  const analysis = crawler.analyzeSEO(page);
  console.log(analysis);
});
```

## File Structure

```
proxyy/
├── index.html              # Web dashboard interface
├── package.json            # Dependencies
├── crawler.js              # Main crawler engine
├── advanced-crawler.js     # Extended features
├── cli.js                  # Command-line tool
├── examples.js             # Usage examples
├── test.js                 # Test suite
├── README.md               # Full documentation
└── QUICKSTART.md           # This file
```

## Features Overview

✅ **Intelligent Crawling** - Respects robots.txt and ethical guidelines
✅ **Content Indexing** - Captures metadata, text, images, links
✅ **Link Discovery** - Automatically finds and follows links
✅ **Search** - Relevance-based keyword search
✅ **SEO Analysis** - Page optimization metrics
✅ **Export** - JSON, CSV, XML formats
✅ **Performance** - Configurable depth, limits, timeouts
✅ **Error Handling** - Graceful error management
✅ **CLI Tool** - Easy command-line interface
✅ **Web Dashboard** - Visual interface

## Best Practices

1. **Start Small**: Test with `maxPages: 10` before scaling up
2. **Respect robots.txt**: Crawler automatically checks this
3. **Use Appropriate Delays**: Default 500ms between requests
4. **Handle Errors**: Check logs for crawl issues
5. **Monitor Resources**: Large crawls use bandwidth and CPU
6. **Filter URLs**: Use patterns to crawl only relevant pages
7. **Cache Results**: Reuse indexed data instead of re-crawling
8. **Check Terms**: Only crawl sites you have permission for

## Troubleshooting

### "npm ERR! code ERESOLVE"
```bash
npm install --legacy-peer-deps
```

### "Cannot find module 'axios'"
Make sure dependencies are installed:
```bash
npm install axios cheerio robots-parser
```

### Crawl is Hanging
- Increase the timeout value
- Check your internet connection
- Verify the target website is accessible
- Try with `maxPages: 5` to test

### Connection Refused Errors
- The website might block crawlers
- Check if the URL is correct
- Verify robots.txt allows crawling
- Try a different website

## Examples

### Example 1: Index a Blog

```javascript
const crawler = require('./crawler');

const c = new crawler({
  startUrls: ['https://myblog.com'],
  maxPages: 100,
  maxDepth: 2
});

await c.crawl();
c.saveIndex('blog-index.json');
```

### Example 2: Search All Pages

```javascript
const results = c.search('nodejs');
results.forEach(r => {
  console.log(`${r.title} - Relevance: ${r.relevance}`);
});
```

### Example 3: Export Results

```javascript
// Export as CSV
const csv = c.exportAs('csv');
require('fs').writeFileSync('results.csv', csv);

// Export as XML
const xml = c.exportAs('xml');
require('fs').writeFileSync('results.xml', xml);
```

## Performance Tips

| Setting | Fast | Balanced | Thorough |
|---------|------|----------|----------|
| timeout | 2000ms | 5000ms | 10000ms |
| maxPages | 20 | 50 | 200 |
| maxDepth | 1 | 2 | 4 |
| Speed | ⚡⚡⚡ | ⚡⚡ | ⚡ |

## Next Steps

1. Run `node test.js` to verify installation
2. Try `node cli.js crawl` for interactive mode
3. Test search with `node cli.js search "keyword"`
4. Export results with `node cli.js export json`
5. Open `index.html` in browser for visual interface
6. Read `README.md` for detailed API documentation

## Resources

- 📖 **Full Documentation**: See `README.md`
- 🧪 **Examples**: See `examples.js`
- 🧬 **Tests**: See `test.js`
- 🌐 **Dashboard**: Open `index.html`
- 🔧 **CLI Help**: `node cli.js help`

---

**Happy Crawling! 🕷️**

For issues or questions, refer to the README.md or check the test.js file for implementation examples.
