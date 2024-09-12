// models/User.js

const mongoose = require('mongoose');

// 定义用户Schema
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

// 创建并导出模型
module.exports = mongoose.model('User', userSchema);
