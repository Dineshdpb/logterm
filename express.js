const express = require('express');
const Logger = require('./logger');

const app = express();
const logger = new Logger({
    isFileLogging:false
});

app.use(logger.middleware.bind(logger));
  
// API routes
app.get('/users', (req, res) => {
  // Your API logic here

  // Logging the response
  const apiName = `${req.method.toUpperCase()} ${req.path}`;
  const success = true; // or false, depending on the result
  const message = `Returned response for: ${apiName}`;
    // throw new Error("ss")
//   logger.info(message, apiName);
//   if (success) {
//     logger.incrementApiStats(apiName, 'info');
//   } else {
//     logger.incrementApiStats(apiName, 'error');
//   }

  // Send the response
  res.send('Response');
});

// Get API statistics
app.get('/stats', (req, res) => {
  logger.debug('This is a debug message');

  const apiStats = logger.getApiAnalytics('users');

  res.json(apiStats);
});

// Error handler
app.use((err, req, res, next) => {
  // Handle errors and log them if necessary
  logger.error(err.message);

  res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
