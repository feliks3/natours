const Application = require('../models/Application');

exports.getApplications = async (req, res) => {
  const {
    page = 1,
    limit = 5,
    search = '',
    filter = 'name',
    comparison = 'gte',
  } = req.query;
  console.log(req.query);
  try {
    const skip = (page - 1) * limit;
    let searchQuery = { isDeleted: false, userId: req.user };

    if (search) {
      if (['income', 'expenses', 'assets', 'liabilities'].includes(filter)) {
        const searchNumber = parseFloat(search.trim());

        if (!isNaN(searchNumber)) {
          searchQuery[filter] = { [`$${comparison}`]: searchNumber };
        } else {
          return res
            .status(400)
            .json({ message: 'Invalid search value for numeric field.' });
        }
      } else {
        searchQuery[filter] = { $regex: search, $options: 'i' };
      }
    }

    const applications = await Application.find(searchQuery)
      .limit(limit * 1)
      .skip(skip)
      .exec();

    const totalCount = await Application.countDocuments(searchQuery);

    res.json({
      applications,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Failed to retrieve applications',
        error: error.message,
      });
  }
};

exports.createApplication = async (req, res) => {
  console.log('create application');
  const {
    name,
    description,
    personalDetails,
    income,
    expenses,
    assets,
    liabilities,
  } = req.body;
  try {
    const newApplication = new Application({
      name,
      description,
      personalDetails,
      income,
      expenses,
      assets,
      liabilities,
      userId: req.user,
    });
    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to create application', error: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    console.log('delete', req.params);
    const application = await Application.findById(req.params.id);

    if (!application || application.userId.toString() !== req.user) {
      console.log('delete 1');
      return res
        .status(404)
        .json({ message: 'Application not found or unauthorized to delete' });
    }

    application.isDeleted = true;
    await application.save();

    res.json({ message: 'Application marked as deleted' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to delete application', error: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  const {
    name,
    description,
    personalDetails,
    income,
    expenses,
    assets,
    liabilities,
  } = req.body;
  const user = req.user;

  try {
    const application = await Application.findById(req.params.id);
    if (!application || application.userId.toString() !== req.user) {
      return res
        .status(404)
        .json({ message: 'Application not found or unauthorized to update' });
    }

    application.name = name;
    application.description = description;
    application.personalDetails = personalDetails;
    application.income = income;
    application.expenses = expenses;
    application.assets = assets;
    application.liabilities = liabilities;
    await application.save();
    res.json(application);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to update application', error: error.message });
  }
};
