exports.errorHandler = (err, req, res, next) => {
  console.error('Error:sdsdsdsdsdsdsd', err);
  console.log('hgeyrguwkyg');
  // Handle other errors with a generic message
  res.status(500).json({ message: err });
};
