const WebCrawler = require('./crawler');

/**
 * Advanced Web Crawler with additional features
 */
class AdvancedCrawler extends WebCrawler {
  constructor(options = {}) {
    super(options);
    this.urlFilters = options.urlFilters || [];
    this.mimeTypes = options.mimeTypes || ['text/html'];
    this.proxy = options.proxy || null;
    this.retryAttempts = options.retryAttempts || 3;
    this.urlPatterns = [];
  }

  /**
   * Add URL filter patterns (regex or strings)
   */
  addFilter(pattern) {
    this.urlFilters.push(pattern);
  }

  /**
   * Check if URL matches filters
   */
  matchesFilters(url) {
    if (this.urlFilters.length === 0) return true;

    for (const filter of this.urlFilters) {
      if (typeof filter === 'string') {
        if (url.includes(filter)) return true;
      } else if (filter instanceof RegExp) {
        if (filter.test(url)) return true;
      }
    }
    return false;
  }

  /**
   * Analyze page for SEO metadata
   */
  analyzeSEO(page) {
    return {
      url: page.url,
      title: {
        text: page.title,
        length: page.title.length,
        optimal: page.title.length >= 30 && page.title.length <= 60
      },
      description: {
        text: page.description,
        length: page.description.length,
        optimal: page.description.length >= 120 && page.description.length <= 160
      },
      headings: page.headings.length,
      contentLength: page.paragraphs.join(' ').length,
      images: page.images.length,
      links: page.links.length,
      imagesWithoutAlt: page.images.filter(img => !img.alt).length
    };
  }

  /**
   * Crawl with retry logic
   */
  async fetchPageWithRetry(url, attempt = 1) {
    try {
      return await this.fetchPage(url);
    } catch (error) {
      if (attempt < this.retryAttempts) {
        console.log(`🔄 Retrying ${url} (attempt ${attempt + 1}/${this.retryAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        return this.fetchPageWithRetry(url, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Get sitemap data
   */
  getSitemap() {
    return {
      baseUrl: this.startUrls[0],
      totalPages: this.index.length,
      structure: this.buildSiteStructure()
    };
  }

  /**
   * Build hierarchical site structure
   */
  buildSiteStructure() {
    const structure = {};

    for (const page of this.index) {
      try {
        const url = new URL(page.url);
        const pathParts = url.pathname.split('/').filter(p => p);

        let current = structure;
        for (const part of pathParts) {
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
        current._page = page.title;
      } catch (error) {
        // Skip invalid URLs
      }
    }

    return structure;
  }

  /**
   * Get crawler performance metrics
   */
  getMetrics() {
    const pageSize = this.index.map(p => 
      (p.title.length + p.description.length + p.paragraphs.join('').length) / 1024
    );

    return {
      averagePageSize: (pageSize.reduce((a, b) => a + b, 0) / pageSize.length).toFixed(2) + ' KB',
      averageLinks: (this.index.reduce((sum, p) => sum + p.links.length, 0) / this.index.length).toFixed(1),
      averageImages: (this.index.reduce((sum, p) => sum + p.images.length, 0) / this.index.length).toFixed(1),
      successRate: ((this.index.length / this.visited.size) * 100).toFixed(1) + '%'
    };
  }

  /**
   * Export in different formats
   */
  exportAs(format = 'json') {
    switch(format) {
      case 'csv':
        return this.exportCSV();
      case 'xml':
        return this.exportXML();
      case 'json':
      default:
        return JSON.stringify(this.index, null, 2);
    }
  }

  /**
   * Export as CSV
   */
  exportCSV() {
    const headers = ['URL', 'Title', 'Description', 'Images', 'Links', 'Crawled At'];
    const rows = this.index.map(page => [
      page.url,
      page.title,
      page.description,
      page.images.length,
      page.links.length,
      page.crawledAt
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    return csv;
  }

  /**
   * Export as XML
   */
  exportXML() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<pages>\n';
    
    this.index.forEach(page => {
      xml += '  <page>\n';
      xml += `    <url>${this.escapeXml(page.url)}</url>\n`;
      xml += `    <title>${this.escapeXml(page.title)}</title>\n`;
      xml += `    <description>${this.escapeXml(page.description)}</description>\n`;
      xml += `    <crawledAt>${page.crawledAt}</crawledAt>\n`;
      xml += '  </page>\n';
    });
    
    xml += '</pages>';
    return xml;
  }

  /**
   * Helper to escape XML
   */
  escapeXml(str) {
    return str.replace(/[<>&'"]/g, c => {
      switch(c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }
}

module.exports = AdvancedCrawler;
