/**
 * Admin-only middleware — restricts access to users with the 'admin' role.
 * Must be used AFTER the protect middleware (req.user must exist).
 */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden — admin access only',
    });
  }
  next();
};

module.exports = { adminOnly };
