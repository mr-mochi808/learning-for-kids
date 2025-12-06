# 🏗️ Web Crawler Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interfaces                        │
├──────────────┬──────────────┬───────────────┬──────────────┤
│  Web UI      │  CLI Tool    │  JavaScript   │  Node.js     │
│ (index.html) │  (cli.js)    │  API          │  Required    │
└──────────────┴──────────────┴───────────────┴──────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Crawler Engine                           │
├────────────────────┬────────────────────────────────────────┤
│  WebCrawler        │  AdvancedCrawler (extends)            │
│  (crawler.js)      │  (advanced-crawler.js)                │
├────────────────────┼────────────────────────────────────────┤
│ • URL Management   │ • URL Filtering                       │
│ • robots.txt Check │ • SEO Analysis                        │
│ • Link Discovery   │ • Export Formats                      │
│ • Content Index    │ • Performance Metrics                 │
│ • Search          │ • Retry Logic                         │
└────────────────────┴────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│              HTTP & HTML Processing                         │
├────────────────────┬──────────────────┬────────────────────┤
│  axios             │  cheerio         │  robots-parser    │
│  (HTTP requests)   │  (HTML parsing)  │  (robots.txt)     │
└────────────────────┴──────────────────┴────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Internet                                 │
│              (Target Websites)                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. WebCrawler Class (Core)

**File**: `crawler.js`

**Key Methods**:

```
WebCrawler
├── crawl()                 # Main crawling loop
├── fetchPage()            # Download HTML
├── extractContent()       # Parse & index page
├── extractLinks()         # Find all links
├── search()              # Search indexed content
├── isSameDomain()        # Check domain matching
├── isUrlAllowed()        # Check robots.txt
├── normalizeUrl()        # Standardize URLs
├── getRobotRules()       # Parse robots.txt
├── saveIndex()           # Export to JSON
└── printStats()          # Show statistics
```

**Data Flow**:

```
startUrls
   ↓
[queue]
   ↓
fetchPage() → extractContent() → [index]
   ↓
extractLinks() → filter & normalize
   ↓
add to queue
   ↓
repeat until done
```

### 2. AdvancedCrawler Class (Extensions)

**File**: `advanced-crawler.js`

**Additional Methods**:

```
AdvancedCrawler (extends WebCrawler)
├── addFilter()            # Add URL patterns
├── matchesFilters()       # Check URL against filters
├── analyzeSEO()          # SEO metrics per page
├── getSitemap()          # Hierarchical structure
├── getMetrics()          # Performance stats
├── exportAs()            # Export to JSON/CSV/XML
├── exportCSV()           # CSV formatter
├── exportXML()           # XML formatter
└── fetchPageWithRetry()  # Retry failed requests
```

### 3. CLI Interface

**File**: `cli.js`

**Commands**:

```
cli.js
├── crawl [url] [pages] [depth]     # Start crawling
├── search <query> [indexFile]      # Search indexed data
├── export <format> [filename]      # Export results
├── analyze [indexFile]             # SEO analysis
└── help                            # Show help
```

**Interactive Mode**: Prompts user for settings

### 4. Web Dashboard

**File**: `index.html`

**Features**:

```
Dashboard
├── Configuration Panel
│   ├── Start URL input
│   ├── Max Pages slider
│   ├── Max Depth slider
│   └── Timeout setting
├── Statistics Panel
│   ├── Pages Crawled
│   ├── Pages Indexed
│   ├── Error Count
│   └── Avg Time/Page
├── Search Box
│   ├── Query input
│   └── Search button
└── Results Display
    ├── Results list
    ├── Title display
    ├── URL display
    └── Snippet preview
```

## Data Structures

### Page Object

```javascript
{
  url: string,                    // Full URL
  title: string,                  // Page title
  description: string,            // Meta description
  keywords: string,               // Meta keywords
  headings: Array<{               // All headings
    level: 'h1'|'h2'|'h3',
    text: string
  }>,
  paragraphs: string[],           // Text content
  images: Array<{                 // Images found
    src: string,
    alt: string
  }>,
  links: Array<{                  // Links found
    text: string,
    href: string
  }>,
  language: string,               // HTML lang attribute
  crawledAt: ISO8601String        // Crawl timestamp
}
```

### Search Result Object

```javascript
{
  url: string,                    // Page URL
  title: string,                  // Page title
  description: string,            // Meta description
  relevance: number               // Relevance score
}
```

### Crawl Options

```javascript
{
  startUrls: string[],            // Starting URLs
  maxPages: number,               // Page limit
  maxDepth: number,               // Crawl depth
  timeout: number,                // Request timeout (ms)
  userAgent: string               // Custom User-Agent
}
```

## Crawling Algorithm

```
ALGORITHM: WebCrawl(startUrls, maxPages, maxDepth)
  
  INITIALIZE:
    queue ← startUrls
    visited ← empty set
    index ← empty array
    
  WHILE queue not empty AND visited.size < maxPages:
    
    url, depth ← queue.pop()
    
    IF url in visited:
      continue
    
    IF checkRobotsTxt(url) == DISALLOWED:
      log("Blocked by robots.txt")
      continue
    
    visited.add(url)
    
    TRY:
      html ← fetchPage(url)
      content ← extractContent(html, url)
      index.append(content)
      
      IF depth < maxDepth:
        links ← extractLinks(html, url)
        FOR EACH link in links:
          normalized ← normalizeUrl(link)
          IF sameDomain(url, normalized):
            queue.append((normalized, depth + 1))
    
    CATCH error:
      logError(url, error)
    
    WAIT (crawlDelay)  // Polite crawling
  
  RETURN index
```

## robots.txt Handling

```
┌─ Request to crawl URL
│
├─ Extract domain
│
├─ Check robots cache
│  ├─ If cached: Use cached rules
│  └─ If not: Fetch /robots.txt
│
├─ Parse robots.txt
│  ├─ Find User-Agent: WebCrawler/1.0
│  ├─ Check Disallow paths
│  └─ Extract Crawl-Delay
│
├─ Check if URL matches Disallow
│  ├─ If allowed: Proceed with crawl
│  └─ If disallowed: Skip URL
│
└─ Apply Crawl-Delay if specified
```

## Search Algorithm

```
ALGORITHM: Search(query, index)
  
  results ← empty array
  
  FOR EACH page in index:
    score ← 0
    
    // Title match (weight: 10)
    IF query in page.title:
      score += 10
    
    // Description match (weight: 5)
    IF query in page.description:
      score += 5
    
    // Heading match (weight: 3)
    FOR EACH heading in page.headings:
      IF query in heading.text:
        score += 3
    
    // Paragraph match (weight: 1)
    FOR EACH paragraph in page.paragraphs:
      IF query in paragraph:
        score += 1
    
    IF score > 0:
      results.append({
        url: page.url,
        title: page.title,
        description: page.description,
        relevance: score
      })
  
  SORT results BY relevance DESC
  RETURN results
```

## Error Handling

```
Try to Fetch URL
│
├─ Network Error
│  ├─ Retry (up to 3x)
│  └─ Log error
│
├─ Timeout
│  ├─ Increase timeout on retry
│  └─ Log timeout
│
├─ 404 Not Found
│  ├─ Skip page
│  └─ Log 404
│
├─ 403 Forbidden
│  ├─ Check robots.txt
│  └─ Skip page
│
├─ Invalid HTML
│  ├─ Parse partial content
│  └─ Log warning
│
└─ Other Errors
   ├─ Log error details
   └─ Continue crawling
```

## Memory Management

### Per-Page Memory
- URL: ~100 bytes
- Title: ~100 bytes
- Description: ~150 bytes
- Content (avg): ~5-10 KB
- **Total: ~5-15 KB per page**

### Typical Usage
- 50 pages: ~250-750 KB
- 100 pages: ~500 KB - 1.5 MB
- 500 pages: ~2.5-7.5 MB

### Optimization Tips
1. Process results incrementally
2. Clear visited set periodically
3. Use streams for large exports
4. Implement caching layer

## Performance Considerations

### Request Timeline
```
URL Added
   ↓ (waiting in queue)
Fetch Started (axios)
   ├─ DNS lookup: 50-100ms
   ├─ TCP connect: 50-200ms
   ├─ TLS handshake: 100-500ms
   ├─ HTTP request: 10-50ms
   ├─ Server processing: 100-1000ms
   ├─ Response download: 10-100ms (depends on size)
   └─ Total: 200-2000ms
   ↓
Parse HTML (cheerio)
   ├─ Load HTML: 10-50ms
   ├─ Extract content: 20-100ms
   └─ Total: 30-150ms
   ↓
Add to Index
   ↓ (500ms crawl delay)
Next URL
```

## Concurrency

**Current**: Single-threaded, sequential processing
- Safer, more stable
- Respects crawl delays
- Easier to debug

**Future Enhancement**: Could implement:
- Worker threads for parallel crawling
- Connection pooling
- Rate limiting per domain

## Security Considerations

```
Input Validation:
├─ URL validation (URL parsing)
├─ HTML sanitization (cheerio safe)
├─ robots.txt parsing (robots-parser)
└─ User agent sanitization

Resource Limits:
├─ Request timeout
├─ Page size limits
├─ Max depth restriction
└─ Max pages cap

Network Security:
├─ HTTPS support (automatic)
├─ SSL verification
├─ Redirect limits (5 max)
└─ User-Agent identification
```

## File Organization

```
proxyy/
├── Core Engine
│   ├── crawler.js          (280+ lines)
│   └── advanced-crawler.js (250+ lines)
├── User Interfaces
│   ├── cli.js              (150+ lines)
│   ├── index.html          (400+ lines)
│   └── examples.js         (80+ lines)
├── Documentation
│   ├── README.md           (400+ lines)
│   ├── QUICKSTART.md       (300+ lines)
│   ├── PROJECT_OVERVIEW.md (200+ lines)
│   └── ARCHITECTURE.md     (this file)
├── Testing & Config
│   ├── test.js             (250+ lines)
│   ├── config.json         (50 lines)
│   └── package.json        (20 lines)
└── Setup
    └── setup.bat           (30 lines)

Total: 3000+ lines of code and documentation
```

## Workflow Diagram

```
┌─ User Starts Crawler
│
├─ Load Config
│
├─ Validate Start URLs
│
├─ Initialize Queue
│
└─ CRAWLING LOOP
   │
   ├─ While queue not empty
   │  │
   │  ├─ Pop URL from queue
   │  │
   │  ├─ Check robots.txt
   │  │
   │  ├─ Fetch page
   │  │
   │  ├─ Parse HTML
   │  │
   │  ├─ Extract content
   │  │
   │  ├─ Add to index
   │  │
   │  ├─ Extract links
   │  │
   │  ├─ Filter & normalize
   │  │
   │  ├─ Add to queue
   │  │
   │  └─ Wait (crawl delay)
   │
   └─ Generate Results
      │
      ├─ Save index.json
      │
      ├─ Show statistics
      │
      ├─ Enable search
      │
      └─ Allow export
```

---

**Architecture Version**: 1.0
**Last Updated**: December 5, 2025
