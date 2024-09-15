const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

exports.authenticate = (req, res, next) => {
  logger.info('Authentication middleware triggered');
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    logger.warn('No token provided, authorization denied');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    logger.info('Token received, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info('Token verified successfully');
    req.user = decoded.userId;
    logger.info(`User authenticated: ${req.user}`);
    next();
  } catch (error) {
    logger.error(`Token verification failed: ${error.message}`);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
