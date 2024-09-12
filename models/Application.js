// models/Application.js
const mongoose = require('mongoose');

// 定义应用程序Schema
const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// 创建并导出模型
module.exports = mongoose.model('Application', applicationSchema);
