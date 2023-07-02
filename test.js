const Logger = require('./index');

const logger = new Logger({ level: 'debug' });

logger.info('Hello, info log!');
logger.debug('Hello, debug log!');
logger.warn('Hello, warn log!');
logger.error('Hello, error log!');


