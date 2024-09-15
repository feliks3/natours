const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    logger.info(`Attempting to register user: ${email}`);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      logger.info(`User registration failed: ${email} already exists`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    logger.info(`Password hashed for user: ${email}`);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    logger.info(`User registered successfully: ${email}`);
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    logger.error(`Error registering user: ${email}, Error: ${error.message}`);
    res.status(500).json({
      message: `Error registering user: ${error.message}`,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    logger.info(`Attempting login for user: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: user not found with email: ${email}`);
      return res
        .status(401)
        .json({ message: 'Email or password is incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: incorrect password for user: ${email}`);
      return res
        .status(401)
        .json({ message: 'Email or password is incorrect' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    logger.info(`User logged in successfully: ${email}`);
    res.json({ token });
  } catch (error) {
    logger.error(
      `Error during login for user: ${email}, Error: ${error.message}`
    );
    res
      .status(500)
      .json({ message: `Error logging in user: ${error.message}` });
  }
};
