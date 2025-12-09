const express = require('express');
const cors = require('cors');
const path = require('path');
const WebCrawler = require('./crawler');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (index.html, etc.)
app.use(express.static(path.join(__dirname)));

let crawlerInstance = null;
let lastResults = [];

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start a crawl
app.post('/api/crawl', async (req, res) => {
  const { startUrl, maxPages, maxDepth, timeout } = req.body;
  try {
    crawlerInstance = new WebCrawler({
      startUrls: [startUrl],
      maxPages: Number(maxPages) || 20,
      maxDepth: Number(maxDepth) || 2,
      timeout: Number(timeout) || 5000
    });
    const results = await crawlerInstance.crawl();
    lastResults = results.index;
    res.json({ success: true, stats: results.statistics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Search indexed content
app.get('/api/search', (req, res) => {
  const query = req.query.q || '';
  if (!crawlerInstance || !lastResults.length) {
    return res.json({ results: [] });
  }
  const results = crawlerInstance.search(query);
  res.json({ results });
});

// Get crawl stats
app.get('/api/stats', (req, res) => {
  if (!crawlerInstance) return res.json({ stats: null });
  res.json({ stats: crawlerInstance.getResults().statistics });
});

// Get indexed pages
app.get('/api/results', (req, res) => {
  res.json({ pages: lastResults });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🕷️ Web Crawler API server running on http://localhost:${PORT}`);
  console.log(`Open your browser and go to http://localhost:${PORT}`);
});
