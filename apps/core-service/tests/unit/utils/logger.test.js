const winston = require('winston');
const logger = require('../../../src/utils/logger');

// Mock winston
jest.mock('winston', () => {
  const mockFormat = {
    combine: jest.fn().mockReturnThis(),
    timestamp: jest.fn().mockReturnThis(),
    printf: jest.fn().mockReturnThis(),
    colorize: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    prettyPrint: jest.fn().mockReturnThis(),
  };
  
  const mockTransport = jest.fn().mockImplementation(() => ({
    on: jest.fn()
  }));
  
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn()
  };
  
  return {
    format: mockFormat,
    transports: {
      Console: mockTransport,
      File: mockTransport
    },
    createLogger: jest.fn().mockReturnValue(mockLogger),
    addColors: jest.fn()
  };
});

describe('Logger Utility', () => {
  let originalNodeEnv;
  let originalLogLevel;
  
  beforeEach(() => {
    // Save original environment variables
    originalNodeEnv = process.env.NODE_ENV;
    originalLogLevel = process.env.LOG_LEVEL;
    
    // Reset winston mocks
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Restore original environment variables
    process.env.NODE_ENV = originalNodeEnv;
    process.env.LOG_LEVEL = originalLogLevel;
  });
  
  test('should create a logger with correct configuration', () => {
    // Arrange
    process.env.NODE_ENV = 'development';
    process.env.LOG_LEVEL = 'info';
    
    // Act
    const result = require('../../../src/utils/logger');
    
    // Assert
    expect(winston.createLogger).toHaveBeenCalled();
    expect(winston.format.combine).toHaveBeenCalled();
    expect(winston.format.timestamp).toHaveBeenCalled();
    expect(winston.format.printf).toHaveBeenCalled();
  });
  
  test('should create console transport in development environment', () => {
    // Arrange
    process.env.NODE_ENV = 'development';
    
    // Act
    const result = require('../../../src/utils/logger');
    
    // Assert
    expect(winston.transports.Console).toHaveBeenCalled();
  });
  
  test('should create file transport in production environment', () => {
    // Arrange
    process.env.NODE_ENV = 'production';
    
    // Act
    jest.resetModules();
    const result = require('../../../src/utils/logger');
    
    // Assert
    expect(winston.transports.File).toHaveBeenCalled();
  });
  
  test('should use default log level if not specified', () => {
    // Arrange
    process.env.NODE_ENV = 'development';
    delete process.env.LOG_LEVEL;
    
    // Act
    jest.resetModules();
    const result = require('../../../src/utils/logger');
    
    // Assert
    expect(winston.createLogger).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'info' // Default level
      })
    );
  });
  
  test('should use specified log level if provided', () => {
    // Arrange
    process.env.NODE_ENV = 'development';
    process.env.LOG_LEVEL = 'debug';
    
    // Act
    jest.resetModules();
    const result = require('../../../src/utils/logger');
    
    // Assert
    expect(winston.createLogger).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'debug'
      })
    );
  });
  
  test('should expose standard logging methods', () => {
    // Assert
    expect(logger.info).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.debug).toBeDefined();
    expect(logger.http).toBeDefined();
  });
  
  test('should log messages with correct level', () => {
    // Act
    logger.info('Info message');
    logger.error('Error message');
    logger.warn('Warning message');
    logger.debug('Debug message');
    
    // Assert
    expect(winston.createLogger().info).toHaveBeenCalledWith('Info message');
    expect(winston.createLogger().error).toHaveBeenCalledWith('Error message');
    expect(winston.createLogger().warn).toHaveBeenCalledWith('Warning message');
    expect(winston.createLogger().debug).toHaveBeenCalledWith('Debug message');
  });
  
  test('should log objects with metadata', () => {
    // Arrange
    const metadata = { userId: '123', action: 'login' };
    
    // Act
    logger.info('User action', metadata);
    
    // Assert
    expect(winston.createLogger().info).toHaveBeenCalledWith('User action', metadata);
  });
});
