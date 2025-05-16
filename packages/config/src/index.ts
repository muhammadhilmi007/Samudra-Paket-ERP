/**
 * Config Package
 * Shared configuration for all services and applications
 */

// This is a placeholder file for the config package
// In a real implementation, this would load and export configuration

export const config = {
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    timeout: 30000,
  },
  auth: {
    tokenExpiration: '30m',
    refreshTokenExpiration: '7d',
  },
};

export default config;
