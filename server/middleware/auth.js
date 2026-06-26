const authMiddleware = (req, res, next) => {
  console.log('Auth Middleware placeholder triggered');
  
  // For now, let everyone through!
  next();
};

module.exports = authMiddleware;