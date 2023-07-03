# LogTerm

[![npm version](https://img.shields.io/npm/v/logterm.svg)](https://www.npmjs.com/package/logterm)
[![License](https://img.shields.io/npm/l/logterm.svg)](https://github.com/your-username/logterm/blob/main/LICENSE)

LogTerm is a simple logging utility for Node.js applications. It provides functionality to log messages with different log levels, store API statistics, and analyze API usage based on log files.

Installation
To install the Logger package, use npm:



## Installation

You can install LogTerm using npm:

```shell
npm install logterm
```

## Usage
Here's an example of how to use the Logger package in your Node.js application:


```shell
const Logger = require('logterm');

// Create a new instance of the Logger
const logger = new Logger({
  level: 'info', // Set the minimum log level to display (default: "info")
  format: 'text', // Set the log format (default: "text")
  isFileLogging: true, // Enable logging to a file (default: false)
  logFilePath: 'logs.log', // Set the path to the log file (default: "logs.log")
  maxLogAge: 2 * 30 * 24 * 60 * 60 * 1000, // Set the maximum log age in milliseconds (default: 2 months)
});

// Log messages with different log levels
logger.error('This is an error message');
logger.warn('This is a warning message');
logger.info('This is an information message');
logger.debug('This is a debug message');

// Middleware example for Express.js
app.use(logger.middleware);

// Clear the log file
logger.clearLogs();

// Get API statistics
const apiStats = logger.getAPIStats();
console.log(apiStats);

// Get API analytics from log file
const apiAnalytics = logger.getApiAnalytics();
console.log(apiAnalytics);


```



 Express Example:

```shell
const express = require('express');
const logger = require('custom-logger');

const app = express();

// Custom logger middleware
app.use((req, res, next) => {
  const { method, url } = req;
  const apiPath = `${method.toUpperCase()} ${url}`;

  logger.info(`[${apiPath}] Request received`);

  // Log the API response
  res.on('finish', () => {
    logger.info(`[${apiPath}] Response sent`);
  });

  next();
});

// Example route handler
app.get('/api', (req, res) => {
  res.json({ message: 'API response' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

```



##  Configuration Options
The Logger class accepts an options object during initialization with the following configuration options:

level (optional): The minimum log level to display (default: "info").

format (optional): The log format (default: "text").

isFileLogging (optional): Whether to log messages to a file (default: false).

logFilePath (optional): The path to the log file (default: "logs.log").

maxLogAge (optional): The maximum age of log files in milliseconds (default: 2 months).

## Log Levels
The logger supports the following log levels:

error: For logging error messages.
warn: For logging warning messages.
info: For logging informational messages.
debug: For logging debug messages.
##  API Statistics
The incrementApiStats(apiName, status) method allows you to increment API statistics. The apiName parameter represents the name of the API, and the status parameter can be either "success" or "error".

The getAPIStats() method returns the current API statistics as an object.

## Middleware
The middleware function can be used as middleware in Express.js to log incoming requests and measure execution time. It automatically logs the API name, IP address, and user agent.

## API Analytics
The getApiAnalytics() method retrieves API analytics from the log file. It returns an object that contains the total number of requests, success counts, and error counts for each API. If file logging is not enabled, it returns the API statistics stored in memory.

