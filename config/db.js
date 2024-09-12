// config/db.js

const mongoose = require('mongoose');

// 从环境变量中获取 MongoDB URI
const mongoURI = process.env.MONGO_URI;
console.log('mongoURI', mongoURI);
// 连接到 MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // 连接失败时退出进程
  }
};

module.exports = connectDB;
