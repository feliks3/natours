const mongoose = require('mongoose');
const logger = require('./logger');

const mongoURI = process.env.MONGO_URI;
logger.info(`MongoDB URI: ${mongoURI}`);

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
