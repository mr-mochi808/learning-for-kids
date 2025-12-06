const WebCrawler = require('./crawler');

/**
 * Example 1: Crawl a single website
 */
async function example1() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('EXAMPLE 1: Basic Website Crawl');
  console.log('═══════════════════════════════════════════════════');

  const crawler = new WebCrawler({
    startUrls: ['https://example.com'],
    maxPages: 20,
    maxDepth: 2
  });

  const results = await crawler.crawl();
  crawler.saveIndex('example1-index.json');

  // Show search functionality
  console.log('\n🔍 Search Results for "web":');
  const searchResults = crawler.search('web');
  searchResults.slice(0, 5).forEach((result, i) => {
    console.log(`${i + 1}. ${result.title}`);
    console.log(`   ${result.url}`);
    console.log(`   Relevance: ${result.relevance}\n`);
  });
}

/**
 * Example 2: Crawl multiple websites
 */
async function example2() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('EXAMPLE 2: Multi-site Crawl');
  console.log('═══════════════════════════════════════════════════');

  const crawler = new WebCrawler({
    startUrls: [
      'https://example.com',
      'https://www.w3.org'
    ],
    maxPages: 30,
    maxDepth: 1
  });

  const results = await crawler.crawl();
  return results;
}

/**
 * Run example
 */
async function runExamples() {
  try {
    // Uncomment to run:
    // await example1();
    
    console.log('\n📝 Note: Update startUrls in the examples to crawl your target websites');
    console.log('⚠️  Always respect robots.txt and website terms of service');
    console.log('💡 Uncomment examples in this file to run specific crawls\n');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

runExamples();
