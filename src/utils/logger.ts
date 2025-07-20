import { config } from './config';

interface LogLevel {
  error: 0;
  warn: 1;
  info: 2;
  debug: 3;
}

const logLevels: LogLevel = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

class Logger {
  private currentLevel: number;

  constructor() {
    this.currentLevel = logLevels[config.logLevel as keyof LogLevel] || logLevels.info;
  }

  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.length > 0 ? ' ' + args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ') : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${formattedArgs}`;
  }

  error(message: string, ...args: any[]): void {
    if (this.currentLevel >= logLevels.error) {
      console.error(this.formatMessage('error', message, ...args));
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.currentLevel >= logLevels.warn) {
      console.warn(this.formatMessage('warn', message, ...args));
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.currentLevel >= logLevels.info) {
      console.info(this.formatMessage('info', message, ...args));
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.currentLevel >= logLevels.debug) {
      console.debug(this.formatMessage('debug', message, ...args));
    }
  }
}

export const logger = new Logger();
