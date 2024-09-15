const dotenv = require('dotenv');
const logger = require('./config/logger');
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenv.config({ path: envFile });

logger.info(`Loaded environment variables from ${envFile}`);
