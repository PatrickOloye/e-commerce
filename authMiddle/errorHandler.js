exports.errorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ msg: 'user is unauthorized' });
  }
  if (err.name === 'ValidationError') {
    return res.status(401).json({ msg: 'something is wrong, fix it!!' });
  }

  return res.status(500).json({ msg: err });
};
