"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  LogLevel: () => LogLevel,
  Logger: () => Logger,
  createLogger: () => createLogger,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_winston = require("winston");
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
        new import_winston.transports.Console({
          format: import_winston.format.combine(
            import_winston.format.colorize(),
            import_winston.format.timestamp(),
            import_winston.format.printf(({ timestamp, level, message, ...meta }) => {
              return `${timestamp} [${level}] [${this.config.service}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
            })
          )
        })
      );
    }
    if (this.config.file && this.config.filePath) {
      loggerTransports.push(
        new import_winston.transports.File({
          filename: this.config.filePath,
          format: import_winston.format.combine(
            import_winston.format.timestamp(),
            import_winston.format.json()
          )
        })
      );
    }
    return (0, import_winston.createLogger)({
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LogLevel,
  Logger,
  createLogger
});
