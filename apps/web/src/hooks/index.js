/**
 * Hooks Index
 * Exports all custom hooks for easy import
 */

// Export API hooks
export { default as useApi } from './useApi';
export { default as useAuthService } from './useAuthService';
export { default as useCoreService } from './useCoreService';

// Export WebSocket hook if it exists
export { default as useWebSocket } from './useWebSocket';
