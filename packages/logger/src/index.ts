/**
 * Logger Package
 * Shared logging functionality for all services
 */

import * as winston from 'winston';
import { createLogger as winstonCreateLogger, format, transports } from 'winston';

/**
 * Log levels
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  service: string;
  console?: boolean;
  file?: boolean;
  filePath?: string;
}

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  level: LogLevel.INFO,
  service: 'unknown',
  console: true,
  file: false,
  filePath: 'logs/app.log',
};

/**
 * Logger class
 */
export class Logger {
  private config: LoggerConfig;
  private logger: winston.Logger;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.logger = this.createWinstonLogger();
  }

  /**
   * Create a Winston logger instance
   * @returns Winston logger instance
   */
  private createWinstonLogger(): winston.Logger {
    const loggerTransports: winston.transport[] = [];

    // Add console transport if enabled
    if (this.config.console) {
      loggerTransports.push(
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.printf(({ timestamp, level, message, ...meta }) => {
              return `${timestamp} [${level}] [${this.config.service}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
            })
          ),
        })
      );
    }

    // Add file transport if enabled
    if (this.config.file && this.config.filePath) {
      loggerTransports.push(
        new transports.File({
          filename: this.config.filePath,
          format: format.combine(
            format.timestamp(),
            format.json()
          ),
        })
      );
    }

    // Create and return Winston logger
    return winstonCreateLogger({
      level: this.config.level.toString(),
      defaultMeta: { service: this.config.service },
      transports: loggerTransports,
    });
  }

  /**
   * Log an error message
   * @param message The message to log
   * @param meta Additional metadata
   */
  error(message: string, meta: Record<string, any> = {}): void {
    this.logger.error(message, meta);
  }

  /**
   * Log a warning message
   * @param message The message to log
   * @param meta Additional metadata
   */
  warn(message: string, meta: Record<string, any> = {}): void {
    this.logger.warn(message, meta);
  }

  /**
   * Log an info message
   * @param message The message to log
   * @param meta Additional metadata
   */
  info(message: string, meta: Record<string, any> = {}): void {
    this.logger.info(message, meta);
  }

  /**
   * Log a debug message
   * @param message The message to log
   * @param meta Additional metadata
   */
  debug(message: string, meta: Record<string, any> = {}): void {
    this.logger.debug(message, meta);
  }
}

/**
 * Create a new logger instance
 * @param config Logger configuration
 * @returns A new logger instance
 */
export const createLogger = (config: Partial<LoggerConfig> = {}): Logger => {
  return new Logger(config);
};

export default {
  createLogger,
  LogLevel,
};
