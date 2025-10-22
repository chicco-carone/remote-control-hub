// eslint-disable @typescript-eslint/no-explicit-any
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});

class Logger {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(...args: any[]) {
    logger.info(`[${this.prefix}]`, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(...args: any[]) {
    logger.error(`[${this.prefix}]`, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(...args: any[]) {
    logger.debug(`[${this.prefix}]`, ...args);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(...args: any[]) {
    logger.warn(`[${this.prefix}]`, ...args);
  }
}

export default Logger;
