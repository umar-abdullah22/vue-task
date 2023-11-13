const errorHandler = (err, req, res, next) => {
  console.error('Error: ', err);

  // Handle other errors with a generic message
  res.status(500).json({ message: err });
};

export default errorHandler;
