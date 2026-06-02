const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    message: "Admin access required",
  });
};

const isPlanner = (req, res, next) => {
  if (req.user && req.user.role === "planner") {
    return next();
  }

  return res.status(403).json({
    message: "Planner access required",
  });
};

const isApprovedPlanner = (req, res, next) => {
  if (
    req.user &&
    req.user.role === "planner" &&
    req.user.plannerStatus === "approved"
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Planner account is not approved yet",
  });
};

module.exports = {
  isAdmin,
  isPlanner,
  isApprovedPlanner,
};