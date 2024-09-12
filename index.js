// /index.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = 3001; // 你可以使用任意端口
const SECRET_KEY = 'your_secret_key'; // 这个密钥用于签署 JWT，请在生产环境中使用一个更安全的密钥
const mongoURI =
  'mongodb+srv://felikslyu:dXLmmahiSUFuAkgD@cluster0.kninbn4.mongodb.net/';

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.use(
  cors({
    origin: 'http://localhost:3000', // 只允许来自 http://localhost:3000 的请求
  })
);
app.use(express.json());

// 模拟用户数据库
const users = [
  {
    id: 1,
    username: 'asdf',
    password: '$2a$10$Mpif.bOBuXRhtCjg8LJ31OYC5iepqHddYks1IKYumdABpz7HxVujO', // "password" 的哈希
  },
];

// 用户登录接口
app.post('/login', async (req, res) => {
  // 设定一个明文密码
  const plaintextPassword = 'YourPassword123';

  // 同步生成盐并加密密码
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(plaintextPassword, salt);

  console.log('加密后的密码:', hashedPassword);

  const { username, password } = req.body;
  console.log(username, password);

  // 在数据库中查找用户
  const user = users.find((u) => u.username === username);
  console.log(user);

  if (!user) {
    return res.status(400).json({ message: '用户名或密码错误' });
  }

  // 检查密码是否正确
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log('isPasswordValid', isPasswordValid);
  if (!isPasswordValid) {
    return res.status(400).json({ message: '用户名或密码错误' });
  }

  // 生成 JWT 令牌
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: '1h', // 令牌有效期为 1 小时
  });

  res.json({ token });
});

// 保护路由示例：只有登录的用户才能访问
app.get('/protected', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: '未授权访问' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, SECRET_KEY);
    res.json({ message: `Hello ${user.username}, 你已成功访问受保护的路由！` });
  } catch (error) {
    res.status(401).json({ message: '令牌无效或已过期' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
//
