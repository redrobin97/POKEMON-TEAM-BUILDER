function requireUser(req, res, next) {
  if (!req.user) {
    res.status(401);
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }
  next();
}

function requireAdmin(req, res, next) {
  const role = req.user && req.user.role;
  if (!req.user || role !== "admin") {
    res.status(401);
    next({
      name: "AuthorizationError",
      message: "You are not authorized to perform this action",
    });
  }
  next();
}

module.exports = { requireUser, requireAdmin };
