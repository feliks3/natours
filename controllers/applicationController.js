const Application = require('../models/Application');
const logger = require('../config/logger');

exports.getApplications = async (req, res) => {
  const {
    page = 1,
    limit = 5,
    search = '',
    filter = 'name',
    comparison = 'gte',
  } = req.query;

  try {
    logger.info(`Fetching applications for user: ${req.user}`);
    const skip = (page - 1) * limit;
    let searchQuery = { isDeleted: false, userId: req.user };

    if (search) {
      if (['income', 'expenses', 'assets', 'liabilities'].includes(filter)) {
        const searchNumber = parseFloat(search.trim());

        if (!isNaN(searchNumber)) {
          searchQuery[filter] = { [`$${comparison}`]: searchNumber };
        } else {
          logger.warn(
            `Invalid search value for numeric field. User: ${req.user}`
          );
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

    logger.info(`Applications fetched successfully for user: ${req.user}`);
    res.json({
      applications,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    logger.error(
      `Error fetching applications for user: ${req.user}, Error: ${error.message}`
    );
    res.status(500).json({
      message: 'Failed to retrieve applications',
      error: error.message,
    });
  }
};

exports.createApplication = async (req, res) => {
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
    logger.info(`Attempting to create application for user: ${req.user}`);
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
    logger.info(`Application created successfully for user: ${req.user}`);
    res.status(201).json(newApplication);
  } catch (error) {
    logger.error(
      `Error creating application for user: ${req.user}, Error: ${error.message}`
    );
    res
      .status(500)
      .json({ message: 'Failed to create application', error: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    logger.info(
      `Attempting to delete application: ${req.params.id} for user: ${req.user}`
    );
    const application = await Application.findById(req.params.id);

    if (!application || application.userId.toString() !== req.user) {
      logger.warn(
        `Delete failed. Application not found or unauthorized for user: ${req.user}`
      );
      return res
        .status(404)
        .json({ message: 'Application not found or unauthorized to delete' });
    }

    application.isDeleted = true;
    await application.save();

    logger.info(
      `Application deleted successfully: ${req.params.id} for user: ${req.user}`
    );
    res.json({ message: 'Application is deleted' });
  } catch (error) {
    logger.error(
      `Error deleting application: ${req.params.id} for user: ${req.user}, Error: ${error.message}`
    );
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
    logger.info(
      `Attempting to update application: ${req.params.id} for user: ${user}`
    );
    const application = await Application.findById(req.params.id);

    if (!application || application.userId.toString() !== user) {
      logger.warn(
        `Update failed. Application not found or unauthorized for user: ${user}`
      );
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
    logger.info('application', application);
    await application.save();

    logger.info(
      `Application updated successfully: ${req.params.id} for user: ${user}`
    );
    res.json(application);
  } catch (error) {
    logger.error(
      `Error updating application: ${req.params.id} for user: ${user}, Error: ${error.message}`
    );
    res
      .status(500)
      .json({ message: 'Failed to update application', error: error.message });
  }
};
