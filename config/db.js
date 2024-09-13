const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;
console.log('mongoURI', mongoURI);

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
