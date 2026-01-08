module.exports = (requiredPermission) => {
  return (req, res, next) => {
    const permissions = req.user?.permissions;

    if (!permissions) {
      return res.status(403).json({ message: "Permissions not found" });
    }

    if (!permissions[requiredPermission]) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }

    next();
  };
};
