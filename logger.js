const moment = require('moment');

class Logger {
  constructor(options = {}) {
    this.level = options.level || 'info';
    this.format = options.format || 'text';
    // You can add more options and configuration properties here
  }

  log(level, message) {
    if (this.shouldLog(level)) {
      const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
      const logMessage = `[${timestamp}] [${level.toUpperCase()}] 
${message}`;
      console.log(logMessage);
    }
  }

  shouldLog(level) {
    const levels = ['error', 'warn', 'info', 'debug'];
    const levelIndex = levels.indexOf(level);
    const currentLevelIndex = levels.indexOf(this.level);
    return levelIndex >= 0 && levelIndex >= currentLevelIndex;
  }

  error(message) {
    this.log('error', message);
  }

  warn(message) {
    this.log('warn', message);
  }

  info(message) {
    this.log('info', message);
  }

  debug(message) {
    this.log('debug', message);
  }
}

module.exports = Logger;

