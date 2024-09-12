// server.js

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes'); // 新增
const cors = require('cors');
const path = require('path');

// 加载环境变量

// 连接到数据库
connectDB();

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: 'http://localhost:3000', // 只允许来自 http://localhost:3000 的请求
  })
);
// 中间件
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes); // 新增
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
