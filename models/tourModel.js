const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'a tour must have a name'],
  },
  age: {
    type: Number,
    require: [true, 'a tour must have an age'],
  },
});

const Tour = mongoose.model('natours', tourSchema);
module.exports = Tour;
