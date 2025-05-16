// src/index.ts
import { createLogger as winstonCreateLogger, format, transports } from "winston";
var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
  LogLevel2["ERROR"] = "error";
  LogLevel2["WARN"] = "warn";
  LogLevel2["INFO"] = "info";
  LogLevel2["DEBUG"] = "debug";
  return LogLevel2;
})(LogLevel || {});
var defaultConfig = {
  level: "info" /* INFO */,
  service: "unknown",
  console: true,
  file: false,
  filePath: "logs/app.log"
};
var Logger = class {
  config;
  logger;
  constructor(config = {}) {
    this.config = { ...defaultConfig, ...config };
    this.logger = this.createWinstonLogger();
  }
  /**
   * Create a Winston logger instance
   * @returns Winston logger instance
   */
  createWinstonLogger() {
    const loggerTransports = [];
    if (this.config.console) {
      loggerTransports.push(
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.printf(({ timestamp, level, message, ...meta }) => {
              return `${timestamp} [${level}] [${this.config.service}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
            })
          )
        })
      );
    }
    if (this.config.file && this.config.filePath) {
      loggerTransports.push(
        new transports.File({
          filename: this.config.filePath,
          format: format.combine(
            format.timestamp(),
            format.json()
          )
        })
      );
    }
    return winstonCreateLogger({
      level: this.config.level.toString(),
      defaultMeta: { service: this.config.service },
      transports: loggerTransports
    });
  }
  /**
   * Log an error message
   * @param message The message to log
   * @param meta Additional metadata
   */
  error(message, meta = {}) {
    this.logger.error(message, meta);
  }
  /**
   * Log a warning message
   * @param message The message to log
   * @param meta Additional metadata
   */
  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }
  /**
   * Log an info message
   * @param message The message to log
   * @param meta Additional metadata
   */
  info(message, meta = {}) {
    this.logger.info(message, meta);
  }
  /**
   * Log a debug message
   * @param message The message to log
   * @param meta Additional metadata
   */
  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }
};
var createLogger = (config = {}) => {
  return new Logger(config);
};
var src_default = {
  createLogger,
  LogLevel
};
export {
  LogLevel,
  Logger,
  createLogger,
  src_default as default
};
