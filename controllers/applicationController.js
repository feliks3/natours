// controllers/applicationController.js

const Application = require('../models/Application');

// 获取当前用户的所有应用程序，支持分页
exports.getApplications = async (req, res) => {
  console.log('req.query', req.query);
  const { page = 1, limit = 5 } = req.query; // 从请求的查询参数中获取页码和每页数量，默认值为1和5
  console.log('page', page);
  console.log('limit', limit);
  try {
    // 计算要跳过的文档数量
    const skip = (page - 1) * limit;

    // 获取当前页的数据
    const applications = await Application.find({ userId: req.user })
      .limit(limit * 1) // 设置每页显示的数量
      .skip(skip) // 跳过前面几页的数据
      .exec();

    // 获取总的记录数以计算总页数
    const totalCount = await Application.countDocuments({ userId: req.user });

    res.json({
      applications, // 当前页的数据
      totalPages: Math.ceil(totalCount / limit), // 计算总页数
      currentPage: Number(page), // 当前页码
    });
  } catch (error) {
    res.status(500).json({ message: '获取应用程序失败', error: error.message });
  }
};

// 创建新的应用程序
exports.createApplication = async (req, res) => {
  console.log('create application');
  const { name, description } = req.body;

  try {
    const newApplication = new Application({
      name,
      description,
      userId: req.user,
    });
    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(500).json({ message: '创建应用程序失败', error: error.message });
  }
};

// 删除应用程序
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application || application.userId.toString() !== req.user) {
      return res.status(404).json({ message: '应用程序不存在或无权删除' });
    }

    await application.remove();
    res.json({ message: '应用程序已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除应用程序失败', error: error.message });
  }
};

// 更新应用程序
exports.updateApplication = async (req, res) => {
  // console.log('update application', req.body, req.user, req.params);
  const { id, name, description } = req.body;
  const user = req.user;

  try {
    // console.log('application0', req.params.id);
    const application = await Application.findById(req.params.id);
    // console.log('application1');
    if (!application || application.userId.toString() !== req.user) {
      return res.status(404).json({ message: '应用程序不存在或无权更新' });
    }
    // console.log('application2');

    application.name = name;
    application.description = description;
    application.userId = user;
    // console.log('before save');
    await application.save();
    // console.log('after save');
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: '更新应用程序失败', error: error.message });
  }
};
