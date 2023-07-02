# LogTerm

[![npm version](https://img.shields.io/npm/v/logterm.svg)](https://www.npmjs.com/package/logterm)
[![License](https://img.shields.io/npm/l/logterm.svg)](https://github.com/your-username/logterm/blob/main/LICENSE)

LogTerm is a custom logger package for logging API requests and responses in Node.js applications.

## Installation

You can install LogTerm using npm:

```shell
npm install logterm


## Usage

1. Express Example:

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




