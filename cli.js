#!/usr/bin/env node

/**
 * CLI Tool for Web Crawler
 * Usage: node cli.js <command> [options]
 * 
 * Commands:
 *   crawl       - Start crawling a website
 *   search      - Search indexed content
 *   export      - Export index to file
 *   analyze     - Analyze crawled pages for SEO
 *   help        - Show help
 */

const WebCrawler = require('./crawler');
const AdvancedCrawler = require('./advanced-crawler');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

/**
 * Show help
 */
function showHelp() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║             Web Crawler CLI - Help                             ║
╚════════════════════════════════════════════════════════════════╝

USAGE:
  node cli.js <command> [options]

COMMANDS:

  crawl [url] [maxPages] [maxDepth]
    Start crawling a website
    Examples:
      node cli.js crawl
      node cli.js crawl https://example.com 50 2

  search <query>
    Search indexed content (requires previous crawl index)
    Examples:
      node cli.js search "javascript"

  export <format> [filename]
    Export index in different formats (json, csv, xml)
    Examples:
      node cli.js export json results.json
      node cli.js export csv results.csv

  analyze [filename]
    Analyze crawled pages for SEO metrics
    Examples:
      node cli.js analyze

  help
    Show this help message

OPTIONS:
  --verbose    Show detailed output
  --timeout    Request timeout in milliseconds
  --user-agent Custom user agent string

EXAMPLES:

  1. Basic crawl:
     node cli.js crawl https://example.com 20 2

  2. Crawl with custom timeout:
     node cli.js crawl https://example.com 20 2 --timeout 3000

  3. Search indexed content:
     node cli.js search "web development"

  4. Export to CSV:
     node cli.js export csv index.csv

  5. Analyze SEO:
     node cli.js analyze index.json
`);
}

/**
 * Interactive crawl
 */
async function interactiveCrawl(url, maxPages, maxDepth) {
  const startUrl = url || await prompt('Enter start URL: ');
  const pages = maxPages || parseInt(await prompt('Max pages to crawl (default 50): ')) || 50;
  const depth = maxDepth || parseInt(await prompt('Max depth (default 2): ')) || 2;
  const timeout = parseInt(await prompt('Timeout in ms (default 5000): ')) || 5000;

  console.log('\n🚀 Starting crawler...\n');

  const crawler = new AdvancedCrawler({
    startUrls: [startUrl],
    maxPages: pages,
    maxDepth: depth,
    timeout: timeout
  });

  try {
    const startTime = Date.now();
    const results = await crawler.crawl();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n✅ Crawl completed in ${duration}s`);
    console.log(`📊 Pages indexed: ${results.index.length}`);

    // Save results
    const saveIndex = await prompt('\nSave index to file? (y/n): ');
    if (saveIndex.toLowerCase() === 'y') {
      const filename = await prompt('Filename (default: index.json): ') || 'index.json';
      crawler.saveIndex(filename);
    }

    return crawler;
  } catch (error) {
    console.error('❌ Error during crawl:', error.message);
    return null;
  }
}

/**
 * Search indexed content
 */
async function searchIndexed() {
  const indexFile = await prompt('Index file path (default: index.json): ') || 'index.json';

  if (!fs.existsSync(indexFile)) {
    console.error(`❌ Index file not found: ${indexFile}`);
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));
    const crawler = new WebCrawler();
    crawler.index = data.pages || data.index || [];

    if (crawler.index.length === 0) {
      console.error('❌ No pages in index');
      return;
    }

    console.log(`\n📚 Index loaded with ${crawler.index.length} pages\n`);

    const query = await prompt('Search query: ');
    const results = crawler.search(query);

    if (results.length === 0) {
      console.log('❌ No results found');
      return;
    }

    console.log(`\n✅ Found ${results.length} results:\n`);

    results.slice(0, 10).forEach((result, i) => {
      console.log(`${i + 1}. ${result.title}`);
      console.log(`   URL: ${result.url}`);
      console.log(`   Relevance: ${result.relevance}\n`);
    });

  } catch (error) {
    console.error('❌ Error searching index:', error.message);
  }
}

/**
 * Analyze pages
 */
async function analyzePages() {
  const indexFile = await prompt('Index file path (default: index.json): ') || 'index.json';

  if (!fs.existsSync(indexFile)) {
    console.error(`❌ Index file not found: ${indexFile}`);
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));
    const crawler = new AdvancedCrawler();
    crawler.index = data.pages || data.index || [];

    if (crawler.index.length === 0) {
      console.error('❌ No pages in index');
      return;
    }

    console.log(`\n📊 Analyzing ${crawler.index.length} pages...\n`);

    const metrics = crawler.getMetrics();
    console.log('📈 Overall Metrics:');
    console.log(`   Average page size: ${metrics.averagePageSize}`);
    console.log(`   Average links: ${metrics.averageLinks}`);
    console.log(`   Average images: ${metrics.averageImages}`);
    console.log(`   Success rate: ${metrics.successRate}`);

    console.log('\n🔍 SEO Analysis (first 5 pages):\n');

    crawler.index.slice(0, 5).forEach((page, i) => {
      const analysis = crawler.analyzeSEO(page);
      console.log(`${i + 1}. ${page.title || 'Untitled'}`);
      console.log(`   Title length: ${analysis.title.length} ${analysis.title.optimal ? '✓' : '✗'}`);
      console.log(`   Description length: ${analysis.description.length} ${analysis.description.optimal ? '✓' : '✗'}`);
      console.log(`   Images without alt: ${analysis.imagesWithoutAlt}\n`);
    });

  } catch (error) {
    console.error('❌ Error analyzing pages:', error.message);
  }
}

/**
 * Export index
 */
async function exportIndex(format, filename) {
  const indexFile = await prompt('Index file path (default: index.json): ') || 'index.json';

  if (!fs.existsSync(indexFile)) {
    console.error(`❌ Index file not found: ${indexFile}`);
    return;
  }

  const exportFormat = format || await prompt('Export format (json/csv/xml): ');
  const outputFile = filename || await prompt(`Output filename (default: export.${exportFormat}): `) || `export.${exportFormat}`;

  try {
    const data = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));
    const crawler = new AdvancedCrawler();
    crawler.index = data.pages || data.index || [];

    const content = crawler.exportAs(exportFormat);
    fs.writeFileSync(outputFile, content);

    console.log(`\n✅ Exported to: ${outputFile}`);
    console.log(`📊 Size: ${(content.length / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Error exporting index:', error.message);
  }
}

/**
 * Main CLI handler
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  try {
    switch (command.toLowerCase()) {
      case 'crawl':
        await interactiveCrawl(args[1], args[2], args[3]);
        break;

      case 'search':
        if (args[1]) {
          const indexFile = 'index.json';
          if (fs.existsSync(indexFile)) {
            const data = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));
            const crawler = new WebCrawler();
            crawler.index = data.pages || data.index || [];
            const results = crawler.search(args[1]);
            console.log(`\n✅ Found ${results.length} results:\n`);
            results.slice(0, 10).forEach((result, i) => {
              console.log(`${i + 1}. ${result.title}`);
              console.log(`   ${result.url}\n`);
            });
          } else {
            console.error('❌ No index.json found. Please crawl first.');
          }
        } else {
          await searchIndexed();
        }
        break;

      case 'export':
        await exportIndex(args[1], args[2]);
        break;

      case 'analyze':
        await analyzePages();
        break;

      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;

      default:
        console.log(`❌ Unknown command: ${command}`);
        showHelp();
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
