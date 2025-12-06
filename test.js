/**
 * Test Suite and Usage Examples
 * Run with: node test.js
 */

const WebCrawler = require('./crawler');
const AdvancedCrawler = require('./advanced-crawler');

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║          Web Crawler - Test Suite & Examples                  ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

/**
 * Test 1: Basic Crawler Setup
 */
function testBasicSetup() {
  console.log('✅ Test 1: Basic Crawler Setup');
  console.log('─'.repeat(60));

  const crawler = new WebCrawler({
    startUrls: ['https://example.com'],
    maxPages: 50,
    maxDepth: 2,
    timeout: 5000
  });

  console.log('✓ Crawler instance created successfully');
  console.log(`  - Start URLs: ${crawler.startUrls.join(', ')}`);
  console.log(`  - Max Pages: ${crawler.maxPages}`);
  console.log(`  - Max Depth: ${crawler.maxDepth}`);
  console.log(`  - Timeout: ${crawler.timeout}ms`);
  console.log('');
}

/**
 * Test 2: URL Normalization
 */
function testUrlNormalization() {
  console.log('✅ Test 2: URL Normalization');
  console.log('─'.repeat(60));

  const crawler = new WebCrawler();
  
  const testCases = [
    { relative: '/about', base: 'https://example.com', expected: 'https://example.com/about' },
    { relative: '../page', base: 'https://example.com/blog/', expected: 'https://example.com/page' },
    { relative: 'https://example.com/page#section', base: 'https://example.com', expected: 'https://example.com/page' },
  ];

  testCases.forEach((test, i) => {
    const normalized = crawler.normalizeUrl(test.relative, test.base);
    const passed = normalized === test.expected;
    console.log(`${passed ? '✓' : '✗'} Case ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`  Input: ${test.relative} (base: ${test.base})`);
    console.log(`  Expected: ${test.expected}`);
    console.log(`  Got: ${normalized}`);
  });
  console.log('');
}

/**
 * Test 3: Same Domain Detection
 */
function testSameDomain() {
  console.log('✅ Test 3: Same Domain Detection');
  console.log('─'.repeat(60));

  const crawler = new WebCrawler();

  const testCases = [
    { url1: 'https://example.com/page1', url2: 'https://example.com/page2', expected: true },
    { url1: 'https://example.com', url2: 'https://other.com', expected: false },
    { url1: 'https://sub.example.com', url2: 'https://example.com', expected: false },
  ];

  testCases.forEach((test, i) => {
    const result = crawler.isSameDomain(test.url1, test.url2);
    const passed = result === test.expected;
    console.log(`${passed ? '✓' : '✗'} Case ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`  URL 1: ${test.url1}`);
    console.log(`  URL 2: ${test.url2}`);
    console.log(`  Expected: ${test.expected}, Got: ${result}`);
  });
  console.log('');
}

/**
 * Test 4: Content Extraction
 */
function testContentExtraction() {
  console.log('✅ Test 4: Content Extraction');
  console.log('─'.repeat(60));

  const crawler = new WebCrawler();

  const sampleHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Test Page</title>
        <meta name="description" content="This is a test page">
      </head>
      <body>
        <h1>Main Heading</h1>
        <p>This is the first paragraph with some content.</p>
        <img src="/image.jpg" alt="Test Image">
        <a href="/page2">Link to page 2</a>
      </body>
    </html>
  `;

  const content = crawler.extractContent(sampleHtml, 'https://example.com/test');

  console.log('✓ Content extracted successfully');
  console.log(`  - Title: "${content.title}"`);
  console.log(`  - Description: "${content.description}"`);
  console.log(`  - Headings found: ${content.headings.length}`);
  console.log(`  - Paragraphs found: ${content.paragraphs.length}`);
  console.log(`  - Images found: ${content.images.length}`);
  console.log(`  - Links found: ${content.links.length}`);
  console.log('');
}

/**
 * Test 5: Link Extraction
 */
function testLinkExtraction() {
  console.log('✅ Test 5: Link Extraction');
  console.log('─'.repeat(60));

  const crawler = new WebCrawler();

  const sampleHtml = `
    <html>
      <a href="https://example.com/page1">Link 1</a>
      <a href="/page2">Link 2</a>
      <a href="../page3">Link 3</a>
      <a href="https://example.com/page1#section">Link with anchor</a>
    </html>
  `;

  const links = crawler.extractLinks(sampleHtml, 'https://example.com/blog/');

  console.log(`✓ Extracted ${links.length} links`);
  links.forEach((link, i) => {
    console.log(`  ${i + 1}. ${link}`);
  });
  console.log('');
}

/**
 * Test 6: Advanced Crawler Filters
 */
function testAdvancedFilters() {
  console.log('✅ Test 6: Advanced Crawler - URL Filters');
  console.log('─'.repeat(60));

  const crawler = new AdvancedCrawler();

  // Add filters
  crawler.addFilter('/blog/');
  crawler.addFilter(/\.pdf$/);

  const testUrls = [
    { url: 'https://example.com/blog/post1', shouldMatch: true },
    { url: 'https://example.com/about', shouldMatch: false },
    { url: 'https://example.com/document.pdf', shouldMatch: true },
    { url: 'https://example.com/image.jpg', shouldMatch: false },
  ];

  testUrls.forEach((test, i) => {
    const matches = crawler.matchesFilters(test.url);
    const passed = matches === test.shouldMatch;
    console.log(`${passed ? '✓' : '✗'} Case ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`  URL: ${test.url}`);
    console.log(`  Expected match: ${test.shouldMatch}, Got: ${matches}`);
  });
  console.log('');
}

/**
 * Test 7: Search Functionality
 */
function testSearch() {
  console.log('✅ Test 7: Search Functionality');
  console.log('─'.repeat(60));

  const crawler = new WebCrawler();

  // Add sample pages
  crawler.index = [
    {
      url: 'https://example.com/page1',
      title: 'JavaScript Tutorial',
      description: 'Learn JavaScript programming',
      paragraphs: ['JavaScript is a popular programming language'],
      headings: [],
      images: [],
      links: [],
      language: 'en',
      crawledAt: new Date().toISOString()
    },
    {
      url: 'https://example.com/page2',
      title: 'Python Guide',
      description: 'Python programming guide',
      paragraphs: ['Python is great for web development'],
      headings: [],
      images: [],
      links: [],
      language: 'en',
      crawledAt: new Date().toISOString()
    }
  ];

  const results = crawler.search('javascript');

  console.log(`✓ Search completed - found ${results.length} results`);
  results.forEach((result, i) => {
    console.log(`  ${i + 1}. "${result.title}" (relevance: ${result.relevance})`);
    console.log(`     ${result.url}`);
  });
  console.log('');
}

/**
 * Test 8: Export Functionality
 */
function testExport() {
  console.log('✅ Test 8: Export Functionality (AdvancedCrawler)');
  console.log('─'.repeat(60));

  const crawler = new AdvancedCrawler();

  // Add sample page
  crawler.index = [
    {
      url: 'https://example.com/test',
      title: 'Test Page',
      description: 'Test Description',
      paragraphs: [],
      headings: [],
      images: [],
      links: [],
      language: 'en',
      crawledAt: new Date().toISOString()
    }
  ];

  // Test JSON export
  const json = crawler.exportAs('json');
  console.log('✓ JSON export: ' + (json.includes('Test Page') ? 'PASS' : 'FAIL'));

  // Test CSV export
  const csv = crawler.exportAs('csv');
  console.log('✓ CSV export: ' + (csv.includes('Test Page') ? 'PASS' : 'FAIL'));

  // Test XML export
  const xml = crawler.exportAs('xml');
  console.log('✓ XML export: ' + (xml.includes('Test Page') ? 'PASS' : 'FAIL'));

  console.log('');
}

/**
 * Test 9: SEO Analysis
 */
function testSEOAnalysis() {
  console.log('✅ Test 9: SEO Analysis');
  console.log('─'.repeat(60));

  const crawler = new AdvancedCrawler();

  const page = {
    url: 'https://example.com/page',
    title: 'This is a good page title for SEO',
    description: 'This is a good meta description that is between 120 and 160 characters long',
    headings: [{level: 'h1', text: 'Main Heading'}],
    paragraphs: ['Content 1', 'Content 2'],
    images: [{src: '/img1.jpg', alt: 'Image 1'}, {src: '/img2.jpg', alt: ''}],
    links: [1, 2, 3],
    language: 'en',
    crawledAt: new Date().toISOString()
  };

  const analysis = crawler.analyzeSEO(page);

  console.log('✓ SEO Analysis completed:');
  console.log(`  - Title: "${analysis.title.text}"`);
  console.log(`    Length: ${analysis.title.length} (optimal: ${analysis.title.optimal})`);
  console.log(`  - Description length: ${analysis.description.length} (optimal: ${analysis.description.optimal})`);
  console.log(`  - Headings: ${analysis.headings}`);
  console.log(`  - Images: ${analysis.images} (${analysis.imagesWithoutAlt} without alt)`);
  console.log(`  - Links: ${analysis.links}`);
  console.log('');
}

/**
 * Run all tests
 */
function runAllTests() {
  try {
    testBasicSetup();
    testUrlNormalization();
    testSameDomain();
    testContentExtraction();
    testLinkExtraction();
    testAdvancedFilters();
    testSearch();
    testExport();
    testSEOAnalysis();

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ All Tests Complete!                      ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('❌ Test Error:', error);
  }
}

// Run tests
runAllTests();
