const axios = require('axios');
const cheerio = require('cheerio');
const robotsParser = require('robots-parser');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

/**
 * Web Crawler - Similar to Google's crawling engine
 * Features:
 * - Respects robots.txt
 * - Follows URL patterns
 * - Extracts metadata and content
 * - Stores indexed data
 */
class WebCrawler {
  constructor(options = {}) {
    this.startUrls = options.startUrls || [];
    this.maxPages = options.maxPages || 50;
    this.maxDepth = options.maxDepth || 3;
    this.timeout = options.timeout || 5000;
    this.userAgent = options.userAgent || 'Mozilla/5.0 (compatible; WebCrawler/1.0)';
    
    this.visited = new Set();
    this.queue = [];
    this.index = [];
    this.errors = [];
    this.robotsCache = {};
  }

  /**
   * Fetch robots.txt and parse crawl rules
   */
  async getRobotRules(domain) {
    if (this.robotsCache[domain]) {
      return this.robotsCache[domain];
    }

    try {
      const robotsUrl = `${domain}/robots.txt`;
      const response = await axios.get(robotsUrl, {
        timeout: this.timeout,
        headers: { 'User-Agent': this.userAgent }
      });
      const robots = robotsParser(robotsUrl, response.data);
      this.robotsCache[domain] = robots;
      return robots;
    } catch (error) {
      // If robots.txt doesn't exist, allow crawling
      return null;
    }
  }

  /**
   * Check if URL is allowed by robots.txt
   */
  async isUrlAllowed(url) {
    try {
      const urlObj = new URL(url);
      const domain = `${urlObj.protocol}//${urlObj.host}`;
      const robots = await this.getRobotRules(domain);
      
      if (!robots) return true;
      return robots.isAllowed(url, this.userAgent);
    } catch (error) {
      return false;
    }
  }

  /**
   * Normalize URL
   */
  normalizeUrl(url, baseUrl) {
    try {
      const absoluteUrl = new URL(url, baseUrl).href;
      // Remove hash fragments
      return absoluteUrl.split('#')[0];
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract all links from HTML content
   */
  extractLinks(html, pageUrl) {
    const links = [];
    try {
      const $ = cheerio.load(html);
      $('a[href]').each((i, elem) => {
        const href = $(elem).attr('href');
        const normalizedUrl = this.normalizeUrl(href, pageUrl);
        if (normalizedUrl) {
          links.push(normalizedUrl);
        }
      });
    } catch (error) {
      console.error(`Error extracting links from ${pageUrl}:`, error.message);
    }
    return links;
  }

  /**
   * Extract metadata and content from page
   */
  extractContent(html, url) {
    const content = {
      url: url,
      title: '',
      description: '',
      keywords: '',
      headings: [],
      paragraphs: [],
      images: [],
      links: [],
      language: 'en',
      crawledAt: new Date().toISOString()
    };

    try {
      const $ = cheerio.load(html);

      // Extract metadata
      content.title = $('title').text() || '';
      content.description = $('meta[name="description"]').attr('content') || '';
      content.keywords = $('meta[name="keywords"]').attr('content') || '';
      content.language = $('html').attr('lang') || 'en';

      // Extract headings
      $('h1, h2, h3').each((i, elem) => {
        content.headings.push({
          level: elem.name,
          text: $(elem).text()
        });
      });

      // Extract paragraphs
      $('p').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text.length > 20) {
          content.paragraphs.push(text);
        }
      });

      // Extract images
      $('img').each((i, elem) => {
        content.images.push({
          src: $(elem).attr('src'),
          alt: $(elem).attr('alt') || ''
        });
      });

      // Extract links
      $('a[href]').each((i, elem) => {
        content.links.push({
          text: $(elem).text(),
          href: $(elem).attr('href')
        });
      });
    } catch (error) {
      console.error(`Error extracting content from ${url}:`, error.message);
    }

    return content;
  }

  /**
   * Fetch a single page
   */
  async fetchPage(url) {
    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': this.userAgent
        },
        maxRedirects: 5
      });

      // Check if content is HTML
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html')) {
        throw new Error('Not HTML content');
      }

      return response.data;
    } catch (error) {
      throw new Error(`Fetch failed: ${error.message}`);
    }
  }

  /**
   * Check if URL belongs to the same domain
   */
  isSameDomain(url1, url2) {
    try {
      const domain1 = new URL(url1).hostname;
      const domain2 = new URL(url2).hostname;
      return domain1 === domain2;
    } catch (error) {
      return false;
    }
  }

  /**
   * Crawl a single URL
   */
  async crawlUrl(url, depth = 0) {
    // Check if already visited
    if (this.visited.has(url)) {
      return;
    }

    // Check limits
    if (this.visited.size >= this.maxPages || depth > this.maxDepth) {
      return;
    }

    // Check robots.txt
    const allowed = await this.isUrlAllowed(url);
    if (!allowed) {
      console.log(`⛔ Blocked by robots.txt: ${url}`);
      return;
    }

    this.visited.add(url);
    console.log(`📄 Crawling [${depth}] ${url}`);

    try {
      const html = await this.fetchPage(url);
      const content = this.extractContent(html, url);
      this.index.push(content);

      // Extract and queue new links
      const links = this.extractLinks(html, url);
      for (const link of links) {
        // Only follow same-domain links
        if (this.isSameDomain(url, link) && !this.visited.has(link)) {
          this.queue.push({ url: link, depth: depth + 1 });
        }
      }

      console.log(`✅ Indexed: ${content.title || url}`);
    } catch (error) {
      this.errors.push({ url, error: error.message });
      console.error(`❌ Error crawling ${url}: ${error.message}`);
    }
  }

  /**
   * Start crawling
   */
  async crawl() {
    console.log('\n🚀 Starting Web Crawler...\n');
    console.log(`📍 Start URLs: ${this.startUrls.join(', ')}`);
    console.log(`📊 Max Pages: ${this.maxPages}`);
    console.log(`📈 Max Depth: ${this.maxDepth}\n`);

    // Initialize queue
    this.queue = this.startUrls.map((url, i) => ({ url, depth: 0 }));

    // Process queue
    while (this.queue.length > 0 && this.visited.size < this.maxPages) {
      const { url, depth } = this.queue.shift();
      await this.crawlUrl(url, depth);
      
      // Polite crawling - delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n\n✨ Crawling Complete!\n');
    this.printStats();
    return this.getResults();
  }

  /**
   * Print statistics
   */
  printStats() {
    console.log('📊 STATISTICS:');
    console.log(`   Pages Crawled: ${this.visited.size}`);
    console.log(`   Pages Indexed: ${this.index.length}`);
    console.log(`   Errors: ${this.errors.length}`);
    console.log(`   Queue Remaining: ${this.queue.length}`);
  }

  /**
   * Get crawling results
   */
  getResults() {
    return {
      index: this.index,
      statistics: {
        pagesCrawled: this.visited.size,
        pagesIndexed: this.index.length,
        errors: this.errors.length,
        crawlTime: new Date().toISOString()
      },
      errors: this.errors
    };
  }

  /**
   * Save index to file
   */
  saveIndex(filename = 'index.json') {
    const filepath = path.join(__dirname, filename);
    const data = {
      crawledAt: new Date().toISOString(),
      statistics: {
        totalPages: this.index.length,
        totalErrors: this.errors.length
      },
      pages: this.index
    };

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`\n💾 Index saved to: ${filepath}`);
  }

  /**
   * Search indexed content
   */
  search(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    for (const page of this.index) {
      let score = 0;

      // Title match (highest weight)
      if (page.title.toLowerCase().includes(lowerQuery)) {
        score += 10;
      }

      // Description match
      if (page.description.toLowerCase().includes(lowerQuery)) {
        score += 5;
      }

      // Headings match
      page.headings.forEach(heading => {
        if (heading.text.toLowerCase().includes(lowerQuery)) {
          score += 3;
        }
      });

      // Paragraphs match
      page.paragraphs.forEach(para => {
        if (para.toLowerCase().includes(lowerQuery)) {
          score += 1;
        }
      });

      if (score > 0) {
        results.push({
          url: page.url,
          title: page.title,
          description: page.description,
          relevance: score
        });
      }
    }

    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance);
  }
}

module.exports = WebCrawler;
