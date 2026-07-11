/*!
 * @file Authentication middleware placeholder.
 * @brief Logs invocation and forwards all requests downstream.
 */

/**
 * @brief Authentication middleware placeholder.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware callback.
 */
const authMiddleware = (req, res, next) => {
  console.log('Auth Middleware placeholder triggered');
  
  // For now, let everyone through!
  next();
};

module.exports = authMiddleware;