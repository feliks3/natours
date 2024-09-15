const mongoose = require('mongoose');
const logger = require('../config/logger');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', function (next) {
  if (this.isNew) {
    logger.info(`New user is being created: ${this.email}`);
  } else {
    logger.info(`User is being updated: ${this.email}`);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
