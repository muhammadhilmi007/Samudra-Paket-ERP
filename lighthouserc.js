/**
 * Lighthouse CI Configuration
 * Defines performance budgets and thresholds for the Samudra Paket ERP application
 */

module.exports = {
  ci: {
    collect: {
      // Collect Lighthouse metrics for these URLs
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/login',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/shipments',
      ],
      // Use desktop config for CI
      settings: {
        preset: 'desktop',
        // Simulated throttling for consistent results
        throttlingMethod: 'simulate',
        // Skip the PWA category since we'll test that separately
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
      // Number of times to run Lighthouse for each URL
      numberOfRuns: 3,
    },
    upload: {
      // Upload reports to temporary public storage
      target: 'temporary-public-storage',
    },
    assert: {
      // Performance score thresholds
      assertions: {
        // Performance
        'categories:performance': ['error', { minScore: 0.85 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'aria-required-attr': ['error', { maxNumericValue: 0 }],
        'button-name': ['error', { maxNumericValue: 0 }],
        'color-contrast': ['error', { maxNumericValue: 0 }],
        
        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'errors-in-console': ['error', { maxNumericValue: 0 }],
        'image-alt': ['error', { maxNumericValue: 0 }],
        
        // SEO
        'categories:seo': ['error', { minScore: 0.9 }],
        'meta-description': ['error', { maxNumericValue: 0 }],
        'document-title': ['error', { maxNumericValue: 0 }],
        
        // Performance budgets
        'resource-summary:document:size': ['error', { maxNumericValue: 100000 }],
        'resource-summary:font:size': ['error', { maxNumericValue: 100000 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 200000 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 300000 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }],
        'resource-summary:third-party:size': ['error', { maxNumericValue: 200000 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 1000000 }],
      },
    },
    server: {
      // Configuration for the server when running Lighthouse CI locally
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './.lighthouseci/db.sql',
      },
    },
  },
};
