// routes/applicationRoutes.js
const express = require('express');
const {
  getApplications,
  createApplication,
  deleteApplication,
  updateApplication,
} = require('../controllers/applicationController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// 获取应用程序列表
router.get('/', authenticate, getApplications);

// 创建新的应用程序
router.post('/', authenticate, createApplication);

// 删除应用程序
router.delete('/:id', authenticate, deleteApplication);

// 更新应用程序
router.put('/:id', authenticate, updateApplication);

module.exports = router;
