const fs = require("fs");
const path = require("path");

class Logger {
  constructor(options = {}) {
    this.level = options.level || "info";
    this.format = options.format || "text";
    this.apiStats = {}; // To store API statistics
    // Log file configuration
    this.isFileLogging = options.isFileLogging || false;
    this.logFilePath = options.logFilePath || path.join(__dirname, "logs.log");
    this.maxLogAge = options.maxLogAge || 2 * 30 * 24 * 60 * 60 * 1000; // 2 months in milliseconds
  }

  log(level, message) {
    if (this.shouldLog(level)) {
      const timestamp = new Date().toISOString();
      const coloredTimestamp = `\x1b[90m${timestamp}\x1b[0m`;
      const coloredLevel = this.getColorizedLevel(level);
      const logMessage = `[${coloredTimestamp}] [${coloredLevel}] ${message}`;
      console.log(logMessage);
      // Remove ANSI escape codes before writing to the log file
      const logMessageWithoutEscapeCodes = logMessage.replace(
        /\x1b\[\d+m/g,
        ""
      );
      if (this.isFileLogging == true) {
        // Append log to log file
        fs.appendFile(
          this.logFilePath,
          `${logMessageWithoutEscapeCodes}\n`,
          (err) => {
            if (err) {
              console.error(`Error writing to log file: ${err}`);
            }
          }
        );
      }
    }
  }

  shouldLog(level) {
    const levels = ["error", "warn", "info", "debug"];
    const levelIndex = levels.indexOf(level);
    const currentLevelIndex = levels.indexOf(this.level);
    return levelIndex >= 0 && levelIndex >= currentLevelIndex;
  }

  clearLogs() {
    fs.writeFile(this.logFilePath, "", (err) => {
      if (err) {
        console.error(`Error clearing log file: ${err}`);
      } else {
        console.log("Log file cleared.");
      }
    });
  }

  getColorizedLevel(level) {
    switch (level) {
      case "error":
        return `\x1b[31m${level.toUpperCase()}\x1b[0m`;
      case "warn":
        return `\x1b[33m${level.toUpperCase()}\x1b[0m`;
      case "info":
        return `\x1b[32m${level.toUpperCase()}\x1b[0m`;
      case "debug":
        return `\x1b[34m${level.toUpperCase()}\x1b[0m`;
      default:
        return level.toUpperCase();
    }
  }

  error(message) {
    this.log("error", message);
  }

  warn(message) {
    this.log("warn", message);
  }

  info(message) {
    this.log("info", message);
  }

  debug(message) {
    this.log("debug", message);
  }

  incrementApiStats(apiName, status) {
    if (!this.apiStats[apiName]) {
      this.apiStats[apiName] = {
        success: 0,
        error: 0,
        called:0,
      };
    }
    this.apiStats[apiName][status]++;
  }

  getAPIStats() {
    return this.apiStats;
  }

  middleware(req, res, next) {
    const { method, path, ip, headers } = req;

    const apiName = `PATH:[${path}]`;
    const userAgent = headers["user-agent"];

    this.info(
      `Received request: ${apiName} - IP: ${ip} - User Agent: ${userAgent}`
    );

    this.incrementApiStats(path, "called");

    const start = process.hrtime();
    res.on("finish", (event) => {
      const end = process.hrtime(start);
      const duration = (end[0] * 1e3 + end[1] / 1e6).toFixed(2);
      const success = res.statusCode >= 200 && res.statusCode < 400;
      const status = success ? "Success" : "Failure";

      const logMessage = `API ${apiName} ${status}. Execution Time: ${duration}ms`;
      this.info(logMessage);
      this.incrementApiStats(path, success ? "success" : "error");
    });

    next();
  }

  getApiAnalytics() {
    if(this.isFileLogging==false){
      return this.apiStats
    }
    const logContent = fs.readFileSync(this.logFilePath, "utf-8");
    const logLines = logContent.split("\n");

    let apiAnalytics = {};

    const regexPattern = /API PATH:\[(.*?)\]/i;

    for (const logLine of logLines) {
      const match = logLine.match(regexPattern);
      if (match) {
        const apiName = match[1];

        if (!apiAnalytics[apiName]) {
          apiAnalytics[apiName] = {
            totalRequests: 0,
            successCount: 0,
            errorCount: 0,
          };
        }

        apiAnalytics[apiName].totalRequests++;

        if (logLine.includes("[INFO]")) {
          apiAnalytics[apiName].successCount++;
        } else if (logLine.includes("[ERROR]")) {
          apiAnalytics[apiName].errorCount++;
        }
      }
    }

    return apiAnalytics;
  }
}

module.exports = Logger;
