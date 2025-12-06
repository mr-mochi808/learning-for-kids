# 🕷️ Web Crawler - Google-like Search Engine Crawler

A powerful, production-ready web crawler written in Node.js that mimics Google's crawling engine. It intelligently discovers, indexes, and searches web content across multiple websites.

## 📋 Features

- **🤖 Intelligent Crawling**: Respects `robots.txt`, crawl delays, and ethical web crawling practices
- **📑 Full Content Indexing**: Captures titles, descriptions, metadata, images, links, and text content
- **🔗 Automatic Link Discovery**: Follows internal links and maintains crawl depth limits
- **🔍 Smart Search**: Relevance-based searching with keyword matching and scoring
- **📊 SEO Analysis**: Analyzes page metadata, structure, and optimization metrics
- **💾 Multiple Export Formats**: JSON, CSV, and XML export capabilities
- **📈 Performance Metrics**: Detailed statistics and crawl performance tracking
- **🛡️ Error Handling**: Graceful handling of network issues, timeouts, and invalid content
- **🌐 Multi-site Crawling**: Can crawl multiple domains simultaneously
- **⚡ Configurable Performance**: Adjustable timeouts, depth limits, and page limits

## 🚀 Quick Start

### Prerequisites
- Node.js v12 or higher
- npm

### Installation

```bash
# Navigate to project directory
cd proxyy

# Install dependencies
npm install
```

### Basic Usage

```javascript
const WebCrawler = require('./crawler');

const crawler = new WebCrawler({
  startUrls: ['https://example.com'],
  maxPages: 50,
  maxDepth: 2,
  timeout: 5000
});

// Start crawling
const results = await crawler.crawl();

// Search indexed content
const searchResults = crawler.search('javascript');

// Save index to file
crawler.saveIndex('index.json');
```

## 📚 API Documentation

### WebCrawler Class

#### Constructor Options

```javascript
{
  startUrls: string[],      // URLs to start crawling from
  maxPages: number,         // Maximum pages to crawl (default: 50)
  maxDepth: number,         // Maximum crawl depth (default: 3)
  timeout: number,          // Request timeout in ms (default: 5000)
  userAgent: string         // Custom user agent
}
```

#### Methods

##### `crawl()`
Starts the crawling process.

```javascript
const results = await crawler.crawl();
```

**Returns**: `{ index: Page[], statistics: {}, errors: [] }`

---

##### `search(query: string)`
Searches indexed content by keyword.

```javascript
const results = crawler.search('web development');
```

**Returns**: `{ url: string, title: string, description: string, relevance: number }[]`

---

##### `saveIndex(filename: string)`
Saves the index to a JSON file.

```javascript
crawler.saveIndex('my-index.json');
```

---

##### `extractContent(html: string, url: string)`
Extracts structured data from HTML.

```javascript
const content = crawler.extractContent(html, url);
```

**Returns**: Page content object with metadata

---

##### `extractLinks(html: string, pageUrl: string)`
Extracts all links from HTML.

```javascript
const links = crawler.extractLinks(html, pageUrl);
```

---

### AdvancedCrawler Class

Extends `WebCrawler` with additional features.

#### Additional Methods

##### `addFilter(pattern: string | RegExp)`
Add URL filters for selective crawling.

```javascript
const crawler = new AdvancedCrawler();
crawler.addFilter('/blog/');
crawler.addFilter(/\.pdf$/);
```

---

##### `analyzeSEO(page: Page)`
Analyze page SEO metrics.

```javascript
const seoAnalysis = crawler.analyzeSEO(page);
```

---

##### `getSitemap()`
Get hierarchical site structure.

```javascript
const sitemap = crawler.getSitemap();
```

---

##### `getMetrics()`
Get crawler performance metrics.

```javascript
const metrics = crawler.getMetrics();
```

---

##### `exportAs(format: 'json' | 'csv' | 'xml')`
Export indexed data in different formats.

```javascript
const csvData = crawler.exportAs('csv');
const xmlData = crawler.exportAs('xml');
```

## 📄 Page Object Structure

```javascript
{
  url: string,
  title: string,
  description: string,
  keywords: string,
  headings: { level: string, text: string }[],
  paragraphs: string[],
  images: { src: string, alt: string }[],
  links: { text: string, href: string }[],
  language: string,
  crawledAt: ISO8601String
}
```

## 🔍 Search Relevance Scoring

The search algorithm uses weighted scoring:

- **Title match**: 10 points (highest priority)
- **Description match**: 5 points
- **Heading match**: 3 points
- **Paragraph match**: 1 point

Results are sorted by relevance score in descending order.

## ⚙️ Configuration Examples

### Conservative Crawling
```javascript
const crawler = new WebCrawler({
  startUrls: ['https://example.com'],
  maxPages: 20,
  maxDepth: 1,
  timeout: 10000  // Longer timeout for stability
});
```

### Aggressive Crawling
```javascript
const crawler = new WebCrawler({
  startUrls: ['https://example.com'],
  maxPages: 500,
  maxDepth: 4,
  timeout: 3000   // Shorter timeout for speed
});
```

### Multi-site Crawling
```javascript
const crawler = new WebCrawler({
  startUrls: [
    'https://example1.com',
    'https://example2.com',
    'https://example3.com'
  ],
  maxPages: 100,
  maxDepth: 2
});
```

## 📊 Understanding robots.txt

The crawler automatically respects `robots.txt` guidelines:

```
User-agent: WebCrawler/1.0
Disallow: /admin/
Disallow: /private/
Crawl-delay: 1
```

- The crawler will skip URLs matching `Disallow` rules
- Observes `Crawl-delay` if specified
- Falls back to default behavior if robots.txt is unavailable

## 💾 Exporting Data

### JSON Export
```javascript
crawler.saveIndex('my-index.json');
```

### CSV Export (AdvancedCrawler)
```javascript
const csv = crawler.exportAs('csv');
fs.writeFileSync('index.csv', csv);
```

### XML Export (AdvancedCrawler)
```javascript
const xml = crawler.exportAs('xml');
fs.writeFileSync('index.xml', xml);
```

## 📈 Performance Tips

1. **Adjust Timeout**: Lower timeout for faster crawling, higher for stability
   ```javascript
   timeout: 3000  // 3 seconds
   ```

2. **Respect Crawl Delays**: Don't crawl too aggressively
   ```javascript
   maxDepth: 2,
   maxPages: 50
   ```

3. **Use Filters**: Only crawl relevant pages
   ```javascript
   crawler.addFilter('/blog/');
   ```

4. **Paginate Results**: Process results in batches
   ```javascript
   const searchResults = crawler.search('query').slice(0, 10);
   ```

## 🛡️ Best Practices

1. **Always check `robots.txt`**: The crawler does this automatically
2. **Respect website terms of service**: Use crawlers only where permitted
3. **Implement crawl delays**: Default is 500ms between requests
4. **Identify yourself**: Use a descriptive User-Agent header
5. **Handle errors gracefully**: The crawler logs errors but continues
6. **Monitor resource usage**: Large crawls consume bandwidth and CPU

## ⚠️ Ethical Considerations

- Only crawl websites you have permission to crawl
- Respect robots.txt and site-specific crawling guidelines
- Don't overload servers with aggressive crawling
- Identify your crawler with a descriptive User-Agent
- Cache results to avoid repeated requests
- Consider the website owner's bandwidth and resources

## 🐛 Troubleshooting

### Crawler is slow
- Increase `timeout` value
- Reduce `maxPages` or `maxDepth`
- Check your internet connection

### Getting connection errors
- Check if the target website is accessible
- Verify robots.txt allows crawling
- Try increasing the timeout value
- Check your firewall/proxy settings

### Memory usage is high
- Reduce `maxPages`
- Process results incrementally
- Clear the index after exporting

## 🔧 Advanced Configuration

```javascript
const crawler = new AdvancedCrawler({
  startUrls: ['https://example.com'],
  maxPages: 100,
  maxDepth: 3,
  timeout: 5000,
  userAgent: 'MyBot/1.0',
  urlFilters: ['/blog/', /\.pdf$/],
  retryAttempts: 3
});
```

## 📝 Examples

See `examples.js` for complete working examples:

```bash
node examples.js
```

## 📄 Dashboard

Open `index.html` in your browser to access the visual crawler dashboard with:
- Configuration interface
- Real-time statistics
- Search functionality
- Results display

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

MIT License - See LICENSE file for details

## 📞 Support

For issues, questions, or suggestions:
1. Check the documentation in this README
2. Review the code comments
3. Check examples.js for usage patterns
4. Open an issue on GitHub

---

**Made with ❤️ for web developers and researchers**
