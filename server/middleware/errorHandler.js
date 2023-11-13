exports.errorHandler = (err, req, res, next) => {
  // Handle other errors with a generic message
  res.status(500).json({ message: err });
};
