const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res, next) => {
  const tours = await Tour.find();
  console.log(tours);
  console.log('-----------');
  console.log(Tour);
  console.log('===========');
  res.status(200).json({
    status: 'success',
    data: { tours },
  });
};
